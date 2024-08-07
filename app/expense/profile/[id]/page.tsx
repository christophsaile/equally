import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ExpenseCard } from "./expenseCard";

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

  // profile data, TODO: can be called in parallel
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("id", params.id);
  const { first_name: firstName, last_name: lastName } = profileData[0];

  // expenses data, TODO: paidByYouData and paidByProfileData can be called in parallel
  const { data: paidByYouData, error: paidByYouError } = await supabase
    .from("expenses")
    .select()
    .eq("paid_by", user.id)
    .eq("owed_to", params.id);

  const { data: paidByProfileData, error: paidByProfileError } = await supabase
    .from("expenses")
    .select()
    .eq("paid_by", params.id)
    .eq("owed_to", user.id);

  if (paidByYouError || paidByProfileError) {
    console.error("Error fetching data:", paidByYouError || paidByProfileError);
    return [];
  }

  const combinedData = [...paidByYouData, ...paidByProfileData].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const Euro = new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  });

  const splitText = (split: number) => {
    if (split === 1 || split === 2) {
      return "You paid";
    } else {
      return `${firstName} paid`;
    }
  };

  // TODO: Move this to a helper function
  const spiltAmount = (split: number, amount: number) => {
    if (split === 1 || split === 3) {
      return amount / 2;
    }
    return amount;
  };

  const splitDescription = (split: number, amount: number) =>
    `${splitText(split)} ${Euro.format(amount)}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 items-center">
        <div className="rounded-full w-12 h-12 bg-neutral-200">
          {/* {avatar && <Image src={avatar} alt="" />} */}
        </div>
        <h2 className="flex flex-col">
          {firstName}
          <span className="text-xs text-neutral-500">{lastName}</span>
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {combinedData.map((expense) => {
          const amountColor =
            expense.paid_by === user.id ? "text-green-500" : "text-red-500";
          const amountText =
            expense.paid_by === user.id ? "you lent" : "you owe";
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
                {Euro.format(spiltAmount(expense.split, expense.amount))}
              </p>
            </ExpenseCard>
          );
        })}
      </div>
    </div>
  );
}
