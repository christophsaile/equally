"use server";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

async function getExpenses(
  supabase: SupabaseClient<any, "public", any>,
  userId: string,
  profileId: string,
) {
  const { data: expensesUserPaid, error: errorUserPaid } = await supabase
    .from("expenses")
    .select()
    .eq("paid", userId)
    .eq("owes", profileId);

  const { data: expensesProfilePaid, error: errorProfilePaid } = await supabase
    .from("expenses")
    .select()
    .eq("paid", profileId)
    .eq("owes", userId);

  if (errorUserPaid || errorProfilePaid) {
    console.error("Error fetching data:", errorUserPaid || errorProfilePaid);
    return { expensesUserPaid: [], expensesProfilePaid: [] };
  }
  return { expensesUserPaid, expensesProfilePaid };
}

function determineSplittedAmount(amount: number, split: number) {
  return split === 1 || split === 3 ? amount / 2 : amount;
}

function calculateTotalAmount(expenses: any[]) {
  return (
    expenses?.reduce(
      (acc, curr) => acc + determineSplittedAmount(curr.amount, curr.split),
      0,
    ) || 0
  );
}

async function updateOrInsertBalance(
  supabase: SupabaseClient<any, "public", any>,
  userId: string,
  profileId: string,
  amount: number,
) {
  const { data: currentBalanceData } = await supabase
    .from("balances")
    .select()
    .eq("user_id", userId)
    .eq("owes", profileId);

  if (currentBalanceData?.length) {
    const { error: balanceError } = await supabase
      .from("balances")
      .update({
        amount,
      })
      .eq("user_id", userId)
      .eq("owes", profileId);

    if (balanceError) {
      console.error("Error updating balance:", balanceError);
    }
  } else {
    const { error: balanceError } = await supabase.from("balances").insert([
      {
        user_id: userId,
        owes: profileId,
        amount,
      },
    ]);

    if (balanceError) {
      console.error("Error inserting balance:", balanceError);
    }
  }
}

export async function updateBalances(userId: string, profileId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const { expensesUserPaid, expensesProfilePaid } = await getExpenses(
    supabase,
    userId,
    profileId,
  );

  const userAmount = calculateTotalAmount(expensesUserPaid);
  const profileAmount = calculateTotalAmount(expensesProfilePaid);

  await updateOrInsertBalance(supabase, userId, profileId, profileAmount);
  await updateOrInsertBalance(supabase, profileId, userId, userAmount);
}
