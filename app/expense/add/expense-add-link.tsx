import Link from "next/link";

type Props = {
  profileId?: string;
};

export function ExpenseAddLink({ ...props }: Props) {
  return (
    <Link
      className="fixed bottom-5 right-5"
      href={{
        pathname: "/expense/add",
        query: { profile_id: props.profileId },
      }}
    >
      <span className="sr-only">Add Expense</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className=" size-12 text-blue-600"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
}
