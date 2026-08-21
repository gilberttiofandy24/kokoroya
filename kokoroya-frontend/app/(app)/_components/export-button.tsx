"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="brutal" onClick={onClick}>
      <Download />
      Download Excel
    </Button>
  );
}
