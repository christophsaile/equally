"use client";
import { useState, ComponentProps } from "react";
import { Profile } from "./utils";

// TODO: add library to prevent re-rendering on every key stroke
// TODO: add feature to search for users from database
type Props = ComponentProps<"form"> & {
  profiles: Profile[];
  preselectProfile?: Profile;
  description?: string;
  amount?: number;
  split?: number;
};
export default function ExpenseForm({
  profiles,
  preselectProfile,
  description,
  amount,
  split,
  children,
  ...props
}: Props) {
  const [selectedPerson, setSelectedPerson] = useState<Profile | null>(
    preselectProfile || null,
  );

  return (
    <form {...props} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="profile"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Profile
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                setSelectedPerson(
                  profiles.find(
                    (profile) => profile.id === Number(e.target.value),
                  ) || null,
                );
              }}
              id="profile"
              name="profile"
              defaultValue={preselectProfile?.id}
              data-hs-select='{
      "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
      "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto",
      "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
      "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
    }'
            >
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.first_name} {profile.last_name}
                </option>
              ))}
            </select>
            <div className="absolute end-2.5 top-1/2 -translate-y-1/2">
              <svg
                className="size-4 shrink-0 text-gray-500"
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
                <path d="m7 15 5 5 5-5"></path>
                <path d="m7 9 5-5 5 5"></path>
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Description
          </label>
          <input
            placeholder="Enter a description"
            required
            type="text"
            id="description"
            name="description"
            defaultValue={description}
            className="block w-full rounded-lg border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Amount
          </label>
          <div className="relative">
            <input
              type="text"
              id="amount"
              name="amount"
              className="block w-full rounded-lg border-gray-200 px-4 py-3 pe-16 ps-9 text-sm shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              placeholder="0.00"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
              <span className="text-gray-500 dark:text-neutral-500">€</span>
            </div>
            <div className="pointer-events-none absolute inset-y-0 end-0 z-20 flex items-center pe-4">
              <span className="text-gray-500 dark:text-neutral-500">EUR</span>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="split"
            className="mb-2 block text-sm font-medium dark:text-white"
          >
            Split
          </label>
          <div className="relative">
            <select
              id="split"
              name="split"
              data-hs-select='{
      "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
      "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto",
      "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
      "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"
    }'
            >
              <option value="1">You paid, split equally</option>
              <option value="2">You are owed the full amount</option>
              <option value="3">
                {selectedPerson?.first_name} paid, split equally
              </option>
              <option value="4">
                {selectedPerson?.first_name} is owed the full amount
              </option>
            </select>

            <div className="absolute end-2.5 top-1/2 -translate-y-1/2">
              <svg
                className="size-4 shrink-0 text-gray-500"
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
                <path d="m7 15 5 5 5-5"></path>
                <path d="m7 9 5-5 5 5"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      {children}
    </form>
  );
}
