import { type ComponentProps } from "react";
import Link from "next/link";

type Props = ComponentProps<"a"> & {
  date: string;
  description: string;
  split: string;
  href: string;
};

export function CardExpense({
  children,
  date,
  description,
  split,
  ...props
}: Props) {
  function formatDate(timestamp: string) {
    const date = new Date(timestamp);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, "0");

    return `${month} ${day}`;
  }

  return (
    <Link {...props}>
      <div className="relative flex items-center gap-4 rounded-md bg-neutral-100 px-4 pb-6 pt-2 hover:bg-neutral-200">
        <time className="text-sm text-neutral-500">{formatDate(date)}</time>
        <h2 className="flex flex-col">
          {description}
          <span className="text-sm text-neutral-500">{split}</span>
        </h2>
        {children}
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
