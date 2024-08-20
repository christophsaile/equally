import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateProfileData } from "./actions";

export default async function FirstLogin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <form action={updateProfileData} className="mb-8 flex flex-col gap-2">
      <label htmlFor="first_name">First Name</label>
      <input id="first_name" name="first_name" type="text" required />
      <label htmlFor="last_name">Last Name</label>
      <input id="last_name" name="last_name" type="text" required />
      <button type="submit" name="button" value="submit">
        Save Changes
      </button>
    </form>
  );
}
