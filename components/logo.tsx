import Link from "next/link";

type Props = {
  link?: boolean;
};

export default function Logo({ ...props }: Props) {
  const SvgLogo = () => (
    <svg
      viewBox="0 0 192 192"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="192" height="192" fill="#171717" />
      <path
        d="M28.4666 26.4863H111.439L111.637 57.923H66.0911V99.0477H69.6556L76.1903 78.8808L110.647 86.3939C110.647 114.074 84.9034 117.633 66.0911 107.352V131.473H112.033L114.013 164.887H26.4863L28.4666 26.4863Z"
        fill="white"
      />
      <path
        d="M131.499 164.887V129.891H170.114V164.887H131.499Z"
        fill="white"
      />
    </svg>
  );
  return (
    <div className="h-10 w-10">
      {props.link ? (
        <Link href="/home">
          <span className="sr-only">Home</span>
          {SvgLogo()}
        </Link>
      ) : (
        SvgLogo()
      )}
    </div>
  );
}
