import { Button } from "@/components/button";
import { updatePassword } from "./actions";
import { Navigation } from "@/components/navigation";
import { FormMessage, Message } from "@/components/form-message";

export default async function UpdatePassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <h1 className="text-2xl font-semibold leading-relaxed text-gray-800 dark:text-white">
        Update your password 🕵️‍♂️
      </h1>
      <p className="text-2xl leading-relaxed text-gray-600 dark:text-neutral-400">
        Enter your new password and confirm it.
      </p>
      <form className="mb-6 flex flex-col gap-10 pt-8">
        <div className="flex flex-col gap-6">
          <div className="space-y-5" data-hs-toggle-password-group="">
            <div>
              <label
                htmlFor="hs-toggle-password-multi-toggle-np"
                className="mb-2 block text-base dark:text-white"
              >
                New password
              </label>
              <div className="relative">
                <input
                  id="hs-toggle-password-multi-toggle-np"
                  type="password"
                  name="password"
                  className="focus-style block w-full rounded-lg border-gray-200 py-3 pe-10 ps-4 text-base disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  data-hs-toggle-password='{
          "target": ["#hs-toggle-password-multi-toggle", "#hs-toggle-password-multi-toggle-np"]
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
            </div>
            <div className="mb-5">
              <label
                htmlFor="hs-toggle-password-multi-toggle"
                className="mb-2 block text-base dark:text-white"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="hs-toggle-password-multi-toggle"
                  type="password"
                  name="password_confirmation"
                  className="focus-style block w-full rounded-lg border-gray-200 py-3 pe-10 ps-4 text-base disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  data-hs-toggle-password='{
          "target": ["#hs-toggle-password-multi-toggle", "#hs-toggle-password-multi-toggle-np"]
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
            </div>
          </div>
        </div>
        <Navigation>
          <Button variant="primary" href="/account">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={3}
              aria-label="Back"
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
            formAction={updatePassword}
            pendingText="Loading"
          >
            Save
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[1em] w-[1em]"
              aria-hidden="true"
            >
              <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
              <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
              <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
            </svg>
          </Button>
        </Navigation>
      </form>
      <FormMessage message={searchParams} />
    </>
  );
}
