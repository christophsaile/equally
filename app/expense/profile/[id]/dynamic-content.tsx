import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Profile } from "@/components/profile";
import {
  determineSplittedAmount,
  euroFormatter,
  formatTimestamp,
} from "../../utils";
import TimelineItem from "@/components/timeline-item";
import { Alert } from "@/components/alert";
import { User } from "@supabase/supabase-js";
import Breadcrumb from "@/components/breadcrumb";

type Props = {
  profileId: string;
};

interface GroupedExpenses {
  [key: string]: Expense[];
}

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

function renderTimelineHeading(date: string) {
  return (
    <div className="my-2 ps-2">
      <h3 className="text-sm font-medium uppercase text-gray-600 dark:text-neutral-400">
        {date}
      </h3>
    </div>
  );
}

function renderTimeline(
  groupedExpenses: GroupedExpenses,
  user: User,
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  },
) {
  return Object.keys(groupedExpenses).map((date) => {
    return (
      <div key={date}>
        {renderTimelineHeading(date)}
        {groupedExpenses[date].map((expense) => {
          const amountColor =
            expense.paid === user.id ? "text-teal-500" : "text-red-500";
          const amountText =
            expense.paid === user.id ? "you lent" : "you borrowed";
          const splitText =
            expense.paid === user.id
              ? `You paid ${euroFormatter(expense.amount)}`
              : `${profile.first_name} paid ${euroFormatter(expense.amount)}`;

          return (
            <TimelineItem
              key={expense.expense_id}
              date={formatTimestamp(expense.created_at, { day: true })}
              description={expense.description}
              split={splitText}
              href={`/expense/id/${expense.expense_id}?profile_id=${profile.id}`}
            >
              <p
                className={`ml-auto flex flex-col text-right font-semibold ${amountColor}`}
              >
                <span className="text-sm font-normal">{amountText}</span>{" "}
                {euroFormatter(
                  determineSplittedAmount(expense.amount, expense.split),
                )}
              </p>
            </TimelineItem>
          );
        })}
      </div>
    );
  });
}

export default async function DynamicContent({ ...props }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const [profileResult, paidByYouResult, paidByProfileResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select()
        .eq("id", props.profileId)
        .limit(1)
        .single(),
      supabase
        .from("expenses")
        .select()
        .eq("paid", user.id)
        .eq("owes", props.profileId),
      supabase
        .from("expenses")
        .select()
        .eq("paid", props.profileId)
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
    return <Alert type="error">Error fetching data</Alert>;
  }

  const combinedData = [...paidByYouData, ...paidByProfileData].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const groupedExpenses = groupExpensesByMonth(combinedData);

  return (
    <>
      <Breadcrumb
        className="pb-6"
        items={[
          { name: "Home", href: "/home" },
          { name: profileData.first_name },
        ]}
      ></Breadcrumb>
      <div className="flex flex-col gap-4">
        <Profile
          firstName={profileData.first_name}
          lastName={profileData.last_name}
          avatar={profileData.avatar}
        ></Profile>
        {renderTimeline(groupedExpenses, user, profileData)}
      </div>
    </>
  );
}
