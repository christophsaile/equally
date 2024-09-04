"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateExpenseFormData, determineWhoPaid } from "../utils";
import { updateBalances } from "../actions";

export async function addExpense(formData: FormData) {
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

  // insert the expense into the database
  const { error: expenseError } = await supabase.from("expenses").insert([
    {
      description: validatedData.description,
      paid: determineWhoPaidResult.paid,
      owes: determineWhoPaidResult.owed,
      split: validatedData.split,
      amount: validatedData.amount,
      created_by: user.id,
    },
  ]);

  if (expenseError) {
    console.error("Error inserting expense:", expenseError);
  }

  await updateBalances(user.id, validatedData.profile_id);

  // TODO make sure that if one action fails, the other one is rolled back
  // atomic transactions

  revalidatePath("/");
  redirect("/");
}
