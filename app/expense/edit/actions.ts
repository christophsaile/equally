"use server";

import { createClient } from "@/utils/supabase/server";
import { validateFormData } from "../utils";
import { redirect } from "next/navigation";

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

  console.log(validatedData);
}
