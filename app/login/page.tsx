import { FsButtonGroup } from "@/components/fs-button-group";
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
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="you@site.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="••••••••"
            required
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
      <FsButtonGroup>
        <SubmitButton action="login" pendingText="Login">
          Login
        </SubmitButton>
        <SubmitButton action="signup" pendingText="Signing up">
          Sign up
        </SubmitButton>
      </FsButtonGroup>
    </form>
  );
}
