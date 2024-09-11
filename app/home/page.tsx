import { Button } from "@/components/button";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import SuspenseContent from "./suspense-content";

export default async function Home() {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
        <SuspenseContent></SuspenseContent>
      </Suspense>
      <Navigation>
        <Button className="col-start-2" variant="accent" href="/expense/add">
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
