import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExpenseDeleteButton } from "./expense-delete-button";
import { ErrorMessage } from "@/app/error-message";
import { determineSplittedAmount, euroFormatter } from "../utils";

export default async function ExpenseId({
  params,
}: {
  params: { id: number };
}) {
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
      "expense_id, description, amount, split, created_at, paid(id, first_name), owes(id, first_name)",
    )
    .eq("expense_id", params.id);

  if (expenseError) {
    console.error("Error fetching data:", expenseError);
  }

  if (!expenseData || !expenseData.length) {
    return (
      <div>
        <ErrorMessage>Expense not found</ErrorMessage>
      </div>
    );
  }

  // TODO: if we at some point want to allow multiple users to be part of a transaction
  // this function needs to be updated
  const checkIfUserIsPartOfTransaction = (expenseData: any, user: any) => {
    if (
      expenseData[0].paid.id === user.id ||
      expenseData[0].owes.id === user.id
    ) {
      return true;
    }
    return false;
  };

  if (!checkIfUserIsPartOfTransaction(expenseData, user)) {
    return (
      <div>
        <ErrorMessage>
          You have no access to preview this expense since you were not part of
          the transaction
        </ErrorMessage>
      </div>
    );
  }

  // TODO: rename owes to something else?
  const { description, amount, split, created_at, paid, owes } = expenseData[0];

  const namePaidBy = paid.id === user.id ? "You" : paid.first_name;
  const nameOwedTo = owes.id === user.id ? "You" : owes.first_name;

  // TODO: move this to a helper function
  function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate().toString().padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  return (
    // TODO add default layout for all pages
    <div>
      <Link
        href={{ pathname: "/expense/edit", query: { expense_id: params.id } }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6 text-black"
          aria-hidden="true"
        >
          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
        </svg>
        <span className="sr-only">Edit Expense</span>
      </Link>
      <ExpenseDeleteButton expense={params.id}></ExpenseDeleteButton>

      <h1>{description}</h1>
      <p>
        {namePaidBy} paid {euroFormatter(amount)} on{" "}
        {formatTimestamp(created_at)}.
      </p>
      <p>
        {namePaidBy} owe {euroFormatter(determineSplittedAmount(split, amount))}
        .
      </p>
      <p>
        {nameOwedTo} owes{" "}
        {euroFormatter(determineSplittedAmount(split, amount))}.
      </p>
    </div>
  );
}
