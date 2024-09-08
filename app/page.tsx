import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "../components/card";
import { Profile } from "@/components/profile";
import { Button } from "@/components/button";
import { Navigation } from "@/components/navigation";
import { Alert } from "@/components/alert";

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
      .select(
        "balance_id, user_id (id, first_name, last_name, avatar), owes, amount",
      )
      .eq("owes", user.id),
    supabase
      .from("balances")
      .select(
        "balance_id, user_id, owes (id, first_name, last_name, avatar), amount",
      )
      .eq("user_id", user.id),
  ]);

  const { data: profileData, error: profileError } = profileResult;
  const { data: loggedInUserGetsMoneyFrom, error: owedError } = owedResult;
  const { data: loggedInUserOwesMoneyFrom, error: owesError } = owesResult;

  if (owedError || owesError || profileError) {
    console.error(
      "Error fetching data from '/'",
      owedError || owesError || profileError,
    );
  }

  const userFirstName = profileData?.first_name;
  const userLastName = profileData?.last_name;
  const userAvatar = profileData?.avatar;

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
        avatar={userAvatar}
        href="/account"
      ></Profile>
      {data?.length ? (
        <ul>
          {data?.map((elem) => (
            <li key={elem.balance_id}>
              <Card
                // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
                avatar={elem.user_id.avatar}
                amount={elem.amount}
                // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
                firstName={elem.user_id.first_name}
                // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
                lastName={elem.user_id.last_name}
                // @ts-ignore https://github.com/supabase/postgrest-js/issues/546
                href={`/expense/profile/${elem.user_id.id}`}
              ></Card>
            </li>
          ))}
        </ul>
      ) : (
        <Alert type="info">
          No expenses found yet. To create an expense use the &quot;Add
          Expense&quot; button below.
        </Alert>
      )}
      <Navigation>
        <Button className="col-start-2" variant="accent" href="/expense/add">
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
