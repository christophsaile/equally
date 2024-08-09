import { createClient } from "@/utils/supabase/server";
import ExpenseForm from "../expense-form";
import { Profile } from "../utils";
import { addExpense } from "./actions";

export default async function ExpenseAdd() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .neq("id", user?.id);
  if (error) console.log(error);

  return (
    <div>
      <span>add expense</span>
      <ExpenseForm profiles={data as Profile[]}>
        <button
          className="w-full p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          formAction={addExpense}
        >
          Add expense
        </button>
      </ExpenseForm>
    </div>
  );
}
