"use client";
import { ComponentProps } from "react";
import { Profile } from "../app/expense/utils";

// TODO add library to prevent re-rendering on every key stroke
// TODO on edit prevent selecting other user
type Props = ComponentProps<"form"> & {
  profiles: Profile[];
  preselectProfile?: Profile;
  description?: string;
  amount?: number;
  split?: number;
};
export default function FormExpense({
  profiles,
  preselectProfile,
  description,
  amount,
  split,
  children,
  ...props
}: Props) {
  return (
    <form {...props} className="mb-6 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="profile"
            className="mb-2 block text-base font-medium dark:text-white"
          >
            Profile
          </label>
          <div className="relative">
            <select
              id="profile"
              name="profile"
              className="hidden"
              defaultValue={preselectProfile?.id}
              required
              data-hs-select='{"placeholder": "Select a profile",
              "toggleTag": "<button type=\"button\" aria-expanded=\"false\"><span class=\"me-2\" data-icon></span><span class=\"text-gray-800 dark:text-neutral-200 \" data-title></span></button>",
              "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-base focus-style dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400",
              "dropdownClasses": "mt-2 max-h-72 p-1 space-y-0.5 z-20 w-full bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
              "optionClasses": "py-2 px-3 w-full text-base text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
              "optionTemplate": "<div class=\"flex items-center\"><div class=\"me-2\" data-icon></div><div><div class=\"hs-selected:font-semibold text-base text-gray-800 dark:text-neutral-200 \" data-title></div></div><div class=\"ms-auto\"><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-4 text-blue-600\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z\"/></svg></span></div></div>",
              "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
            }'
            >
              <option value="" key="0">
                Select a Profile
              </option>
              {profiles.map((profile) => (
                <option
                  key={profile.id}
                  value={profile.id}
                  data-hs-select-option={`{"icon": "${profile.avatar ? `<img class='shrink-0 size-5 rounded-full' src='${profile.avatar}' />` : `<div class='shrink-0 size-5 rounded-full bg-neutral-200'></div>`}"}`}
                >
                  {profile.first_name} {profile.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-base font-medium dark:text-white"
          >
            Description
          </label>
          <input
            placeholder="Enter a description"
            required
            type="text"
            id="description"
            name="description"
            defaultValue={description || ""}
            className="focus-style block w-full rounded-lg border-gray-200 px-4 py-3 text-base disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-base font-medium dark:text-white"
          >
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              name="amount"
              required
              className="focus-style block w-full rounded-lg border-gray-200 px-4 py-3 pe-16 ps-9 text-base shadow-sm focus:z-10 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:placeholder-neutral-500"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              defaultValue={amount}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4">
              <span className="text-gray-500 dark:text-neutral-500">€</span>
            </div>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-4">
              <span className="text-gray-500 dark:text-neutral-500">EUR</span>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="split"
            className="mb-2 block text-base font-medium dark:text-white"
          >
            Split
          </label>
          <select
            id="split"
            name="split"
            required
            defaultValue={split || 1}
            data-hs-select='{
                "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>",
                "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-base focus-style dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400",
                "dropdownClasses": "mt-2 z-20 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
                "optionClasses": "py-2 px-4 w-full text-base text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
                "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-blue-600 dark:text-blue-500 \" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"shrink-0 size-3.5 text-gray-500 dark:text-neutral-500 \" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
              }'
            className="hidden"
          >
            <option value="1">You paid, split equally</option>
            <option value="2">You are owed the full amount</option>
            <option value="3">Other person paid, split equally</option>
            <option value="4">Other person is owed the full amount</option>
          </select>
        </div>
      </div>
      {children}
    </form>
  );
}
