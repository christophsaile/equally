import { logout } from "./actions";
import { Button } from "@/components/button";
import { Navigation } from "@/components/navigation";

import { Suspense } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { DynamicContent } from "./dynamic-content";
import { FormMessage, Message } from "@/components/form-message";
import Breadcrumb from "@/components/breadcrumb";

export default async function Account({
  searchParams,
}: {
  searchParams: Message;
}) {
  // TODO add option to update email
  // TODO add a button to delete the user's account
  return (
    <div>
      <Breadcrumb
        className="mb-8"
        items={[{ name: "Home", href: "/home" }, { name: "Account" }]}
      ></Breadcrumb>
      <div className="mb-8 flex flex-col gap-6">
        <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
          <DynamicContent></DynamicContent>
        </Suspense>
        <FormMessage message={searchParams}></FormMessage>
      </div>
      <div>
        <h2 className="mb-8 font-semibold text-gray-800 dark:text-white">
          Account Settings
        </h2>
        <Button href="/update-password" variant="accent" className="w-full">
          Update Password
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-[1em] w-[1em]"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
      <form>
        <Navigation>
          <Button variant="primary" href="/home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={3}
              aria-label="Back to overview"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Button>
          <Button variant="danger" formAction={logout} pendingText="Loading">
            Log out
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </Navigation>
      </form>
    </div>
  );
}
