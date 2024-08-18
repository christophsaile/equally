"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateBalances } from "../actions";
import { revalidatePath } from "next/cache";

export async function deleteExpense(expenseId: number) {
  // TODO - move this to a shared function
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // delete the expense from the database
  const { data: deleteExpenseData, error: deleteExpenseError } = await supabase
    .from("expenses")
    .delete()
    .eq("expense_id", expenseId)
    .select()
    .limit(1)
    .single();

  if (deleteExpenseError) {
    console.error("Error deleting expense:", deleteExpenseError);
  }

  let profileId;

  if (user.id === deleteExpenseData.paid) {
    profileId = deleteExpenseData.owes;
  } else {
    profileId = deleteExpenseData.paid;
  }

  await updateBalances(user.id, profileId);

  revalidatePath("/");
  revalidatePath(`/expense/with/${profileId}`);
  redirect(`/expense/with/${profileId}`);
}
