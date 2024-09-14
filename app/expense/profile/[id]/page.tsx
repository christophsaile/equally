import { Button } from "@/components/button";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import SupenseContent from "./suspense-content";

export default async function ExpenseProfile({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
        <SupenseContent profileId={params.id}></SupenseContent>
      </Suspense>
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
        <Button
          variant="accent"
          href={{
            pathname: "/expense/add",
            query: { profile_id: params.id },
          }}
        >
          Add Expense
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
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </Navigation>
    </div>
  );
}
