"use client";
import { useState, ComponentProps } from "react";
import { Profile } from "./utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

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
  const [query, setQuery] = useState("");

  const filteredProfiles =
    query === ""
      ? profiles
      : profiles.filter((profile) => {
          const fullName = `${profile.first_name.toLowerCase()} ${profile.last_name.toLowerCase()}`;
          return fullName.includes(query.toLowerCase());
        });

  return (
    <form
      {...props}
      className="mx-auto mt-10 flex max-w-md flex-col gap-4 p-6 text-black"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="profile" className="font-semibold text-gray-700">
          Person
        </label>
        <Combobox
          name="profile"
          value={selectedPerson}
          onChange={setSelectedPerson}
          immediate
        >
          <ComboboxInput
            id="profile"
            aria-label="Person"
            placeholder="Enter a name"
            displayValue={(profile: any) => {
              if (profile === null) {
                return "";
              }
              return `${profile.first_name} ${profile.last_name}`;
            }}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            className="w-full rounded-md border border-gray-300 p-2"
          />
          <ComboboxOptions className="mt-1 max-h-60 overflow-auto rounded-md border border-gray-300 bg-white">
            {filteredProfiles.map((profile) => (
              <ComboboxOption
                key={profile.id}
                value={profile}
                className="cursor-pointer p-2 hover:bg-blue-100"
              >
                {profile.first_name} {profile.last_name}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-semibold text-gray-700">
          Description
        </label>
        <input
          type="text"
          id="description"
          placeholder="Enter a description"
          required
          name="description"
          className="w-full rounded-md border border-gray-300 p-2"
          defaultValue={description}
        ></input>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="font-semibold text-gray-700">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          placeholder="0,00"
          step="0.01"
          required
          name="amount"
          className="w-full rounded-md border border-gray-300 p-2"
          defaultValue={amount}
        ></input>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="split" className="font-semibold text-gray-700">
          Split
        </label>
        <select
          name="split"
          id="split"
          className="w-full rounded-md border border-gray-300 p-2"
          defaultValue={split}
        >
          {/* // TODO: fetch options from database */}
          <option value="1">You paid, split equally</option>
          <option value="2">You are owed the full amount</option>
          <option value="3">
            {selectedPerson?.first_name} paid, split equally
          </option>
          <option value="4">
            {selectedPerson?.first_name} is owed the full amount
          </option>
        </select>
      </div>
      {children}
    </form>
  );
}
