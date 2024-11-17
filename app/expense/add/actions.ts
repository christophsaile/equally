"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateExpenseFormData, determineWhoPaid } from "../utils";
import { updateExpenseAndBalances } from "../actions";
import { encodedRedirect } from "@/utils/utils";

export async function addExpense(formData: FormData) {
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
    encodedRedirect("error", "/expense/add", `${validationError}`);
    return;
  }

  const determineWhoPaidResult = determineWhoPaid(
    validationData.split,
    validationData.profile_id,
    user.id,
  );

  const { error } = await updateExpenseAndBalances(
    "add",
    user.id,
    validationData.profile_id,
    {
      description: validationData.description,
      paid: determineWhoPaidResult.paid,
      owes: determineWhoPaidResult.owed,
      split: validationData.split,
      amount: validationData.amount,
      created_by: user.id,
    },
  );

  if (error) {
    encodedRedirect(
      "error",
      "/expense/add",
      "Something went adding a new expense",
    );
  }

  revalidatePath(`/expense/profile/${validationData.profile_id}`);
  revalidatePath("/home");
  redirect("/home");
}
