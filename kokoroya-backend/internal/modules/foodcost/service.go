package foodcost

import (
	"context"
	"time"
)

const dateLayout = "2006-01-02"
const fallbackNetSalesRate = 0.9

type SupplierWeekRow struct {
	SupplierID      int64              `json:"supplier_id"`
	SupplierName    string             `json:"supplier_name"`
	DailyAmounts    map[string]float64 `json:"daily_amounts"`
	Total           float64            `json:"total"`
	PercentageOfAll float64            `json:"percentage_of_all"`
}

type WeeklyReport struct {
	WeekStartDate      string             `json:"week_start_date"`
	WeekEndDate        string             `json:"week_end_date"`
	Suppliers          []SupplierWeekRow  `json:"suppliers"`
	GrandTotalPurchase float64            `json:"grand_total_purchase"`
	GrossSalesDaily    map[string]float64 `json:"gross_sales_daily"`
	GrossSalesTotal    float64            `json:"gross_sales_total"`
	NetSales           float64            `json:"net_sales"`
	NetSalesRate       float64            `json:"net_sales_rate"`
	PurchaseRatioPct   float64            `json:"purchase_ratio_pct"`
}

type Service interface {
	GetWeeklyReport(ctx context.Context, branchID int64, weekStart time.Time) (*WeeklyReport, error)
	UpsertPurchaseEntry(ctx context.Context, branchID, supplierID int64, date time.Time, amount float64) error
	UpsertGrossSales(ctx context.Context, branchID int64, date time.Time, amount float64) error
	UpsertNetSalesRate(ctx context.Context, branchID int64, weekStart time.Time, rate float64) error
	ListSuppliers(ctx context.Context, branchID int64) ([]*Supplier, error)
	CreateSupplier(ctx context.Context, branchID int64, name string) (*Supplier, error)
	UpdateSupplier(ctx context.Context, id int64, fields SupplierUpdateFields) (*Supplier, error)
	DeleteSupplier(ctx context.Context, id int64) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetWeeklyReport(ctx context.Context, branchID int64, weekStart time.Time) (*WeeklyReport, error) {
	weekEnd := weekStart.AddDate(0, 0, 6)
	weekDates := make([]string, 7)
	for i := range weekDates {
		weekDates[i] = weekStart.AddDate(0, 0, i).Format(dateLayout)
	}

	suppliers, err := s.repo.ListSuppliers(ctx, branchID)
	if err != nil {
		return nil, err
	}

	entries, err := s.repo.ListPurchaseEntries(ctx, branchID, weekStart, weekEnd)
	if err != nil {
		return nil, err
	}
	entriesBySupplier := make(map[int64]map[string]float64)
	for _, e := range entries {
		if entriesBySupplier[e.SupplierID] == nil {
			entriesBySupplier[e.SupplierID] = make(map[string]float64)
		}
		entriesBySupplier[e.SupplierID][e.PurchaseDate.Format(dateLayout)] = e.Amount
	}

	grossEntries, err := s.repo.ListGrossSales(ctx, branchID, weekStart, weekEnd)
	if err != nil {
		return nil, err
	}
	grossByDate := make(map[string]float64)
	for _, g := range grossEntries {
		grossByDate[g.SalesDate.Format(dateLayout)] = g.Amount
	}

	netSalesRate := fallbackNetSalesRate
	if rate, ok, err := s.repo.FindNetSalesRate(ctx, branchID, weekStart); err != nil {
		return nil, err
	} else if ok {
		netSalesRate = rate
	}

	rows := make([]SupplierWeekRow, 0, len(suppliers))
	var grandTotal float64
	for _, supplier := range suppliers {
		daily := make(map[string]float64, 7)
		var total float64
		for _, d := range weekDates {
			amount := entriesBySupplier[supplier.ID][d]
			daily[d] = amount
			total += amount
		}
		grandTotal += total
		rows = append(rows, SupplierWeekRow{
			SupplierID:   supplier.ID,
			SupplierName: supplier.Name,
			DailyAmounts: daily,
			Total:        total,
		})
	}
	for i := range rows {
		if grandTotal > 0 {
			rows[i].PercentageOfAll = rows[i].Total / grandTotal * 100
		}
	}

	grossFilled := make(map[string]float64, 7)
	var grossTotal float64
	for _, d := range weekDates {
		grossFilled[d] = grossByDate[d]
		grossTotal += grossByDate[d]
	}

	netSales := grossTotal * netSalesRate
	var purchaseRatioPct float64
	if netSales > 0 {
		purchaseRatioPct = grandTotal / netSales * 100
	}

	return &WeeklyReport{
		WeekStartDate:      weekStart.Format(dateLayout),
		WeekEndDate:        weekEnd.Format(dateLayout),
		Suppliers:          rows,
		GrandTotalPurchase: grandTotal,
		GrossSalesDaily:    grossFilled,
		GrossSalesTotal:    grossTotal,
		NetSales:           netSales,
		NetSalesRate:       netSalesRate,
		PurchaseRatioPct:   purchaseRatioPct,
	}, nil
}

func (s *service) UpsertPurchaseEntry(ctx context.Context, branchID, supplierID int64, date time.Time, amount float64) error {
	return s.repo.UpsertPurchaseEntry(ctx, branchID, supplierID, date, amount)
}

func (s *service) UpsertGrossSales(ctx context.Context, branchID int64, date time.Time, amount float64) error {
	return s.repo.UpsertGrossSales(ctx, branchID, date, amount)
}

func (s *service) UpsertNetSalesRate(ctx context.Context, branchID int64, weekStart time.Time, rate float64) error {
	return s.repo.UpsertNetSalesRate(ctx, branchID, weekStart, rate)
}

func (s *service) ListSuppliers(ctx context.Context, branchID int64) ([]*Supplier, error) {
	return s.repo.ListSuppliers(ctx, branchID)
}

func (s *service) CreateSupplier(ctx context.Context, branchID int64, name string) (*Supplier, error) {
	return s.repo.CreateSupplier(ctx, branchID, name)
}

func (s *service) UpdateSupplier(ctx context.Context, id int64, fields SupplierUpdateFields) (*Supplier, error) {
	return s.repo.UpdateSupplier(ctx, id, fields)
}

func (s *service) DeleteSupplier(ctx context.Context, id int64) error {
	return s.repo.DeleteSupplier(ctx, id)
}
