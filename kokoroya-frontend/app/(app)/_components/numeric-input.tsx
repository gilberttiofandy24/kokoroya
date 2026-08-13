"use client";

import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";

export function NumericInput({
  value,
  onSave,
  disabled,
  className,
  maxLength = 12,
}: {
  value: number;
  onSave: (value: number) => void;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
}) {
  const [current, setCurrent] = useState(value);

  return (
    <NumericFormat
      key={value}
      value={current || ""}
      onValueChange={(values) => setCurrent(Number(values.value))}
      onBlur={() => {
        if (current !== value) onSave(current);
      }}
      maxLength={maxLength}
      disabled={disabled}
      className={className ?? "w-28 text-right"}
      thousandSeparator=","
      decimalSeparator="."
      displayType="input"
      customInput={Input}
      allowNegative={false}
      decimalScale={2}
    />
  );
}
