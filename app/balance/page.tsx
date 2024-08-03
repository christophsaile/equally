import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AddExpenseLink } from "../expense/add-expense-link";
import { BalanceCard } from "./balanceCard";

export default async function Balance() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // select all balances where the user is owed money
  // select all balances where the user owes money
  // subtract the two to get the net balance
  const { data: getMoneyData, error: owedError } = await supabase
    .from("balances")
    .select("balance_id, user_id (id, first_name, last_name), owed_to, amount")
    .eq("owed_to", user.id);

  const { data: oweMoneyData, error: owesError } = await supabase
    .from("balances")
    .select("balance_id, user_id, owed_to (id, first_name, last_name), amount")
    .eq("user_id", user.id);

  if (owedError || owesError) {
    console.error("Error fetching data:", owedError || owesError);
    return [];
  }

  const data = getMoneyData.map((owed) => {
    const owes = oweMoneyData.find((owe) => {
      return owe.user_id === owed.owed_to;
    });
    return {
      balance_id: owed.balance_id,
      user_id: owed.user_id,
      amount: owed.amount - (owes?.amount || 0),
    };
  });

  return (
    <div className="flex flex-col gap-2">
      {data?.map((elem) => (
        <BalanceCard
          key={elem.balance_id}
          avatar=""
          amount={elem.amount}
          firstName={elem.user_id.first_name}
          lastName={elem.user_id.last_name}
          href={`/expense/${elem.user_id.id}`}
        ></BalanceCard>
      ))}
      <AddExpenseLink></AddExpenseLink>
    </div>
  );
}
