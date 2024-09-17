import { createClient } from "@/utils/supabase/server";
import Logo from "./logo";
import { Suspense } from "react";
import { Avatar } from "./avatar";
import Link from "next/link";

export default function Header() {
  async function DynamicContent() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .limit(1)
      .single();

    if (profileError) {
      console.error("Error fetching profile data in header", profileError);
    }

    if (!profileData) {
      return;
    }

    return (
      <div className="relative ml-auto flex items-center gap-4">
        <Link href="/account" className="absolute inset-0 z-[1]">
          <span className="sr-only">Account settings</span>
        </Link>
        <div className="flex flex-col text-right font-semibold text-gray-800 dark:text-white">
          {profileData.first_name}
          <span className="text-sm font-normal text-gray-600 dark:text-neutral-400">
            {profileData.last_name}
          </span>
        </div>
        <Avatar src={profileData.avatar} size="md"></Avatar>
      </div>
    );
  }

  function Skeleton() {
    return (
      <div className="ml-auto flex animate-pulse items-center gap-4">
        <div className="flex flex-col items-end justify-end">
          <div className="mb-2 h-3 w-24 rounded bg-gray-200 dark:bg-neutral-700"></div>
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-neutral-700"></div>
        </div>
        <div className="block h-12 w-12 rounded-full bg-gray-200 dark:bg-neutral-700"></div>
      </div>
    );
  }

  return (
    <header className="mb-4 flex flex-col gap-4">
      <div className="flex items-center">
        <Logo link></Logo>
        <Suspense fallback={<Skeleton></Skeleton>}>
          <DynamicContent></DynamicContent>
        </Suspense>
      </div>
      <hr className="border-gray-200 dark:border-neutral-700"></hr>
    </header>
  );
}
