"use client";

import { ComponentProps } from "react";
import { login, signup } from "./actions";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
  action: "login" | "signup";
};

export const SubmitButton = ({ children, ...props }: Props) => {
  return (
    <button
      formAction={props.action === "login" ? login : signup}
      className="btn-primary w-full"
    >
      {children}
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
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  );
};
