import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// TODO Move this somewhere else, this page is reserved for single expenses to list the details like amount, description, split etc
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

  const { data: paidByUserData, error: paidByUserError } = await supabase
    .from("expenses")
    .select()
    .eq("paid_by", user.id)
    .eq("owed_to", params.id);

  const { data: paidByProfileData, error: paidByProfileError } = await supabase
    .from("expenses")
    .select()
    .eq("paid_by", params.id)
    .eq("owed_to", user.id);

  if (paidByUserError || paidByProfileError) {
    console.error(
      "Error fetching data:",
      paidByUserError || paidByProfileError,
    );
    return [];
  }

  const combinedData = [...paidByUserData, ...paidByProfileData];

  return (
    <div>
      {combinedData.map((expense) => {
        return (
          <div key={expense.expense_id}>
            <h1>Expense</h1>
            <p>{expense.description}</p>
            <p>{expense.amount}</p>
          </div>
        );
      })}
    </div>
  );
}
