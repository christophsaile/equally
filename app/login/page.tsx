import { Navigation } from "@/components/navigation";
import { FormMessage, Message } from "@/components/form-message";
import Link from "next/link";
import { login, signup } from "./actions";
import { Button } from "@/components/button";

// TODO: add autocomplete logic
export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="pt-2">
      <h1 className="text-2xl leading-relaxed text-gray-600 dark:text-neutral-400">
        <span className="font-semibold text-gray-800 dark:text-white">
          Welcome to Equally 👋
        </span>
        <br></br>
        Log in or sign up to continue.
      </h1>
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
              className="block w-full rounded-lg border-gray-200 px-4 py-3 text-base disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
              placeholder="you@site.com"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-base dark:text-white">
              Password
            </label>
            <div className="relative">
              <input
                id="hs-toggle-password"
                type="password"
                className="block w-full rounded-lg border-gray-200 py-3 pe-10 ps-4 text-base disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
                placeholder="Enter password"
                required
                name="password"
              />
              <button
                type="button"
                data-hs-toggle-password='{
        "target": "#hs-toggle-password"
      }'
                className="absolute inset-y-0 end-0 z-20 flex cursor-pointer items-center rounded-e-md px-3 text-gray-400 focus:text-blue-600 focus:outline-none dark:text-neutral-600 dark:focus:text-blue-500"
              >
                <svg
                  className="size-3.5 shrink-0"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    className="hs-password-active:hidden"
                    d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                  ></path>
                  <path
                    className="hs-password-active:hidden"
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                  ></path>
                  <path
                    className="hs-password-active:hidden"
                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                  ></path>
                  <line
                    className="hs-password-active:hidden"
                    x1="2"
                    x2="22"
                    y1="2"
                    y2="22"
                  ></line>
                  <path
                    className="hidden hs-password-active:block"
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                  ></path>
                  <circle
                    className="hidden hs-password-active:block"
                    cx="12"
                    cy="12"
                    r="3"
                  ></circle>
                </svg>
              </button>
            </div>
            <Link
              className="mt-3 block p-1 text-right text-sm text-gray-600 underline dark:text-neutral-400"
              href="/reset-password"
            >
              Forgotten your Password?
            </Link>
          </div>
        </div>

        <Navigation>
          <Button formAction={login} pendingText="Login" variant="accent">
            Log in
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </Button>
          <Button
            formAction={signup}
            pendingText="Signing up"
            variant="primary"
          >
            Sign up
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </Button>
        </Navigation>
      </form>
      <FormMessage message={searchParams} />
    </div>
  );
}
