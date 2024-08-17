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

  const [profilesResult, expenseResult] = await Promise.all([
    supabase.from("profiles").select().neq("id", user?.id),
    supabase
      .from("expenses")
      .select()
      .eq("expense_id", searchParams.expense_id)
      .limit(1)
      .single(),
  ]);

  const { data: profileData, error: profileError } = profilesResult;
  const { data: expenseData, error: expenseError } = expenseResult;
  if (profileError || expenseError)
    console.error("Error fetching data:", profileError || expenseError);

  const { split, paid, owes, amount, description } = expenseData;

  const preselectProfile = profileData?.find(
    (profile) => profile.id === paid || profile.id === owes,
  );

  return (
    <div>
      <span>edit expense</span>
      <ExpenseForm
        profiles={profileData as Profile[]}
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
          className="w-full rounded-md bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600"
          formAction={editExpense}
        >
          Edit expense
        </button>
      </ExpenseForm>
    </div>
  );
}
