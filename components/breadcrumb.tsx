import Link from "next/link";

type Item = {
  name: string;
  href?: string;
};

type Props = {
  items: Item[];
};

function breadcrumbItem(item: Item, active: boolean) {
  return active ? (
    <li
      key={item.name}
      className="inline-flex items-center text-sm font-semibold text-gray-800 dark:text-neutral-200"
      aria-current="page"
    >
      {item.name}
    </li>
  ) : (
    <li key={item.name} className="inline-flex items-center">
      <Link
        className="flex items-center text-sm text-gray-500 hover:text-teal-600 focus:text-teal-600 focus:outline-none dark:text-neutral-500 dark:hover:text-teal-500 dark:focus:text-teal-500"
        href={item.href!}
      >
        {item.name}
      </Link>
      <svg
        className="mx-2 size-4 shrink-0 text-gray-400 dark:text-neutral-600"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m9 18 6-6-6-6"></path>
      </svg>
    </li>
  );
}

export default function Breadcrumb({ ...props }: Props) {
  return (
    <nav className="mb-6">
      <ol className="flex max-w-full flex-wrap items-center gap-y-2 whitespace-nowrap">
        {props.items.map((item) =>
          breadcrumbItem(item, item === props.items[props.items.length - 1]),
        )}
      </ol>
    </nav>
  );
}
