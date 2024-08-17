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

  let userFirstName = "";
  let userLastName = "";

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id);

  if (profileData?.length) {
    userFirstName = profileData[0].first_name;
    userLastName = profileData[0].last_name;
  }

  return (
    <div>
      <h1>Account</h1>
      <p>
        {userFirstName} {userLastName}
      </p>
    </div>
  )
}