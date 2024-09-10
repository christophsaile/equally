"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function updateBalances(userId: string, profileId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // Call the RPC function to handle the balance updates
  const { error } = await supabase.rpc("update_balances_rpc", {
    p_user_id: userId,
    p_profile_id: profileId,
  });

  if (error) {
    console.error("Error in update balances rpc call:", error);
  }
}
