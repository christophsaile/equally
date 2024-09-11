"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { object, string } from "yup";

const formSchema = object({
  email: string().required(),
});

export async function validateForm(formData: FormData) {
  const validatedData = await formSchema.validate({
    email: formData.get("email"),
  });

  return validatedData;
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient();

  const validatedFormData = await validateForm(formData);
  if (!validatedFormData) {
    encodedRedirect("error", "reset-password", "Invalid form data.");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    validatedFormData.email,
  );
  if (error) {
    encodedRedirect("error", "reset-password", error.message);
    return;
  }

  encodedRedirect(
    "success",
    "reset-password",
    "We've sent a password reset link to your email address. Please check your inbox (and your spam folder, just in case) and follow the instructions to reset your password",
  );
}
