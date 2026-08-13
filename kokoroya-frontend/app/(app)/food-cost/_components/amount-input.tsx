import { NumericInput } from "@/app/(app)/_components/numeric-input";

export function AmountInput({
  value,
  onSave,
  disabled,
}: {
  value: number;
  onSave: (amount: number) => void;
  disabled?: boolean;
}) {
  return (
    <NumericInput
      value={value}
      onSave={onSave}
      disabled={disabled}
      className="w-28 text-right"
    />
  );
}
