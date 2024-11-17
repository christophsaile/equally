"use server";

import { createClient } from "@/utils/supabase/server";
import { determineWhoPaid, validateExpenseFormData } from "../utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateExpenseAndBalances } from "../actions";
import { encodedRedirect } from "@/utils/utils";

export async function editExpense(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const { data: validationData, error: validationError } =
    await validateExpenseFormData(formData);

  if (validationError || !validationData) {
    encodedRedirect("error", "/expense/edit", `${validationError}`, [
      `expense_id=${formData.get("expense_id")}`,
    ]);
    return;
  }

  const determineWhoPaidResult = determineWhoPaid(
    validationData.split,
    validationData.profile_id,
    user.id,
  );

  const { error } = await updateExpenseAndBalances(
    "update",
    user.id,
    validationData.profile_id,
    {
      description: validationData.description,
      owes: determineWhoPaidResult.owed,
      paid: determineWhoPaidResult.paid,
      split: validationData.split,
      amount: validationData.amount,
      expense_id: validationData.expense_id,
    },
  );

  if (error) {
    encodedRedirect(
      "error",
      "/expense/edit",
      "Something went wrong editing the expense",
      [`expense_id=${validationData.expense_id}`],
    );
  }

  revalidatePath(`/expense/id/${validationData.expense_id}`);
  revalidatePath(`/expense/profile/${validationData.profile_id}`);
  revalidatePath("/home");
  redirect("/home");
}
