import Link from "next/link";

type Props = {
  href: string;
};

export function BackLink({ ...props }: Props) {
  return (
    <Link className="btn-primary fixed bottom-4 left-4" href={props.href}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="h-[1em] w-[1em]"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
      previous page
    </Link>
  );
}
