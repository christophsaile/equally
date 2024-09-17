import { Button } from "@/components/button";
import { resetPassword } from "./actions";
import { Navigation } from "@/components/navigation";
import { FormMessage, Message } from "@/components/form-message";

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  return (
    <div className="pt-2">
      <h1 className="text-2xl font-semibold leading-relaxed text-gray-800 dark:text-white">
        Forgot you password? 🤫
      </h1>
      <p className="text-2xl leading-relaxed text-gray-600 dark:text-neutral-400">
        Enter your email to receive a link to reset your password.
      </p>
      <form className="mb-6 flex flex-col gap-10 pt-8">
        <div className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-base font-medium dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="focus-style block w-full rounded-lg border-gray-200 px-4 py-3 text-base disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
              placeholder="you@site.com"
              required
            />
          </div>
        </div>
        <Navigation>
          <Button variant="primary" href="/login">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={3}
              aria-label="Back to login"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Button>
          <Button
            variant="accent"
            formAction={resetPassword}
            pendingText="Loading"
          >
            Reset Password
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-[1em] w-[1em]"
              aria-hidden="true"
            >
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
            </svg>
          </Button>
        </Navigation>
      </form>
      <FormMessage message={searchParams} />
    </div>
  );
}
