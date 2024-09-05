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

  // TODO add link to update password page
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
            className="block w-full rounded-lg border border-gray-200 text-sm shadow-sm file:me-4 file:border-0 file:bg-gray-50 file:px-4 file:py-3 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:file:bg-neutral-700 dark:file:text-neutral-400"
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
            className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
            className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
      {/* <h2 className="mb-8">Account Settings</h2>
      <form className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="input-label"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="input-label"
            className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="you@site.com"
            defaultValue={user.email}
          />
        </div>
        <div className="flex flex-col gap-4" data-hs-toggle-password-group="">
          <div>
            <label
              htmlFor="hs-toggle-password-multi-toggle-np"
              className="mb-2 block text-sm dark:text-white"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="hs-toggle-password-multi-toggle-np"
                type="password"
                className="block w-full rounded-lg border-gray-200 py-3 pe-10 ps-4 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Enter new password"
              />
              <button
                type="button"
                data-hs-toggle-password='{
          "target": ["#hs-toggle-password-multi-toggle", "#hs-toggle-password-multi-toggle-np"]
        }'
                className="absolute inset-y-0 end-0 z-20 flex cursor-pointer items-center rounded-e-md px-3 text-gray-400 focus:text-blue-600 focus:outline-none dark:text-neutral-600 dark:focus:text-blue-500"
              >
                <svg
                  className="size-3.5 shrink-0"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    className="hs-password-active:hidden"
                    d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                  ></path>
                  <path
                    className="hs-password-active:hidden"
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                  ></path>
                  <path
                    className="hs-password-active:hidden"
                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                  ></path>
                  <line
                    className="hs-password-active:hidden"
                    x1="2"
                    x2="22"
                    y1="2"
                    y2="22"
                  ></line>
                  <path
                    className="hs-password-active:block hidden"
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                  ></path>
                  <circle
                    className="hs-password-active:block hidden"
                    cx="12"
                    cy="12"
                    r="3"
                  ></circle>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="hs-toggle-password-multi-toggle"
              className="mb-2 block text-sm dark:text-white"
            >
              Current password
            </label>
            <div className="relative">
              <input
                id="hs-toggle-password-multi-toggle"
                type="password"
                className="block w-full rounded-lg border-gray-200 py-3 pe-10 ps-4 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Enter current password"
                value="12345qwerty"
              />
              <button
                type="button"
                data-hs-toggle-password='{
          "target": ["#hs-toggle-password-multi-toggle", "#hs-toggle-password-multi-toggle-np"]
        }'
                className="absolute inset-y-0 end-0 z-20 flex cursor-pointer items-center rounded-e-md px-3 text-gray-400 focus:text-blue-600 focus:outline-none dark:text-neutral-600 dark:focus:text-blue-500"
              >
                <svg
                  className="size-3.5 shrink-0"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    className="hs-password-active:hidden"
                    d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                  ></path>
                  <path
                    className="hs-password-active:hidden"
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                  ></path>
                  <path
                    className="hs-password-active:hidden"
                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                  ></path>
                  <line
                    className="hs-password-active:hidden"
                    x1="2"
                    x2="22"
                    y1="2"
                    y2="22"
                  ></line>
                  <path
                    className="hs-password-active:block hidden"
                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                  ></path>
                  <circle
                    className="hs-password-active:block hidden"
                    cx="12"
                    cy="12"
                    r="3"
                  ></circle>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form> */}
      <form>
        <Navigation>
          <Button variant="primary" href={`/`}>
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
