"use server";

import { createClient } from "@/utils/supabase/server";
import { determineWhoPaid, validateExpenseFormData } from "../utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateExpenseAndBalances } from "../actions";
import { encodedRedirect } from "@/utils/utils";

export async function editExpense(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const validatedData = await validateExpenseFormData(formData);

  if (!validatedData) {
    encodedRedirect("error", "/expense/edit", "Invalid form data");
    return;
  }

  const determineWhoPaidResult = determineWhoPaid(validatedData, user.id);

  const { error } = await updateExpenseAndBalances(
    "update",
    user.id,
    validatedData.profile_id,
    {
      description: validatedData.description,
      owes: determineWhoPaidResult.owed,
      paid: determineWhoPaidResult.paid,
      split: validatedData.split,
      amount: validatedData.amount,
      expense_id: validatedData.expense_id,
    },
  );

  if (error) {
    encodedRedirect(
      "error",
      "/expense/edit",
      "Something went wrong editing the expense",
    );
  }

  revalidatePath(`/expense/id/${validatedData.expense_id}`);
  revalidatePath(`/expense/profile/${validatedData.profile_id}`);
  revalidatePath("/home");
  redirect("/home");
}
