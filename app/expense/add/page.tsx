import { createClient } from "@/utils/supabase/server";
import ExpenseForm from "../expense-form";
import { Profile } from "../utils";
import { addExpense } from "./actions";
import { BackLink } from "@/components/back-link";

export default async function ExpenseAdd({
  searchParams,
}: {
  searchParams: { profile_id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .neq("id", user?.id);
  if (error) console.log(error);

  const preselectProfile = data?.find(
    (profile) => profile.id === searchParams.profile_id,
  );

  return (
    <div>
      <ExpenseForm
        profiles={data as Profile[]}
        preselectProfile={preselectProfile}
      >
        <button className="btn-primary w-full" formAction={addExpense}>
          Add expense
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
        </button>
      </ExpenseForm>
      <BackLink
        href={
          searchParams.profile_id
            ? `/expense/with/${searchParams.profile_id}`
            : "/"
        }
      />
    </div>
  );
}
