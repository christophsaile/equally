import { type ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { euroFormatter } from "../expense/utils";

type Props = ComponentProps<"a"> & {
  avatar?: string;
  firstName: string;
  lastName: string;
  amount: number;
};

export function BalanceCard({
  children,
  avatar,
  firstName,
  lastName,
  amount,
  ...props
}: Props) {
  const isAmountNegative = amount < 0;
  const amountColor = isAmountNegative ? "text-red-500" : "text-green-500";
  const amountText = isAmountNegative ? "you owe" : "owes you";

  return (
    <Link {...props}>
      <div className="relative flex items-center gap-4 rounded-md bg-neutral-100 px-4 pb-6 pt-2 hover:bg-neutral-200">
        <div className="h-12 w-12 rounded-full bg-neutral-200">
          {avatar && <Image src={avatar} alt="" />}
        </div>
        <h2 className="flex flex-col">
          {firstName}
          <span className="text-xs text-neutral-500">{lastName}</span>
        </h2>
        <p className={`ml-auto flex flex-col text-right ${amountColor}`}>
          <span className="text-xs">{amountText}</span> {euroFormatter(amount)}
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="absolute bottom-2 right-4 size-4 text-neutral-500"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </Link>
  );
}
