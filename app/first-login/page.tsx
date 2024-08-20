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
    <form
      action={updateProfileData}
      className="mb-8 flex flex-col gap-4 rounded border p-4 shadow-md"
    >
      <div className="flex flex-col">
        <label htmlFor="first_name" className="mb-1 font-semibold">
          First Name
        </label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          required
          className="rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="last_name" className="mb-1 font-semibold">
          Last Name
        </label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          required
          className="rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        name="button"
        value="submit"
        className="mt-4 rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
      >
        Save Changes
      </button>
    </form>
  );
}
