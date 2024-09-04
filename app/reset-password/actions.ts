"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
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
    // Redirect if login form data is invalid
    redirect(`/login?message=Invalid form data.&error=true`);
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    validatedFormData.email,
  );
  if (error) {
    console.log("Error during password reset:", error.message);
    redirect(`/login?message=${encodeURIComponent(error.message)}&error=true`);
    return;
  }
  // TODO add on success message
  redirect(
    `/reset-password?message=We've sent a password reset link to your email address. Please check your inbox (and your spam folder, just in case) and follow the instructions to reset your password.`,
  );
}
