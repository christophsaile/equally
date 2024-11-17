"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { object, ref, string } from "yup";

const formSchema = object().shape({
  password: string().required(),
  password_confirmation: string()
    .oneOf([ref("password"), undefined], "Passwords must match")
    .required(),
});

export async function validateForm(formData: FormData) {
  try {
    const validatedData = await formSchema.validate({
      password: formData.get("password"),
      password_confirmation: formData.get("password_confirmation"),
    });

    // Return data and no error
    return { data: validatedData, error: null };
  } catch (validationError) {
    // If validation fails, return null data and the error
    return { data: null, error: validationError };
  }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const { data: validatedFormData, error: validatedFormDataError } =
    await validateForm(formData);
  if (validatedFormDataError || !validatedFormData) {
    encodedRedirect("error", "update-password", `${validatedFormDataError}`);
    return;
  }
  await supabase.auth.updateUser({ password: validatedFormData.password });

  encodedRedirect("success", "/login", "Password successfully updated");
}
