"use server";
import { object, string, number } from "yup";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

const formSchema = object({
  email: string().required(),
  password: string().required(),
});

export async function validateForm(formData: FormData) {
  const validatedData = await formSchema.validate({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  return validatedData;
}

export async function login(formData: FormData) {
  const supabase = createClient();

  // Step 1: Validate login form data
  const data = await validateForm(formData);
  if (!data) {
    // Redirect if login form data is invalid
    redirect(`/login?message=Invalid form data.&error=true`);
    return;
  }

  // Step 2: Attempt login
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    // Log and redirect if login failed with a specific error message
    console.log("Error during login:", error.message);
    redirect(`/login?message=${encodeURIComponent(error.message)}&error=true`);
    return;
  }

  // Step 3: Successful login, redirect to the home page
  revalidatePath("/", "layout");
  redirect(`/`);
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // Step 1: Validate form data
  const data = await validateForm(formData);
  if (!data) {
    // Redirect if form data is invalid
    redirect(`/login?message=Invalid form data.&error=true`);
    return;
  }

  // Step 2: Perform the sign-up process
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    // Redirect on Supabase signup error
    redirect(`/login?message=${encodeURIComponent(error.message)}&error=true`);
    return;
  }

  // Step 3: Successful signup, redirect with success message
  redirect(
    `/login?message=Account created. Please check your email for the verification link.`,
  );
}
