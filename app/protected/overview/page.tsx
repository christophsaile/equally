import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AddExpenseLink } from "../expense/add-expense-link";

export default async function Overview() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data, error } = await supabase
    .from("balances")
    .select()
    .eq("owed_to", user.id);

  return (
    <>
      <pre className="overflow-hidden">{JSON.stringify(data, null, 2)}</pre>
      <AddExpenseLink></AddExpenseLink>
    </>
  );
}
