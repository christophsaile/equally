import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "../../components/card";
import { Profile } from "@/components/profile";
import { Alert } from "@/components/alert";

export default async function SuspenseContent() {
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
        "balance_id, user_id (id, first_name, last_name, avatar), owes, amount, created_at",
      )
      .eq("owes", user.id)
      .order("created_at"),
    supabase
      .from("balances")
      .select(
        "balance_id, user_id, owes (id, first_name, last_name, avatar), amount",
      ),
  ]);

  const { data: profileData, error: profileError } = profileResult;
  const { data: loggedInUserGetsMoneyFrom, error: owedError } = owedResult;
  const { data: loggedInUserOwesMoneyFrom, error: owesError } = owesResult;

  if (owedError || owesError || profileError) {
    console.error(
      "Error fetching data from '/'",
      owedError || owesError || profileError,
    );
    return (
      <Alert type="error">
        Error while fetching data. Please try again later
      </Alert>
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
    <>
      <Profile
        firstName={userFirstName}
        lastName={userLastName}
        avatar={userAvatar}
        link={{ href: "/account", label: "Account settings" }}
      ></Profile>
      <hr className="border-gray-200 dark:border-neutral-700"></hr>
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
    </>
  );
}
