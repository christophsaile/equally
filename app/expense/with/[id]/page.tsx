import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ExpenseCard } from "./expense-card";
import { determineSplittedAmount, euroFormatter } from "../../utils";
import { ExpenseAddLink } from "../../add/expense-add-link";
import { Profile } from "@/components/profile";

export default async function ExpenseProfile({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const [profileResult, paidByYouResult, paidByProfileResult] =
    await Promise.all([
      supabase.from("profiles").select().eq("id", params.id).limit(1).single(),
      supabase
        .from("expenses")
        .select()
        .eq("paid", user.id)
        .eq("owes", params.id),
      supabase
        .from("expenses")
        .select()
        .eq("paid", params.id)
        .eq("owes", user.id),
    ]);

  const { data: profileData, error: profileError } = profileResult;
  const { data: paidByYouData, error: paidByYouError } = paidByYouResult;
  const { data: paidByProfileData, error: paidByProfileError } =
    paidByProfileResult;

  if (paidByYouError || paidByProfileError || profileError) {
    console.error(
      "Error fetching data:",
      paidByYouError || paidByProfileError || profileError,
    );
    return [];
  }

  const userFirstName = profileData.first_name;
  const userLastName = profileData.last_name;

  const combinedData = [...paidByYouData, ...paidByProfileData].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const splitText = (split: number) => {
    if (split === 1 || split === 2) {
      return "You paid";
    } else {
      return `${userFirstName} paid`;
    }
  };

  const splitDescription = (split: number, amount: number) =>
    `${splitText(split)} ${euroFormatter(amount)}`;

  return (
    <div className="flex flex-col gap-4">
      <Profile firstName={userFirstName} lastName={userLastName}></Profile>
      <div className="flex flex-col gap-2">
        {combinedData.map((expense) => {
          const amountColor =
            expense.paid === user.id ? "text-green-500" : "text-red-500";
          const amountText = expense.paid === user.id ? "you lent" : "you owe";
          return (
            <ExpenseCard
              key={expense.expense_id}
              date={expense.created_at}
              description={expense.description}
              split={splitDescription(expense.split, expense.amount)}
              href={`/expense/${expense.expense_id}`}
            >
              <p className={`ml-auto flex flex-col text-right ${amountColor}`}>
                <span className="text-xs">{amountText}</span>{" "}
                {euroFormatter(
                  determineSplittedAmount(expense.amount, expense.split),
                )}
              </p>
            </ExpenseCard>
          );
        })}
      </div>
      <ExpenseAddLink profileId={params.id}></ExpenseAddLink>
    </div>
  );
}
