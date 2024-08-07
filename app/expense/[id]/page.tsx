import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ExpenseProfile({
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
      "description, amount, split, created_at, paid_by(id, first_name), owed_to(id, first_name)",
    )
    .eq("expense_id", params.id);

  if (expenseError) {
    console.error("Error fetching data:", expenseError);
  }

  console.log(expenseData);
  // TODO: rename owed_to to something else?
  const { description, amount, split, created_at, paid_by, owed_to } =
    expenseData[0];
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
