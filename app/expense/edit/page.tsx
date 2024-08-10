import { createClient } from "@/utils/supabase/server";
import ExpenseForm from "../expense-form";
import { Profile } from "../utils";
import { editExpense } from "./actions";

export default async function ExpenseEdit({
  searchParams,
}: {
  searchParams: { expense_id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .neq("id", user?.id);
  if (error) console.log(error);

  const { data: expenseData, error: expenseError } = await supabase
    .from("expenses")
    .select()
    .eq("expense_id", searchParams.expense_id);

  if (expenseError) console.log(expenseError);
  const { split, paid, owes, amount, description } = expenseData[0];

  const preselectProfile = data.find(
    (profile) => profile.id === paid || profile.id === owes,
  );

  return (
    <div>
      <span>edit expense</span>
      <ExpenseForm
        profiles={data as Profile[]}
        preselectProfile={preselectProfile}
        split={split}
        amount={amount}
        description={description}
      >
        <input
          type="hidden"
          name="expense_id"
          value={searchParams.expense_id}
        />
        <button
          className="w-full p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          formAction={editExpense}
        >
          Edit expense
        </button>
      </ExpenseForm>
    </div>
  );
}
