import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateProfileData } from "./actions";
import Image from "next/image";

export default async function Account() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .limit(1)
    .single();

  if (profileError) {
    console.error("Error fetching profile data:", profileError);
  }

  const userFirstName = profileData?.first_name;
  const userLastName = profileData?.last_name;
  const avatar = profileData?.avatar;

  // TODO add a form to change password and email
  // TODO add a button to delete the user's account
  // TODO add a button to log out
  return (
    <div>
      <h2 className="mb-4">Profile Settings</h2>
      <form action={updateProfileData} className="mb-8 flex flex-col gap-2">
        <Image src={avatar} alt="Profile Picture" width={300} height={300} />
        <label htmlFor="avatar">Choose a profile picture:</label>
        <input type="file" id="avatar" name="avatar" accept="image/*" />
        <label htmlFor="first_name">First Name</label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          required
          defaultValue={userFirstName}
        />
        <label htmlFor="last_name">Last Name</label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          required
          defaultValue={userLastName}
        />
        <button type="submit" name="button" value="submit">
          Save Changes
        </button>
      </form>
      <h2 className="mb-4">Account Settings</h2>
      <form className="flex flex-col gap-2">
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required disabled />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          disabled
        />
      </form>
    </div>
  );
}
