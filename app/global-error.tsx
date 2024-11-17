"use client";

import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import Header from "@/components/header";
import Logo from "@/components/logo";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        className={`flex min-h-dvh pb-24 pt-8 dark:bg-neutral-900 dark:text-white`}
      >
        <div className="mx-auto max-w-lg grow px-4">
          <div className="mb-4 flex flex-col gap-4">
            <Logo link></Logo>
            <hr className="border-gray-200 dark:border-neutral-700"></hr>
          </div>
          <main>
            {" "}
            <h1 className="text-2xl font-semibold leading-relaxed text-gray-800 dark:text-white">
              Something went wrong 😔
            </h1>
            <p className="pb-6 text-2xl leading-relaxed text-gray-600 dark:text-neutral-400">
              We are sorry, but an unexpected error has occurred.
            </p>
            <p>In the meantime, you can:</p>
            <ul className="list-disc space-y-2 py-2 ps-5 marker:text-teal-600">
              <li>Try refreshing the page.</li>
              <li>
                Return to the{" "}
                <Link href="/home" className="text-teal-600 underline">
                  homepage
                </Link>
                .
              </li>
            </ul>
            <p className="pb-8">
              If the error persists, contact our{" "}
              <a
                className="inline-flex items-center gap-1 text-teal-600 underline"
                href="mailto:christoph.saile@googlemail.com"
              >
                support{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[1em] w-[1em]"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              . Please include a screenshot to resolve the issue as quickly as
              possible.
            </p>
            <Alert type="error">{error.message}</Alert>
          </main>
        </div>
      </body>
    </html>
  );
}
