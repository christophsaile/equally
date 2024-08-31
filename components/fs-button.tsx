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
  const baseButtonClass =
    "h-[46px] py-3 px-4 inline-flex items-center justify-between gap-x-2 text-sm font-medium rounded-lg border border-transparent focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variantClasses = {
    primary:
      "bg-gray-800 text-white hover:bg-gray-900 focus:bg-gray-900 dark:bg-white dark:text-neutral-800 dark:hover:bg-gray-200 dark:focus:bg-gray-200",
    secondary: "bg-white text-gray-800 hover:bg-gray-200 focus:bg-gray-200",
    accent: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:bg-red-600",
  };

  const getButtonClass = () =>
    `${baseButtonClass} ${variantClasses[variant] || ""}`;

  const renderButton = () => {
    return (
      <button
        className={`${getButtonClass()} ${props.className || ""}`}
        formAction={props.formAction}
        onClick={props.onClick}
      >
        {children}
      </button>
    );
  };
  const renderLink = () => {
    return (
      <Link
        className={`${getButtonClass()} ${props.className || ""}`}
        href={href!}
      >
        {children}
      </Link>
    );
  };
  return href ? renderLink() : renderButton();
}
