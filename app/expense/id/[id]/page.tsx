import { ExpenseDeleteButton } from "./expense-delete-button";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/button";
import { Suspense } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import DynamicContent from "./dynamic-content";

// TODO fix grammatical owes owed ... etc
// TODO fix 0.01 rounded issue someone should pay 0.01 another one 0.01
export default async function ExpenseId({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams: { profile_id: string };
}) {
  return (
    <>
      <div className="flex flex-col gap-6">
        <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
          <DynamicContent expenseId={params.id}></DynamicContent>
        </Suspense>
        <ExpenseDeleteButton
          expense={params.id}
          profileId={searchParams.profile_id}
        ></ExpenseDeleteButton>
        <Navigation>
          <Button
            variant="primary"
            // { TODO: search parmas can be undefined }
            href={`/expense/profile/${searchParams.profile_id}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={3}
              aria-label="Back to expenses list"
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
              pathname: "/expense/edit",
              query: { expense_id: params.id },
            }}
          >
            <>
              Edit Expense
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-[1em] w-[1em]"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
              </svg>
            </>
          </Button>
        </Navigation>
      </div>
    </>
  );
}
