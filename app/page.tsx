import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ExpenseAddLink } from "./expense/add/expense-add-link";
import { Card } from "../components/card";
import { Profile } from "@/components/profile";

export default async function Home() {
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

  const userFirstName = profileData?.first_name;
  const userLastName = profileData?.last_name;

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
    <div className="flex flex-col gap-10">
      <Profile
        firstName={userFirstName}
        lastName={userLastName}
        loggedInUser
      ></Profile>
      <ul>
        {data?.map((elem) => (
          <li key={elem.balance_id}>
            <Card
              avatar=""
              amount={elem.amount}
              // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
              firstName={elem.user_id.first_name}
              // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
              lastName={elem.user_id.last_name}
              // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
              href={`/expense/with/${elem.user_id.id}`}
            ></Card>
            <hr />
          </li>
        ))}
      </ul>
      <ExpenseAddLink></ExpenseAddLink>
    </div>
  );
}
