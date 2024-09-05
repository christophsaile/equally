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
  const validatedData = await formSchema.validate({
    password: formData.get("password"),
    password_confirmation: formData.get("password_confirmation"),
  });

  return validatedData;
}

export async function updatePassword(formData: FormData) {
  const supabase = createClient();

  const validatedFormData = await validateForm(formData);
  if (!validatedFormData) {
    // Redirect if form data is invalid
    encodedRedirect("error", "update-password", "Invalid form data");
    return;
  }
  await supabase.auth.updateUser({ password: validatedFormData.password });

  // TODO check if revalidate is needed
  encodedRedirect("success", "/login", "Password successfully updated");
}
