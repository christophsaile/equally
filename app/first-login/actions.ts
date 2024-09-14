"use server";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { object, string } from "yup";

const formSchema = object({
  first_name: string().required(),
  last_name: string().required(),
});

export async function updateProfileData(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const validatedFormData = await formSchema.validate({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
  });

  if (!validatedFormData) {
    // Redirect if form data is invalid
    encodedRedirect("error", "first-login", "Invalid form data.");
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
