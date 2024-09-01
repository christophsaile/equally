import Image from "next/image";

type Props = {
  avatar?: string;
  firstName: string;
  lastName: string;
  loggedInUser?: boolean;
};

export function Profile({ ...props }: Props) {
  return (
    <div className="flex flex-row items-center gap-4 px-2 py-4">
      <div className="h-12 w-12 rounded-full bg-neutral-200">
        {props.avatar && <Image src={props.avatar} alt="" />}
      </div>
      <h2 className="flex flex-col font-semibold text-gray-800 dark:text-white">
        {props.firstName}
        <span className="text-xs font-normal text-gray-600 dark:text-neutral-400">
          {props.lastName}
        </span>
      </h2>
      {props.loggedInUser && (
        <div className="ml-auto">
          <span className="sr-only">Account Settings</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-[1em] w-[1em] text-gray-600 dark:text-neutral-400"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
