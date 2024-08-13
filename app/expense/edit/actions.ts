"use server";

import { createClient } from "@/utils/supabase/server";
import { determineWhoPaid, validateFormData } from "../utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function editExpense(formData: FormData) {
  // TODO - move this to a shared function
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
    validatedData = await validateFormData(formData);
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

  // get all the expenses that are split between the same two users
  const { data: expensesDataUserPaid } = await supabase
    .from("expenses")
    .select()
    .eq("paid", user.id)
    .eq("owes", validatedData.profile_id);

  const { data: expensesDataProfilePaid } = await supabase
    .from("expenses")
    .select()
    .eq("paid", validatedData.profile_id)
    .eq("owes", user.id);

  const determineAmount = (amount: number, split: number) => {
    if (split === 1 || split === 3) {
      return amount / 2;
    } else {
      return amount;
    }
  };

  // TODO - optimize code to avoid repeating the same logic
  // if no expenses are found, set the amount to 0
  const userAmount =
    expensesDataUserPaid?.reduce(
      (acc, curr) => acc + determineAmount(curr.amount, curr.split),
      0,
    ) || 0;
  const profileAmount =
    expensesDataProfilePaid?.reduce(
      (acc, curr) => acc + determineAmount(curr.amount, curr.split),
      0,
    ) || 0;

  // check if the balance already exists
  const { data: currentBalanceDataUserOwes } = await supabase
    .from("balances")
    .select()
    .eq("user_id", user.id)
    .eq("owes", validatedData.profile_id);

  const { data: currentBalanceDataProfileOwes } = await supabase
    .from("balances")
    .select()
    .eq("user_id", validatedData.profile_id)
    .eq("owes", user.id);

  // update the balance
  if (currentBalanceDataUserOwes?.length) {
    const { error: balanceError } = await supabase
      .from("balances")
      .update({
        amount: profileAmount,
      })
      .eq("user_id", user.id)
      .eq("owes", validatedData.profile_id);

    if (balanceError) {
      console.error("Error updating balance:", balanceError);
    }
  } else {
    const { error: balanceError } = await supabase.from("balances").insert([
      {
        user_id: user.id,
        owes: validatedData.profile_id,
        amount: profileAmount,
      },
    ]);

    if (balanceError) {
      console.error("Error updating balance:", balanceError);
    }
  }

  if (currentBalanceDataProfileOwes?.length) {
    const { error: balanceError } = await supabase
      .from("balances")
      .update({
        amount: userAmount,
      })
      .eq("user_id", validatedData.profile_id)
      .eq("owes", user.id);

    if (balanceError) {
      console.error("Error updating balance:", balanceError);
    }
  } else {
    const { error: balanceError } = await supabase.from("balances").insert([
      {
        user_id: validatedData.profile_id,
        owes: user.id,
        amount: userAmount,
      },
    ]);

    if (balanceError) {
      console.error("Error updating balance:", balanceError);
    }
  }

  revalidatePath("/balance");
  redirect("/balance");
}
