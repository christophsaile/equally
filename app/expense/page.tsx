"use client";
import { useState, type Key, useEffect } from "react";
import { addExpense, fetchProfiles, Profile } from "./actions";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

// TODO: add library to prevent re-rendering on every key stroke
// TODO: add feature to select user from database
export default function Expense() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Profile | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchProfiles().then(setProfiles);
  }, []);

  const filteredProfiles =
    query === ""
      ? profiles
      : profiles.filter((profile) => {
          const fullName = `${profile.first_name.toLowerCase()} ${profile.last_name.toLowerCase()}`;
          return fullName.includes(query.toLowerCase());
        });

  console.log(filteredProfiles);

  return (
    <form className="flex flex-col gap-4 p-6 max-w-md mx-auto mt-10 text-black">
      <div className="flex flex-col gap-2">
        <label htmlFor="profile" className="text-gray-700 font-semibold">
          Person
        </label>
        <Combobox
          name="profile"
          value={selectedPerson}
          onChange={setSelectedPerson}
          immediate
        >
          {/* TODO: add feature to select multiple users */}
          <ComboboxInput
            id="profile"
            aria-label="Person"
            placeholder="Enter a name"
            displayValue={(profile) => {
              if (profile === null) {
                return "";
              }
              return `${profile.first_name} ${profile.last_name}`;
            }}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <ComboboxOptions className="border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto bg-white">
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
        <label htmlFor="description" className="text-gray-700 font-semibold">
          Description
        </label>
        <input
          type="text"
          id="description"
          placeholder="Enter a description"
          required
          name="description"
          className="w-full p-2 border border-gray-300 rounded-md"
        ></input>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-gray-700 font-semibold">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          placeholder="0,00"
          step="0.01"
          required
          name="amount"
          className="w-full p-2 border border-gray-300 rounded-md"
        ></input>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="split" className="text-gray-700 font-semibold">
          Split
        </label>
        <select
          name="split"
          id="split"
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="equally">You paid, split equally</option>
          <option value="full">You are owed the full amount</option>
          <option value="owed-equally">
            {selectedPerson?.first_name} paid, split equally
          </option>
          <option value="owed-full">
            {selectedPerson?.first_name} is owed the full amount
          </option>
        </select>
      </div>
      <button
        className="w-full p-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        formAction={addExpense}
      >
        Add expense
      </button>
    </form>
  );
}
