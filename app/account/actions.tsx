"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileData(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // get the file from the form data
  // TODO add validation to ensure the file is an image and not too large
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const selectedAvatarFile = (formData.get("avatar") as File) || null;

  if (selectedAvatarFile === null) {
    return;
  }

  // check if the user has an existing avatar
  const { data: profileData } = await supabase
    .from("profiles")
    .select("avatar")
    .eq("id", user.id)
    .limit(1)
    .single();

  // upload the file to the "avatars" bucket
  const uniqueFilename = `${Date.now()}_${selectedAvatarFile.name}`;

  const { error } = await supabase.storage
    .from("avatar")
    .upload(`${user.id}/${uniqueFilename}`, selectedAvatarFile);

  if (error) {
    console.error("Error uploading file:", error);
    return;
  }

  // get the public URL of the uploaded file
  const { data } = supabase.storage
    .from("avatar")
    .getPublicUrl(`${user.id}/${uniqueFilename}`);

  // update the user's profile with the new avatar and name
  await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      avatar: data.publicUrl,
    })
    .eq("id", user.id);

  // delete the old avatar if it exists
  if (profileData?.avatar) {
    const { error } = await supabase.storage
      .from("avatars")
      .remove([profileData.avatar]);
    if (error) {
      console.error("Error deleting old avatar:", error);
    }
  }
  revalidatePath("/account");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
