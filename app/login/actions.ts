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

  let data;
  try {
    data = await validateForm(formData);
  } catch (error) {
    redirect("/error");
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  // This will purge the Client-side Router Cache, and revalidate the Data Cache on the next page visit.
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  let data;
  try {
    data = await validateForm(formData);
  } catch (error) {
    redirect("/error");
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  // This will purge the Client-side Router Cache, and revalidate the Data Cache on the next page visit.
  revalidatePath("/", "layout");
  redirect("/");
}
