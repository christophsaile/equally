import { SubmitButton } from "./submit-button";
import { Alert } from "@/components/alert";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string; error: boolean };
}) {
  return (
    <form className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={`input ${searchParams.error ? "border-red-500" : ""}`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className={`input ${searchParams.error ? "border-red-500" : ""}`}
          />
        </div>
      </div>
      <div
        aria-live="polite"
        className={`${searchParams.error ? "border-red-500" : ""}`}
      >
        <Alert error={searchParams.error}>{searchParams.message}</Alert>
      </div>
      <div className="flex gap-4">
        <SubmitButton action="login" pendingText="Login">
          Login
        </SubmitButton>
        <SubmitButton action="signup" pendingText="Signing up">
          Sign up
        </SubmitButton>
      </div>
    </form>
  );
}
