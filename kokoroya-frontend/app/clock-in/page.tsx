import { Keypad } from "./_components/keypad";
import { LiveClock } from "./_components/live-clock";

export default function ClockInPage() {
  return (
    <main className="bg-secondary-foreground flex min-h-screen flex-col items-center justify-center gap-10 p-6">
      <LiveClock />
      <Keypad />
    </main>
  );
}
