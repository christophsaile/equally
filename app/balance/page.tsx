import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ExpenseAddLink } from "../expense/add/expense-add-link";
import { BalanceCard } from "./balance-card";
import { Profile } from "@/components/Profile";

export default async function Balance() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const [profileResult, owedResult, owesResult] = await Promise.all([
    supabase.from("profiles").select().eq("id", user.id).limit(1).single(),
    supabase
      .from("balances")
      .select("balance_id, user_id (id, first_name, last_name), owes, amount")
      .eq("owes", user.id),
    supabase
      .from("balances")
      .select("balance_id, user_id, owes (id, first_name, last_name), amount")
      .eq("user_id", user.id),
  ]);

  const { data: profileData, error: profileError } = profileResult;
  const { data: loggedInUserGetsMoneyFrom, error: owedError } = owedResult;
  const { data: loggedInUserOwesMoneyFrom, error: owesError } = owesResult;

  if (owedError || owesError || profileError) {
    console.error(
      "Error fetching data:",
      owedError || owesError || profileError,
    );
  }

  const userFirstName = profileData.first_name;
  const userLastName = profileData.last_name;

  const owesMoneyMap = new Map(
    loggedInUserOwesMoneyFrom?.map((balanceOwe) => [
      // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
      balanceOwe.owes.id,
      balanceOwe.amount,
    ]),
  );

  const data = loggedInUserGetsMoneyFrom?.map(
    ({ balance_id, user_id, amount }) => ({
      balance_id,
      user_id,
      // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
      amount: amount - (owesMoneyMap.get(user_id.id) || 0),
    }),
  );

  return (
    <div className="flex flex-col gap-2">
      <Profile
        firstName={userFirstName}
        lastName={userLastName}
        loggedInUser
      ></Profile>
      {data?.map((elem) => (
        <BalanceCard
          key={elem.balance_id}
          avatar=""
          amount={elem.amount}
          // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
          firstName={elem.user_id.first_name}
          // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
          lastName={elem.user_id.last_name}
          // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
          href={`/expense/with/${elem.user_id.id}`}
        ></BalanceCard>
      ))}
      <ExpenseAddLink></ExpenseAddLink>
    </div>
  );
}
