import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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

  const userFirstName = profileData.first_name;
  const userLastName = profileData.last_name;

  // TODO add a form to update the user's profile, name, email, password, avatar, etc.
  // TODO add a button to delete the user's account
  // TODO add a button to log out
  return (
    <div>
      <h1>Account</h1>
      <p>
        {userFirstName} {userLastName}
      </p>
    </div>
  );
}
