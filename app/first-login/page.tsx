import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateProfileData } from "./actions";
import { Button } from "@/components/button";

export default async function FirstLogin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .limit(1)
    .single();

  if (profileData) {
    return redirect("/home");
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1 text-gray-800 dark:text-white">
        <h1 className="font-semibold">Hey, welcome to Equally</h1>
        <p>To get started please enter your first and your last name.</p>
      </div>
      <form action={updateProfileData} className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="first_name"
              className="mb-2 block text-base font-medium dark:text-white"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="focus-style block w-full rounded-lg border-gray-200 px-4 py-3 text-base disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="mb-2 block text-base font-medium dark:text-white"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="focus-style block w-full rounded-lg border-gray-200 px-4 py-3 text-base disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
              placeholder="Snow"
              required
            />
          </div>
        </div>
        <Button variant="accent" type="submit" pendingText="Saving">
          Save Changes
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[1em] w-[1em]"
            aria-hidden="true"
          >
            <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
            <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
            <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
          </svg>
        </Button>
      </form>
    </div>
  );
}
