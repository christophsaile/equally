"use client";

import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<"button"> & {
  href?: Url;
  variant: "primary" | "secondary" | "accent" | "danger";
  children: React.ReactNode;
  pendingText?: string;
};

export function Button({
  href,
  variant,
  children,
  pendingText,
  ...props
}: Props) {
  const baseButtonClass =
    "h-[46px] py-3 px-4 inline-flex items-center justify-between gap-x-2 text-base font-medium rounded-lg border border-transparent disabled:opacity-50 disabled:pointer-events-none shadow-md focus-style";
  const variantClasses = {
    primary:
      "bg-gray-800 text-white hover:bg-gray-900 focus:bg-gray-900 dark:bg-white dark:text-neutral-800 dark:hover:bg-gray-200 dark:focus:bg-gray-200",
    secondary: "bg-white text-gray-800 hover:bg-gray-200 focus:bg-gray-200",
    accent: "bg-teal-600 text-white hover:bg-teal-700 focus:bg-teal-700",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:bg-red-600",
  };

  const baseLoadingClass =
    "inline-block size-4 animate-spin rounded-full border-[3px] border-current border-t-transparent";
  const loadingClasses = {
    primary: "text-white dark:text-neutral-800",
    secondary: "text-gray-800",
    accent: "text-white",
    danger: "text-white",
  };

  const getButtonClass = () =>
    `${baseButtonClass} ${variantClasses[variant] || ""}`;

  const getLoadingClass = () =>
    `${baseLoadingClass} ${loadingClasses[variant] || ""}`;

  const RenderButton = () => {
    const { pending, action } = useFormStatus();
    console.log(pending, action);

    const isPending = pending && action === props.formAction;

    return (
      <button
        className={`${getButtonClass()} ${props.className || ""}`}
        formAction={props.formAction}
        type={props.type}
        onClick={props.onClick}
        disabled={isPending || props.disabled}
        form={props.form}
      >
        {isPending ? (
          <>
            {pendingText}
            <span
              className={getLoadingClass()}
              role="status"
              aria-label="loading"
            ></span>
          </>
        ) : (
          children
        )}
      </button>
    );
  };
  const RenderLink = () => {
    return (
      <Link
        className={`${getButtonClass()} ${props.className || ""}`}
        href={href!}
      >
        {children}
      </Link>
    );
  };
  return href ? <RenderLink></RenderLink> : <RenderButton></RenderButton>;
}
