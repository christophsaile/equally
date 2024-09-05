import { Alert } from "./alert";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div aria-live="polite">
      {"success" in message && <Alert type="success">{message.success}</Alert>}
      {"error" in message && <Alert type="error">{message.error}</Alert>}
      {"message" in message && <Alert type="info">{message.message}</Alert>}
    </div>
  );
}
