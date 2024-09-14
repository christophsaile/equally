"use client";
import { useRef, type ComponentProps } from "react";
import { deleteExpense } from "./actions";

type Props = ComponentProps<"button"> & {
  expense: number;
  profileId: string;
};

export function ExpenseDeleteButton({ children, ...props }: Props) {
  function handleDeleteClick() {
    if (!elementRef.current) return;
    deleteExpense(props.expense, props.profileId).then(() => {
      (window as any).HSOverlay.close(elementRef.current);
    });
  }

  const elementRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <button
        type="button"
        className="ml-auto inline-flex size-[46px] items-center justify-center rounded-full bg-red-500 text-white"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="hs-vertically-centered-modal"
        data-hs-overlay="#hs-vertically-centered-modal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-5 shrink-0"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only">Delete Expense</span>
      </button>
      <div
        id="hs-vertically-centered-modal"
        ref={elementRef}
        className="hs-overlay pointer-events-none fixed start-0 top-0 z-[80] hidden size-full overflow-y-auto overflow-x-hidden"
        role="dialog"
        tabIndex={-1}
        aria-labelledby="hs-vertically-centered-modal-label"
      >
        <div className="m-3 mt-0 flex min-h-[calc(100%-3.5rem)] items-center opacity-0 transition-all ease-out hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="pointer-events-auto flex w-full flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-700/70">
            <div className="flex items-center justify-between border-b px-4 py-3 dark:border-neutral-700">
              <h3
                id="hs-vertically-centered-modal-label"
                className="font-bold text-gray-800 dark:text-white"
              >
                Delete Expense
              </h3>
              <button
                type="button"
                className="focus-style inline-flex size-8 items-center justify-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600"
                aria-label="Close"
                data-hs-overlay="#hs-vertically-centered-modal"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="size-4 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <p className="text-gray-800 dark:text-neutral-400">
                Are you sure you want to delete this expense? Deleted expenses
                cannot be recovered.
              </p>
            </div>
            <div className="flex items-center justify-end gap-x-2 border-t px-4 py-3 dark:border-neutral-700">
              <button
                type="button"
                className="focus-style inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-base font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                data-hs-overlay="#hs-vertically-centered-modal"
              >
                Close
              </button>
              <button
                type="button"
                className="focus-style inline-flex items-center gap-x-2 rounded-lg border border-transparent bg-red-500 px-4 py-3 text-base font-medium text-white hover:bg-red-600 focus:bg-red-600 disabled:pointer-events-none disabled:opacity-50"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
