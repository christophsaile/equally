"use server";
import { object, string } from "yup";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

const formSchema = object({
  email: string().email().required(),
  password: string().required(),
});

export async function validateForm(formData: FormData) {
  try {
    const validatedData = await formSchema.validate({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Return data and no error
    return { data: validatedData, error: null };
  } catch (validationError) {
    // If validation fails, return null data and the error
    return { data: null, error: validationError };
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Step 1: Validate login form data
  const { data: validatedFormData, error: validatedFormDataError } =
    await validateForm(formData);
  if (validatedFormDataError || !validatedFormData) {
    encodedRedirect("error", "login", `${validatedFormDataError}`);
    return;
  }

  // Step 2: Attempt login
  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFormData.email,
    password: validatedFormData.password,
  });

  if (error) {
    // Log and redirect if login failed with a specific error message
    encodedRedirect("error", "login", error.message);
    return;
  }

  // Step 3: Successful login, redirect to the home page
  revalidatePath("/", "layout");
  redirect("/home");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Step 1: Validate form data
  const { data: validatedFormData, error: validatedFormDataError } =
    await validateForm(formData);
  if (validatedFormDataError || !validatedFormData) {
    encodedRedirect("error", "login", `${validatedFormDataError}`);
    return;
  }

  // Step 2: Perform the sign-up process
  const { error } = await supabase.auth.signUp(validatedFormData);

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
