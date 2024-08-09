import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExpenseDeleteButton } from "./expense-delete-button";

export default async function ExpenseId({
  params,
}: {
  params: { id: string };
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
      "expense_id, description, amount, split, created_at, paid_by(id, first_name), owed_to(id, first_name)",
    )
    .eq("expense_id", params.id);

  if (expenseError) {
    console.error("Error fetching data:", expenseError);
  }
  // TODO: rename owed_to to something else?
  const {
    expense_id,
    description,
    amount,
    split,
    created_at,
    paid_by,
    owed_to,
  } = expenseData[0];

  const Euro = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  });

  const namePaidBy = paid_by.id === user.id ? "You" : paid_by.first_name;
  const nameOwedTo = owed_to.id === user.id ? "You" : owed_to.first_name;

  // TODO: Move this to a helper function
  const spiltAmount = (split: number, amount: number) => {
    if (split === 1 || split === 3) {
      return amount / 2;
    }
    return amount;
  };

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
        href={{ pathname: "/expense/edit", query: { expense_id: expense_id } }}
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
      <ExpenseDeleteButton></ExpenseDeleteButton>

      <h1>{description}</h1>
      <p>
        {namePaidBy} paid {Euro.format(amount)} on {formatTimestamp(created_at)}
        .
      </p>
      <p>
        {namePaidBy} owe {Euro.format(spiltAmount(split, amount))}.
      </p>
      <p>
        {nameOwedTo} owes {Euro.format(spiltAmount(split, amount))}.
      </p>
    </div>
  );
}
