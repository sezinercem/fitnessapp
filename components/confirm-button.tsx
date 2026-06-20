"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";

export function ConfirmButton({ action, label = "Delete" }: { action: () => Promise<void>; label?: string }) {
  return (
    <Button
      type="button"
      className="border border-red-900/60 bg-red-950/50 hover:bg-red-900"
      onClick={() => {
        if (window.confirm("This cannot be undone. Continue?")) {
          void action();
        }
      }}
    >
      <Trash2 className="h-4 w-4" />
      {label}
    </Button>
  );
}
