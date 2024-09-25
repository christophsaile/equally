"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { object, string } from "yup";

const formSchema = object({
  email: string().email().required(),
});

export async function validateForm(formData: FormData) {
  try {
    const validatedData = await formSchema.validate({
      email: formData.get("email"),
    });

    // Return data and no error
    return { data: validatedData, error: null };
  } catch (validationError) {
    // If validation fails, return null data and the error
    return { data: null, error: validationError };
  }
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient();

  const { data: validatedFormData, error: validatedFormDataError } =
    await validateForm(formData);
  if (validatedFormDataError || !validatedFormData) {
    encodedRedirect("error", "reset-password", `${validatedFormDataError}`);
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
