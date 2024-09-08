"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function updateProfileData(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // TODO - Add validation for first_name and last_name
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;

  // add random image
  const randomNum = Math.floor(Math.random() * 7) + 1;

  const { data } = supabase.storage
    .from("default_avatars")
    .getPublicUrl(`${randomNum}.jpeg`);

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
    avatar: data.publicUrl,
  });

  if (error) {
    console.error("Error updating profile:", error);
  }

  redirect("/");
}
