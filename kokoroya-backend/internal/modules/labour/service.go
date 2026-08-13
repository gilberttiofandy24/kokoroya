package labour

import (
	"context"
	"time"

	"kokoroya-backend/internal/modules/branch"
)

const dateLayout = "2006-01-02"

// Fallback gross rate (already includes superannuation) used when a branch
// has never set its own weekly rate, matching the reference project's
// defaults (33.05 base wage x 1.12 super / 39.66 base wage x 1.12 super).
const (
	fallbackWeekdayRate = 37.02
	fallbackWeekendRate = 44.42
)

type EmployeeWeekRow struct {
	UserID          int64              `json:"user_id"`
	Name            string             `json:"name"`
	DailyHours      map[string]float64 `json:"daily_hours"`
	TotalHours      float64            `json:"total_hours"`
	PercentageOfAll float64            `json:"percentage_of_all"`
}

type LabourDayInfo struct {
	StaffCount int     `json:"staff_count"`
	TotalHours float64 `json:"total_hours"`
	LabourCost float64 `json:"labour_cost"`
	IsWeekend  bool    `json:"is_weekend"`
}

type WeeklyReport struct {
	WeekStartDate string                   `json:"week_start_date"`
	WeekEndDate   string                   `json:"week_end_date"`
	Employees     []EmployeeWeekRow        `json:"employees"`
	LabourDaily   map[string]LabourDayInfo `json:"labour_daily"`
	LabourTotal   float64                  `json:"labour_total"`
	WeekdayRate   float64                  `json:"weekday_rate"`
	WeekendRate   float64                  `json:"weekend_rate"`
}

type Service interface {
	GetWeeklyReport(ctx context.Context, branchID int64, weekStart time.Time) (*WeeklyReport, error)
	UpsertHourEntry(ctx context.Context, branchID, userID int64, date time.Time, hours float64) error
	UpsertWeeklyRate(ctx context.Context, branchID int64, weekStart time.Time, weekdayRate, weekendRate float64) error
}

type service struct {
	repo       Repository
	branchRepo branch.Repository
}

func NewService(repo Repository, branchRepo branch.Repository) Service {
	return &service{repo: repo, branchRepo: branchRepo}
}

// rateForDay resolves the rate to charge for hours worked on date: the
// employee's own rate if they have one set, otherwise the branch's weekly
// gross rate, otherwise the hardcoded fallback.
func rateForDay(date time.Time, weekdayRate, weekendRate *float64, branchWeekdayRate, branchWeekendRate float64) float64 {
	isWeekend := date.Weekday() == time.Saturday || date.Weekday() == time.Sunday

	if !isWeekend && weekdayRate != nil {
		return *weekdayRate
	}
	if isWeekend && weekendRate != nil {
		return *weekendRate
	}
	if isWeekend {
		return branchWeekendRate
	}
	return branchWeekdayRate
}

func (s *service) GetWeeklyReport(ctx context.Context, branchID int64, weekStart time.Time) (*WeeklyReport, error) {
	weekEnd := weekStart.AddDate(0, 0, 6)
	weekDates := make([]string, 7)
	for i := range weekDates {
		weekDates[i] = weekStart.AddDate(0, 0, i).Format(dateLayout)
	}

	employees, err := s.branchRepo.ListEmployees(ctx, branchID)
	if err != nil {
		return nil, err
	}

	entries, err := s.repo.ListHourEntries(ctx, branchID, weekStart, weekEnd)
	if err != nil {
		return nil, err
	}
	hoursByUser := make(map[int64]map[string]float64)
	for _, e := range entries {
		if hoursByUser[e.UserID] == nil {
			hoursByUser[e.UserID] = make(map[string]float64)
		}
		hoursByUser[e.UserID][e.EntryDate.Format(dateLayout)] = e.TotalHours
	}

	weekdayRate, weekendRate := fallbackWeekdayRate, fallbackWeekendRate
	if wd, we, ok, err := s.repo.FindWeeklyRate(ctx, branchID, weekStart); err != nil {
		return nil, err
	} else if ok {
		weekdayRate, weekendRate = wd, we
	}

	rows := make([]EmployeeWeekRow, 0, len(employees))
	var weekTotalHours float64
	for _, employee := range employees {
		daily := make(map[string]float64, 7)
		var total float64
		for _, d := range weekDates {
			hours := hoursByUser[employee.ID][d]
			daily[d] = hours
			total += hours
		}
		weekTotalHours += total
		rows = append(rows, EmployeeWeekRow{
			UserID:     employee.ID,
			Name:       employee.Name,
			DailyHours: daily,
			TotalHours: total,
		})
	}
	for i := range rows {
		if weekTotalHours > 0 {
			rows[i].PercentageOfAll = rows[i].TotalHours / weekTotalHours * 100
		}
	}

	labourDaily := make(map[string]LabourDayInfo, 7)
	var labourTotal float64
	for i, d := range weekDates {
		date := weekStart.AddDate(0, 0, i)
		var dayHours float64
		var dayCost float64
		var staffCount int
		for _, employee := range employees {
			hours := hoursByUser[employee.ID][d]
			if hours <= 0 {
				continue
			}
			dayHours += hours
			staffCount++
			dayCost += hours * rateForDay(date, employee.RateWeekday, employee.RateWeekend, weekdayRate, weekendRate)
		}
		labourDaily[d] = LabourDayInfo{
			StaffCount: staffCount,
			TotalHours: dayHours,
			LabourCost: dayCost,
			IsWeekend:  date.Weekday() == time.Saturday || date.Weekday() == time.Sunday,
		}
		labourTotal += dayCost
	}

	return &WeeklyReport{
		WeekStartDate: weekStart.Format(dateLayout),
		WeekEndDate:   weekEnd.Format(dateLayout),
		Employees:     rows,
		LabourDaily:   labourDaily,
		LabourTotal:   labourTotal,
		WeekdayRate:   weekdayRate,
		WeekendRate:   weekendRate,
	}, nil
}

func (s *service) UpsertHourEntry(ctx context.Context, branchID, userID int64, date time.Time, hours float64) error {
	return s.repo.UpsertHourEntry(ctx, branchID, userID, date, hours)
}

func (s *service) UpsertWeeklyRate(ctx context.Context, branchID int64, weekStart time.Time, weekdayRate, weekendRate float64) error {
	return s.repo.UpsertWeeklyRate(ctx, branchID, weekStart, weekdayRate, weekendRate)
}
