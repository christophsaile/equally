import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { updateProfileData } from "./actions";
import { Button } from "@/components/button";
import { FormMessage, Message } from "@/components/form-message";
export default async function FirstLogin(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
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
    <div className="pt-2">
      <h1 className="text-2xl font-semibold leading-relaxed text-gray-800 dark:text-white">
        Thanks for joining 🤩
      </h1>
      <p className="text-2xl leading-relaxed text-gray-600 dark:text-neutral-400">
        Enter your first and last name to complete your profile.
      </p>
      <form
        action={updateProfileData}
        className="mb-6 flex flex-col gap-10 pt-8"
      >
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
        <Button
          className="col-start-2"
          variant="accent"
          type="submit"
          pendingText="Loading"
        >
          Complete
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-[1em] w-[1em]"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Button>
      </form>
      <FormMessage message={searchParams} />
    </div>
  );
}
