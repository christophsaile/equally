import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ExpenseCard } from "./expenseCard";

// TODO Move this somewhere else, this page is reserved for single expenses to list the details like amount, description, split etc
export default async function ExpenseId({
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

  // profile data
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select()
    .eq("id", params.id);
  const { first_name: firstName, last_name: lastName } = profileData[0];

  // expenses data
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
          return (
            <ExpenseCard
              key={expense.expense_id}
              date={expense.created_at}
              description={expense.description}
              split={expense.split}
              amount={expense.amount}
              href={`/expense/${expense.expense_id}`}
            ></ExpenseCard>
          );
        })}
      </div>
    </div>
  );
}
