"use client";

import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  href?: Url;
  variant: "primary" | "secondary" | "accent" | "danger";
  children: React.ReactNode;
};

export function FsButton({ href, variant, children, ...props }: Props) {
  const renderButton = () => {
    return (
      <button
        className={`btn-primary ${props.className || ""}`}
        formAction={props.formAction}
        onClick={props.onClick}
      >
        {children}
      </button>
    );
  };
  const renderLink = () => {
    return (
      <Link className={`btn-primary ${props.className || ""}`} href={href!}>
        {children}
      </Link>
    );
  };
  return href ? renderLink() : renderButton();
}
