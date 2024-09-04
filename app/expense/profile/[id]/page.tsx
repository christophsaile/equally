import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ExpenseCard } from "./expense-card";
import {
  determineSplittedAmount,
  euroFormatter,
  formatTimestamp,
} from "../../utils";
import { Profile } from "@/components/profile";
import { Button } from "@/components/button";
import { Navigation } from "@/components/navigation";
import { ExpenseTimelineItem } from "./expense-timeline-item";
interface Expense {
  expense_id: number;
  paid: string;
  amount: number;
  description: string;
  created_at: string;
  owes: string;
  split: number;
  created_by: string;
}

interface GroupedExpenses {
  [key: string]: Expense[];
}
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
      supabase.from("profiles").select().in("id", [params.id, user.id]),
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
      "Error fetching data from expense/with[id]:",
      paidByYouError || paidByProfileError || profileError,
    );
    return [];
  }

  const userProfile = profileData.find((profile) => profile.id === params.id);
  const myProfile = profileData.find((profile) => profile.id === user.id);

  const combinedData = [...paidByYouData, ...paidByProfileData].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  function groupExpensesByMonth(expenses: Expense[]): GroupedExpenses {
    return expenses.reduce((acc: GroupedExpenses, expense: Expense) => {
      const formattedDate = formatTimestamp(expense.created_at, {
        month: true,
      });

      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }

      acc[formattedDate].push(expense);

      return acc;
    }, {});
  }

  const groupedExpenses = groupExpensesByMonth(combinedData);

  const splitText = (split: number) => {
    if (split === 1 || split === 2) {
      return "You paid";
    } else {
      return `${userProfile.first_name} paid`;
    }
  };

  const splitDescription = (split: number, amount: number) =>
    `${splitText(split)} ${euroFormatter(amount)}`;

  const renderTimelineHeading = (date: string) => {
    return (
      <div className="my-2 ps-2">
        <h3 className="text-xs font-medium uppercase text-gray-600 dark:text-neutral-400">
          {date}
        </h3>
      </div>
    );
  };

  const renderTimeline = () => {
    return Object.keys(groupedExpenses).map((date) => {
      return (
        <div key={date}>
          {renderTimelineHeading(date)}
          {groupedExpenses[date].map((expense) => {
            const amountColor =
              expense.paid === user.id ? "text-teal-500" : "text-red-500";
            const amountText =
              expense.paid === user.id ? "you lent" : "you owe";
            return (
              <ExpenseTimelineItem
                key={expense.expense_id}
                date={formatTimestamp(expense.created_at, { day: true })}
                description={expense.description}
                split={splitDescription(expense.split, expense.amount)}
                href={`/expense/id/${expense.expense_id}`}
                avatar={
                  expense.paid === user.id
                    ? myProfile.avatar
                    : userProfile.avatar
                }
              >
                <p
                  className={`ml-auto flex flex-col text-right font-semibold ${amountColor}`}
                >
                  <span className="text-xs font-normal">{amountText}</span>{" "}
                  {euroFormatter(
                    determineSplittedAmount(expense.amount, expense.split),
                  )}
                </p>
              </ExpenseTimelineItem>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Profile
        firstName={userProfile.first_name}
        lastName={userProfile.last_name}
      ></Profile>
      {renderTimeline()}
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
        <Button
          variant="primary"
          href={{
            pathname: "/expense/add",
            query: { profile_id: params.id },
          }}
        >
          Add Expense
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
    </div>
  );
}
