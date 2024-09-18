import Link from "next/link";

type Props = {
  link?: boolean;
};

export default function Logo({ ...props }: Props) {
  const SvgLogo = () => (
    <svg
      viewBox="0 0 145 139"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2.46657 0.486328H85.4386L85.6366 31.923H40.0911V73.0477H43.6556L50.1903 52.8808L84.6465 60.3939C84.6465 88.074 58.9034 91.6329 40.0911 81.3517V105.473H86.0327L88.0129 138.887H0.486328L2.46657 0.486328Z"
        className="fill-neutral-900 dark:fill-white"
      />
      <path
        d="M105.499 138.887V103.891H144.114V138.887H105.499Z"
        className="fill-neutral-900 dark:fill-white"
      />
    </svg>
  );
  return (
    <div className="h-10 w-10">
      {props.link ? (
        <Link href="/home" className="block">
          <span className="sr-only">Home</span>
          {SvgLogo()}
        </Link>
      ) : (
        SvgLogo()
      )}
    </div>
  );
}
