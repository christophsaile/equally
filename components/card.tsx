import Link from "next/link";
import { euroFormatter } from "../app/expense/utils";
import { Avatar } from "./avatar";

type Props = {
  avatar?: string;
  firstName: string;
  lastName: string;
  amount: number;
  href: string;
};

export function Card({ avatar, firstName, lastName, amount, href }: Props) {
  const isAmountNegative = amount < 0;
  const amountColor = isAmountNegative ? "text-red-500" : "text-teal-500";
  const amountText = isAmountNegative ? "you owe" : "owes you";

  return (
    <div className="bg-gray relative flex items-center gap-4 rounded-lg px-2 pb-8 pt-4 hover:bg-gray-100 dark:hover:bg-white/10">
      <Link href={href} className="absolute inset-0 z-[1] rounded-lg">
        <span className="sr-only">
          {`${firstName} ${lastName}`} listed expenses
        </span>
      </Link>
      <Avatar src={avatar} size="md" />
      <h2 className="flex flex-col font-semibold text-gray-800 dark:text-white">
        {firstName}
        <span className="text-xs font-normal text-gray-600 dark:text-neutral-400">
          {lastName}
        </span>
      </h2>
      <p
        className={`ml-auto flex flex-col text-right font-bold ${amountColor}`}
      >
        <span className="text-xs font-normal">{amountText}</span>{" "}
        {euroFormatter(amount)}
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="absolute bottom-4 right-2 size-4 text-gray-600 dark:text-neutral-400"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
