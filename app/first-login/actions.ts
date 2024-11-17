"use server";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { object, string } from "yup";

const formSchema = object({
  first_name: string().required(),
  last_name: string().required(),
});

export async function validateForm(formData: FormData) {
  try {
    const validatedData = await formSchema.validate({
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
    });

    // Return data and no error
    return { data: validatedData, error: null };
  } catch (validationError) {
    // If validation fails, return null data and the error
    return { data: null, error: validationError };
  }
}

export async function updateProfileData(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: validatedFormData, error: validatedFormDataError } =
    await validateForm(formData);
  if (validatedFormDataError || !validatedFormData) {
    encodedRedirect("error", "first-login", `${validatedFormDataError}`);
    return;
  }

  // add random image
  const randomNum = Math.floor(Math.random() * 7) + 1;

  const { data } = supabase.storage
    .from("default_avatars")
    .getPublicUrl(`${randomNum}.jpeg`);

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    first_name: validatedFormData.first_name,
    last_name: validatedFormData.last_name,
    avatar: data.publicUrl,
  });

  if (error) {
    console.error("Error updating profile:", error);
    encodedRedirect("error", "first-login", error.message);
  }

  redirect("/home");
}
