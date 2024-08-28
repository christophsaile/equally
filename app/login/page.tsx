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
            className={`input ${searchParams.error ? "border-red-200" : ""}`}
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
            className={`input ${searchParams.error ? "border-red-200" : ""}`}
          />
        </div>
      </div>
      <div
        className={`${!searchParams.message ? "hidden" : ""} `}
        aria-live="polite"
      >
        {searchParams.message && (
          <Alert type={searchParams.error ? "error" : "success"}>
            {searchParams.message}
          </Alert>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex gap-4 px-4 pb-4">
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
