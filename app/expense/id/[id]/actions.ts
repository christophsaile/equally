"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateBalances } from "../../actions";
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
    .select("paid, owes");

  if (deleteExpenseError) {
    console.error("Error deleting expense:", deleteExpenseError);
  }

  console.log("deleteExpenseData", deleteExpenseData);

  let profileId;

  if (!deleteExpenseData) {
    return;
  }

  if (user.id === deleteExpenseData[0].paid) {
    profileId = deleteExpenseData[0].owes;
  } else {
    profileId = deleteExpenseData[0].paid;
  }

  await updateBalances(user.id, profileId);

  revalidatePath("/home");
  revalidatePath(`/expense/profile/${profileId}`);
  redirect(`/expense/profile/${profileId}`);
}
