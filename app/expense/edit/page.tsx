import { createClient } from "@/utils/supabase/server";
import FormExpense from "../../../components/form-expense";
import { Profile } from "../utils";
import { editExpense } from "./actions";
import { Button } from "@/components/button";
import { Navigation } from "@/components/navigation";
import { FormMessage, Message } from "@/components/form-message";
import { Alert } from "@/components/alert";
import Breadcrumb from "@/components/breadcrumb";

export default async function ExpenseEdit({
  searchParams,
}: {
  searchParams: { expense_id: string } & Message;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profilesResult, expenseResult] = await Promise.all([
    supabase.from("profiles").select().neq("id", user?.id),
    supabase
      .from("expenses")
      .select()
      .eq("expense_id", searchParams.expense_id)
      .limit(1)
      .single(),
  ]);

  const { data: profileData, error: profileError } = profilesResult;
  const { data: expenseData, error: expenseError } = expenseResult;

  if (profileError || expenseError) {
    console.error(
      "Error fetching data from expense/edit:",
      profileError || expenseError,
    );
    return <Alert type="error">Error fetching data</Alert>;
  }

  const { split, paid, owes, amount, description } = expenseData;

  const preselectProfile = profileData?.find(
    (profile) => profile.id === paid || profile.id === owes,
  );

  return (
    <>
      <Breadcrumb
        className="mb-8"
        items={[
          { name: "Home", href: "/home" },
          {
            name: preselectProfile.first_name,
            href: `/expense/profile/${preselectProfile.id}`,
          },
          {
            name: description,
            href: `/expense/id/${searchParams.expense_id}`,
          },
          { name: "Edit Expense" },
        ]}
      ></Breadcrumb>
      <FormExpense
        profiles={profileData as Profile[]}
        preselectProfile={preselectProfile}
        split={split}
        amount={amount}
        description={description}
      >
        <input
          type="hidden"
          name="expense_id"
          value={searchParams.expense_id}
        />
        <Navigation>
          <Button
            variant="primary"
            href={`/expense/id/${searchParams.expense_id}?profile_id=${preselectProfile.id}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-[1em] w-[1em]"
              stroke="currentColor"
              strokeWidth={3}
              aria-label="Back to expense"
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
            formAction={editExpense}
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
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg>
          </Button>
        </Navigation>
      </FormExpense>
      <FormMessage message={searchParams} />
    </>
  );
}
