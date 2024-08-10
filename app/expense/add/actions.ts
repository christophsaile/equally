"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateFormData, determineWhoPaid, determineAmount } from "../utils";

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
    validatedData = await validateFormData(formData);
  } catch (error) {
    console.error("Validation or user retrieval failed:", error);
    throw new Error("Invalid expense data");
  }

  const determineWhoPaidResult = determineWhoPaid(validatedData, user.id);
  const determineAmountResult = determineAmount(validatedData);

  // insert the expense into the database
  await supabase.from("expenses").insert([
    {
      description: validatedData.description,
      paid: determineWhoPaidResult.paid,
      owes: determineWhoPaidResult.owed,
      split: validatedData.split,
      amount: validatedData.amount,
    },
  ]);

  // insert the expense split into the database based on the split type
  if (validatedData.split === 1 || validatedData.split === 3) {
    const { data: currentBalanceData } = await supabase
      .from("balances")
      .select()
      .eq("user_id", determineWhoPaidResult.owed)
      .eq("owes", determineWhoPaidResult.paid);

    if (currentBalanceData?.length) {
      // update the balances table
      const { error: balanceError } = await supabase
        .from("balances")
        .update([
          {
            balance_id: currentBalanceData[0]?.balance_id,
            user_id: determineWhoPaidResult.owed,
            owes: determineWhoPaidResult.paid,
            amount: currentBalanceData[0]?.amount + determineAmountResult.equal,
          },
        ])
        .eq("user_id", determineWhoPaidResult.owed)
        .eq("owes", determineWhoPaidResult.paid);
      if (balanceError) console.log(balanceError);
    } else {
      // update the balances table
      const { error: balanceError } = await supabase
        .from("balances")
        .upsert([
          {
            user_id: determineWhoPaidResult.owed,
            owes: determineWhoPaidResult.paid,
            amount: determineAmountResult.equal,
          },
        ])
        .eq("user_id", determineWhoPaidResult.owed)
        .eq("owes", determineWhoPaidResult.paid);
      if (balanceError) console.log(balanceError);
    }
  }

  // insert the expense split into the database based on the split type
  if (validatedData.split === 2 || validatedData.split === 4) {
    const { data: currentBalanceData } = await supabase
      .from("balances")
      .select()
      .eq("user_id", determineWhoPaidResult.owed)
      .eq("owes", determineWhoPaidResult.paid);

    if (currentBalanceData?.length) {
      // update the balances table
      const { error: balanceError } = await supabase
        .from("balances")
        .update([
          {
            balance_id: currentBalanceData[0]?.balance_id,
            user_id: determineWhoPaidResult.owed,
            owes: determineWhoPaidResult.paid,
            amount: currentBalanceData[0]?.amount + determineAmountResult.full,
          },
        ])
        .eq("user_id", determineWhoPaidResult.owed)
        .eq("owes", determineWhoPaidResult.paid);
      if (balanceError) console.log(balanceError);
    } else {
      // update the balances table
      const { error: balanceError } = await supabase
        .from("balances")
        .upsert([
          {
            user_id: determineWhoPaidResult.owed,
            owes: determineWhoPaidResult.paid,
            amount: determineAmountResult.full,
          },
        ])
        .eq("user_id", determineWhoPaidResult.owed)
        .eq("owes", determineWhoPaidResult.paid);
      if (balanceError) console.log(balanceError);
    }

    // TODO: make sure that if one action fails, the other one is rolled back
    // atomic transactions
  }

  revalidatePath("/balance");
  redirect("/balance");
}
