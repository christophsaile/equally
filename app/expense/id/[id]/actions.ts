"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateExpenseAndBalances } from "../../actions";
import { revalidatePath } from "next/cache";
import { encodedRedirect } from "@/utils/utils";

export async function deleteExpense(expenseId: number, profileId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  console.log("Deleting expense", expenseId, profileId);

  const { error } = await updateExpenseAndBalances(
    "delete",
    user.id,
    profileId,
    {
      expense_id: expenseId,
    },
  );

  if (error) {
    encodedRedirect(
      "error",
      `/expense/profile/${profileId}`,
      "Something went wrong deleting the expense",
    );
  }

  revalidatePath("/home");
  revalidatePath(`/expense/profile/${profileId}`);
  redirect(`/expense/profile/${profileId}`);
}
