import Link from "next/link";
import { Avatar } from "./avatar";

type Props = {
  avatar?: string;
  firstName: string;
  lastName: string;
  link?: {
    href: string;
    label: string;
  };
};

export function Profile({ ...props }: Props) {
  return (
    <div
      className={`relative flex flex-row items-center gap-4 rounded-lg px-2 py-4 ${props.link ? "hover:bg-gray-100 dark:hover:bg-white/10" : ""} `}
    >
      {props.link && (
        <Link
          href={props.link.href}
          className="absolute inset-0 z-[1] rounded-lg"
        >
          <span className="sr-only">{props.link.href}</span>
        </Link>
      )}
      <Avatar src={props.avatar} size="md" />
      <h2 className="flex flex-col font-semibold text-gray-800 dark:text-white">
        {props.firstName}
        <span className="text-sm font-normal text-gray-600 dark:text-neutral-400">
          {props.lastName}
        </span>
      </h2>
      {props.link?.href && (
        <div className="ml-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-[1em] w-[1em] text-gray-600 dark:text-neutral-400"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
