import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ExpenseDeleteButton } from "./expense-delete-button";
import {
  determineSplittedAmount,
  euroFormatter,
  formatTimestamp,
} from "../../utils";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/button";
import { Suspense } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { Alert } from "@/components/alert";

export default async function ExpenseId({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams: { profile_id: string };
}) {
  async function SuspenseContent() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/login");
    }

    const { data: expenseData, error: expenseError } = await supabase
      .from("expenses")
      .select(
        "expense_id, description, amount, split, created_at, paid(id, first_name, avatar), owes(id, first_name, avatar), created_by(id, first_name)",
      )
      .eq("expense_id", params.id)
      .limit(1)
      .single();

    if (expenseError) {
      console.error("Error fetching data from expense/[Id]", expenseError);
    }

    if (!expenseData) {
      return (
        <Alert type="error">No expense found with the id {params.id}</Alert>
      );
    }

    // TODO if we at some point want to allow multiple users to be part of a transaction
    // this function needs to be updated
    // TODO handle over global error page
    const checkIfUserIsPartOfTransaction = (expenseData: any, user: any) => {
      if (expenseData.paid.id === user.id || expenseData.owes.id === user.id) {
        return true;
      }
      return false;
    };

    if (!checkIfUserIsPartOfTransaction(expenseData, user)) {
      return (
        <Alert type="error">
          You have no access to preview this expense since you were not part of
          the transaction
        </Alert>
      );
    }

    // TODO rename owes to something else?
    const { description, amount, split, created_at, paid, owes, created_by } =
      expenseData;

    // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
    const namePaidBy = paid.id === user.id ? "You" : paid.first_name;
    // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
    const nameOwedTo = owes.id === user.id ? "You" : owes.first_name;
    const nameCreator =
      // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
      created_by.id === user.id ? "You" : created_by.first_name;
    return (
      <>
        <div>
          <h1 className="font-semibold text-gray-800 dark:text-white">
            {description}
          </h1>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Added by {nameCreator} on{" "}
            {formatTimestamp(created_at, { day: true })}
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-gray-800 dark:text-white">
              {namePaidBy} paid {euroFormatter(amount)}
            </h2>
            <ul className="list-disc space-y-2 ps-5 text-sm text-gray-600 marker:text-blue-600 dark:text-neutral-400">
              <li>
                {namePaidBy} owe{" "}
                {euroFormatter(determineSplittedAmount(amount, split))}
              </li>
              <li>
                {nameOwedTo} owes{" "}
                {euroFormatter(determineSplittedAmount(amount, split))}
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ExpenseDeleteButton
        expense={params.id}
        profileId={searchParams.profile_id}
      ></ExpenseDeleteButton>
      <Suspense fallback={<LoadingSpinner></LoadingSpinner>}>
        <SuspenseContent></SuspenseContent>
      </Suspense>
      <Navigation>
        <Button
          variant="primary"
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
  );
}
