const LEGEND = [
  { code: "C", label: "Cashier" },
  { code: "F", label: "Food" },
  { code: "S", label: "Service" },
  { code: "FS", label: "Food & Service" },
  { code: "B", label: "Bar" },
  { code: "TOILET", label: "Toilet" },
];

export function Legend() {
  return (
    <div className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-1 text-sm">
      {LEGEND.map((item) => (
        <span key={item.code}>
          <span className="font-semibold">{item.code}</span> = {item.label}
        </span>
      ))}
    </div>
  );
}
