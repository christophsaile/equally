import Image from "next/image";
import Link from "next/link";

type Props = {
  date: string;
  description: string;
  split: string;
  href: string;
  avatar?: string;
  children: React.ReactNode;
};

export function ExpenseTimelineItem({
  date,
  description,
  split,
  href,
  avatar,
  children,
}: Props) {
  return (
    <div className="group relative flex gap-x-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
      <Link className="absolute inset-0 z-[1] rounded-lg" href={href}>
        <span className="sr-only">{description} expense details</span>
      </Link>

      {/* <!-- Icon --> */}
      <div className="relative after:absolute after:bottom-0 after:start-3.5 after:top-0 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 last:after:hidden dark:after:bg-neutral-700 dark:group-hover:after:bg-neutral-600">
        <div className="relative z-10 flex size-7 items-center justify-center">
          <div className="size-2 rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-600 dark:border-neutral-600 dark:bg-neutral-800 dark:group-hover:border-neutral-600"></div>
        </div>
      </div>
      {/* <!-- End Icon --> */}

      {/* <!-- Right Content --> */}
      <div className="grow p-2 pb-8">
        <div className="mb-4 flex items-center">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {description}
            </h3>
            <div className="text-sm text-gray-600 dark:text-neutral-400">
              {split}
            </div>
          </div>
          <div className="ml-auto">{children}</div>
        </div>
        <div className="flex items-center text-gray-600 dark:text-neutral-400">
          <p className="text-sm">Created at {date}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-auto size-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {/* <!-- End Right Content --> */}
    </div>
  );
}
