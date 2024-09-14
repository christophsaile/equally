"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateExpenseFormData, determineWhoPaid } from "../utils";
import { updateExpenseAndBalances } from "../actions";
import { encodedRedirect } from "@/utils/utils";

export async function addExpense(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const validatedData = await validateExpenseFormData(formData);

  if (!validatedData) {
    encodedRedirect("error", "/expense/add", "Invalid form data");
    return;
  }

  const determineWhoPaidResult = determineWhoPaid(validatedData, user.id);

  const { error } = await updateExpenseAndBalances(
    "add",
    user.id,
    validatedData.profile_id,
    {
      description: validatedData.description,
      paid: determineWhoPaidResult.paid,
      owes: determineWhoPaidResult.owed,
      split: validatedData.split,
      amount: validatedData.amount,
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

  revalidatePath("/home");
  redirect("/home");
}
