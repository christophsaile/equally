"use server";
import { createClient } from "@/utils/supabase/server";

export async function updateExpenseAndBalances(
  action: "add" | "update" | "delete",
  userId: string,
  profileId: string,
  formData: {
    description?: string;
    paid?: string;
    owes?: string;
    split?: number;
    amount?: number;
    created_by?: string;
    expense_id?: number;
  },
) {
  const supabase = createClient();

  const { error } = await supabase.rpc("update_expense_and_balances_rpc", {
    p_action: action,
    p_user_id: userId,
    p_profile_id: profileId,
    form_description: formData.description || null,
    form_paid: formData.paid || null,
    form_owes: formData.owes || null,
    form_split: formData.split || null,
    form_amount: formData.amount || null,
    form_created_by: formData.created_by || null,
    form_expense_id: formData.expense_id || null,
  });

  if (error) {
    console.error("Error in update_expense_and_balances_rpc:", error);
    return { error };
  }

  return {};
}
