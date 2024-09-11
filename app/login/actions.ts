"use server";
import { object, string } from "yup";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

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
    encodedRedirect("error", "login", "Invalid form data.");
    return;
  }

  // Step 2: Attempt login
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    // Log and redirect if login failed with a specific error message
    encodedRedirect("error", "login", error.message);
    return;
  }

  // Step 3: Successful login, redirect to the home page
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // Step 1: Validate form data
  const data = await validateForm(formData);
  if (!data) {
    // Redirect if form data is invalid
    encodedRedirect("error", "login", "Invalid form data.");
    return;
  }

  // Step 2: Perform the sign-up process
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    encodedRedirect("error", "login", error.message);
    return;
  }

  // Step 3: Successful signup, redirect with success message
  encodedRedirect(
    "success",
    "login",
    "Account created. Please check your email for the verification link.",
  );
}
