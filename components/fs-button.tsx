import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  href?: Url;
  variant: "primary" | "secondary" | "accent";
  children: React.ReactNode;
};

export function FsButton({ href, variant, children, ...props }: Props) {
  const renderButton = () => {
    return (
      <button className="btn-primary" formAction={props.formAction}>
        {children}
      </button>
    );
  };
  const renderLink = () => {
    return (
      <Link className="btn-primary" href={href!}>
        {children}
      </Link>
    );
  };
  return href ? renderLink() : renderButton();
}
