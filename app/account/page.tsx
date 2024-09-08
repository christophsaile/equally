import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout, updateProfileData } from "./actions";
import { Button } from "@/components/button";
import { Navigation } from "@/components/navigation";
import { Avatar } from "@/components/avatar";

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

  // TODO add option to update email
  // TODO add a button to delete the user's account
  return (
    <div>
      <h2 className="mb-8 font-semibold text-gray-800 dark:text-white">
        Profile Settings
      </h2>
      <form action={updateProfileData} className="mb-8 flex flex-col gap-4">
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
            className="focus-style block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:file:bg-neutral-700 dark:file:text-neutral-400"
          />
        </div>
        <div>
          <label
            htmlFor="first_name"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            className="focus-style block w-full rounded-lg border-gray-200 px-4 py-3 text-sm disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
            placeholder="John"
            required
            defaultValue={userFirstName}
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            className="focus-style block w-full rounded-lg border-gray-200 px-4 py-3 text-sm disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
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
      <div>
        <h2 className="mb-8 font-semibold text-gray-800 dark:text-white">
          Account Settings
        </h2>
        <Button href="/update-password" variant="accent" className="w-full">
          Update Password
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-[1em] w-[1em]"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
      <form>
        <Navigation>
          <Button variant="primary" href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={3}
              aria-label="Back Link"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Button>
          <Button variant="danger" formAction={logout} pendingText="Loading">
            Log out
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.166 5.106a.75.75 0 0 1 0 1.06 8.25 8.25 0 1 0 11.668 0 .75.75 0 1 1 1.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 0 1 1.06 0Z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </Navigation>
      </form>
    </div>
  );
}
