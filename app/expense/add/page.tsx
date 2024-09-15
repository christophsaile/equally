import { createClient } from "@/utils/supabase/server";
import FormExpense from "../../../components/form-expense";
import { Profile } from "../utils";
import { addExpense } from "./actions";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/button";
import { redirect } from "next/navigation";
import { Alert } from "@/components/alert";
import { FormMessage, Message } from "@/components/form-message";
import Breadcrumb from "@/components/breadcrumb";

export default async function ExpenseAdd({
  searchParams,
}: {
  searchParams: { profile_id: string } & Message;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .neq("id", user?.id);

  if (error) {
    console.error("Error fetching data from expense/edit:", error);
    return <Alert type="error">Error fetching data</Alert>;
  }

  const preselectProfile = data?.find(
    (profile) => profile.id === searchParams.profile_id,
  );

  const generateBreadcrumb = () => {
    if (preselectProfile) {
      return [
        { name: "Home", href: "/home" },
        {
          name: preselectProfile.first_name,
          href: `/expense/profile/${preselectProfile.id}`,
        },
        { name: "Add Expense" },
      ];
    }

    return [{ name: "Home", href: "/home" }, { name: "Add Expense" }];
  };

  return (
    <>
      <Breadcrumb items={generateBreadcrumb()}></Breadcrumb>
      <FormExpense
        profiles={data as Profile[]}
        preselectProfile={preselectProfile}
      >
        <Navigation>
          <Button
            variant="primary"
            href={
              searchParams.profile_id
                ? `/expense/profile/${searchParams.profile_id}`
                : "/home"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={3}
              aria-label="Back"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </Button>
          <Button
            variant="accent"
            formAction={addExpense}
            pendingText="Loading"
          >
            Save
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
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </Navigation>
      </FormExpense>
      <FormMessage message={searchParams} />
    </>
  );
}
