import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { updateProfileData } from "./actions";
import { Button } from "@/components/button";

export async function DynamicContent() {
  const supabase = await createClient();
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
  return (
    <form action={updateProfileData} className="flex flex-col gap-6">
      <div className="m-auto">
        <Avatar src={avatar} size="xl" />
      </div>
      <div>
        <label htmlFor="avatar" className="sr-only">
          Choose file
        </label>
        <input
          type="file"
          name="avatar"
          id="avatar"
          accept="image/*"
          className="focus-style block w-full rounded-lg border border-gray-200 text-base shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:file:bg-neutral-700 dark:file:text-neutral-400"
        />
      </div>
      <div>
        <label
          htmlFor="first_name"
          className="mb-2 block text-base font-medium dark:text-white"
        >
          First Name
        </label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          className="focus-style block w-full rounded-lg border-gray-200 px-4 py-3 text-base disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
          placeholder="John"
          required
          defaultValue={userFirstName}
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
          id="last_name"
          name="last_name"
          type="text"
          className="focus-style block w-full rounded-lg border-gray-200 px-4 py-3 text-base disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
          placeholder="Snow"
          required
          defaultValue={userLastName}
        />
      </div>
      <Button
        type="submit"
        variant="accent"
        className="mt-4"
        pendingText="Saving"
      >
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
  );
}
