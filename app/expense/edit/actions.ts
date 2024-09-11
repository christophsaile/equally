"use server";

import { createClient } from "@/utils/supabase/server";
import { determineWhoPaid, validateExpenseFormData } from "../utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateBalances } from "../actions";

export async function editExpense(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  let validatedData;

  try {
    // validate the form data
    validatedData = await validateExpenseFormData(formData);
  } catch (error) {
    console.error("Validation or user retrieval failed:", error);
    throw new Error("Invalid expense data");
  }

  const determineWhoPaidResult = determineWhoPaid(validatedData, user.id);

  // change the expense in the database
  const { error: updateExpenseError } = await supabase
    .from("expenses")
    .update({
      description: validatedData.description,
      split: validatedData.split,
      amount: validatedData.amount,
      paid: determineWhoPaidResult.paid,
      owes: determineWhoPaidResult.owed,
    })
    .eq("expense_id", validatedData.expense_id);

  if (updateExpenseError) {
    console.error("Error updating expense:", updateExpenseError);
  }

  await updateBalances(user.id, validatedData.profile_id);

  revalidatePath("/home");
  redirect("/home");
}
