"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { punchAction } from "@/lib/actions/clock";

type Feedback =
  | { type: "success"; action: "in" | "out"; name: string; at: string }
  | { type: "error"; message: string };

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
const PIN_LENGTH = 4;

export function Keypad() {
  const [pin, setPin] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function scheduleReset() {
    resetTimer.current = setTimeout(() => {
      setFeedback(null);
      setPin("");
    }, 3000);
  }

  async function submit(fullPin: string) {
    setIsPending(true);
    const result = await punchAction(fullPin);
    setIsPending(false);
    setPin("");

    if (result.success) {
      setFeedback({
        type: "success",
        action: result.data.action,
        name: result.data.name,
        at: new Date(result.data.at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } else {
      setFeedback({ type: "error", message: result.error });
    }
    scheduleReset();
  }

  function press(key: string) {
    if (isPending || feedback) return;

    if (key === "⌫") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (key === "") return;

    const next = pin + key;
    setPin(next);
    if (next.length === PIN_LENGTH) submit(next);
  }

  if (feedback) {
    return (
      <div className="text-foreground flex flex-col items-center gap-4 text-center">
        {feedback.type === "success" ? (
          <>
            <h1 className="text-4xl font-extrabold">
              {feedback.action === "in" ? "Welcome" : "Bye"}, {feedback.name}
            </h1>
            <p className="text-xl">
              {feedback.action === "in" ? "Clocked in" : "Clocked out"} at{" "}
              {feedback.at}
            </p>
          </>
        ) : (
          <h1 className="text-destructive text-3xl font-bold">
            {feedback.message}
          </h1>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-8">
      <div className="flex gap-3">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span
            key={i}
            className={`border-foreground size-8 rounded-full border-2 ${
              i < pin.length ? "bg-foreground" : "bg-transparent"
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {KEYS.map((key, i) =>
          key === "" ? (
            <div key={i} />
          ) : (
            <Button
              key={i}
              type="button"
              variant="brutal"
              disabled={isPending}
              onClick={() => press(key)}
              className="size-20 rounded-full text-2xl font-bold"
            >
              {key}
            </Button>
          ),
        )}
      </div>
    </div>
  );
}
