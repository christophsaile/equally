import { Alert } from "@/components/alert";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  determineSplittedAmount,
  euroFormatter,
  formatTimestamp,
} from "../../utils";
import Breadcrumb from "@/components/breadcrumb";

type Props = {
  expenseId: number;
};

export default async function DynamicContent({ ...props }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: expenseData, error: expenseError } = await supabase
    .from("expenses")
    .select(
      "expense_id, description, amount, split, created_at, paid(id, first_name, avatar), owes(id, first_name, avatar), created_by(id, first_name)",
    )
    .eq("expense_id", props.expenseId)
    .limit(1)
    .single();

  if (expenseError) {
    console.error("Error fetching data from expense/[Id]", expenseError);
    return <Alert type="error">Error fetching data</Alert>;
  }

  if (!expenseData) {
    return (
      <Alert type="error">No expense found with the id {props.expenseId}</Alert>
    );
  }

  // TODO if we at some point want to allow multiple users to be part of a transaction
  // this function needs to be updated
  const checkIfUserIsPartOfTransaction = (expenseData: any, user: any) => {
    if (expenseData.paid.id === user.id || expenseData.owes.id === user.id) {
      return true;
    }
    return false;
  };

  if (!checkIfUserIsPartOfTransaction(expenseData, user)) {
    return (
      <Alert type="error">
        You have no access to preview this expense since you were not part of
        the transaction.
      </Alert>
    );
  }

  const { description, amount, split, created_at, paid, owes, created_by } =
    expenseData;

  // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
  const namePaidBy = paid.id === user.id ? "You" : paid.first_name;
  // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
  const nameOwedTo = owes.id === user.id ? "You" : owes.first_name;
  const nameCreator =
    // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
    created_by.id === user.id ? "You" : created_by.first_name;

  return (
    <>
      {/* { TODO make this dynamic} */}
      <Breadcrumb
        className="mb-8"
        items={[
          { name: "Home", href: "/home" },
          {
            // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
            name: user.id === paid.id ? owes.first_name : paid.first_name,
            // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
            href: `/expense/profile/${user.id === paid.id ? owes.id : paid.id}`,
          },
          { name: description },
        ]}
      ></Breadcrumb>
      <div className="flex flex-col gap-6 pt-2">
        <div>
          <h1 className="font-semibold text-gray-800 dark:text-white">
            {description}
          </h1>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Added by {nameCreator} on{" "}
            {formatTimestamp(created_at, { day: true })}
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-gray-800 dark:text-white">
              {namePaidBy} paid {euroFormatter(amount)}
            </h2>
            <ul className="list-disc space-y-2 ps-5 text-sm text-gray-600 marker:text-teal-600 dark:text-neutral-400">
              <li>
                {namePaidBy} owe{" "}
                {euroFormatter(determineSplittedAmount(amount, split))}
              </li>
              <li>
                {nameOwedTo} owes{" "}
                {euroFormatter(determineSplittedAmount(amount, split))}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
