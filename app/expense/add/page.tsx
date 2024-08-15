import { createClient } from "@/utils/supabase/server";
import ExpenseForm from "../expense-form";
import { Profile } from "../utils";
import { addExpense } from "./actions";

export default async function ExpenseAdd({
  searchParams,
}: {
  searchParams: { profile_id: string };
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

  const preselectProfile = data.find(
    (profile) => profile.id === searchParams.profile_id,
  );

  return (
    <div>
      <span>add expense</span>
      <ExpenseForm
        profiles={data as Profile[]}
        preselectProfile={preselectProfile}
      >
        <button
          className="w-full rounded-md bg-blue-500 p-2 font-semibold text-white hover:bg-blue-600"
          formAction={addExpense}
        >
          Add expense
        </button>
      </ExpenseForm>
    </div>
  );
}
