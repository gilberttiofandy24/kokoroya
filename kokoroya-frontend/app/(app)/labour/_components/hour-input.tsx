import { NumericInput } from "@/app/(app)/_components/numeric-input";

export function HourInput({
  value,
  onSave,
  disabled,
}: {
  value: number;
  onSave: (hours: number) => void;
  disabled?: boolean;
}) {
  return (
    <NumericInput
      value={value}
      onSave={onSave}
      disabled={disabled}
      className="w-20 text-right"
      maxLength={6}
    />
  );
}
