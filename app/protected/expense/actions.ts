"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { object, string, number } from "yup";

export type Profile = {
  id: number;
  first_name: string;
  last_name: string;
};

type Split = "equally" | "full" | "owed-equally" | "owed-full";

type ValidateFormData = {
  profile_id: string;
  description: string;
  amount: number;
  split: Split;
};

const expenseSchema = object({
  profile_id: string().required(),
  description: string().required(),
  amount: number().positive().required(),
  split: string()
    .oneOf(["equally", "full", "owed-equally", "owed-full"])
    .required(),
});

function determineWhoPaid(
  validatedData: ValidateFormData,
  userId: string,
): { paid: string; owed: string } {
  if (["equally", "full"].includes(validatedData.split)) {
    return {
      paid: userId,
      owed: validatedData.profile_id,
    };
  }
  return {
    paid: validatedData.profile_id,
    owed: userId,
  };
}

function determineAmount(validatedData: ValidateFormData): {
  equal: number;
  full: number;
} {
  return {
    equal: Math.round((validatedData.amount / 2) * 100) / 100,
    full: validatedData.amount,
  };
}

async function validateFormData(formData: FormData): Promise<ValidateFormData> {
  const validatedData = await expenseSchema.validate({
    profile_id: formData.get("profile[id]"),
    description: formData.get("description"),
    amount: Number(formData.get("amount")),
    split: formData.get("split"),
  });

  return validatedData;
}

export async function addExpense(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  let validatedData;

  try {
    // validate the form data
    validatedData = await validateFormData(formData);
  } catch (error) {
    console.error("Validation or user retrieval failed:", error);
    throw new Error("Invalid expense data");
  }

  const determineWhoPaidResult = determineWhoPaid(validatedData, user.id);
  const determineAmountResult = determineAmount(validatedData);

  // insert the expense into the database
  const { data: expensesInsertData } = await supabase
    .from("expenses")
    .insert([
      {
        description: validatedData.description,
        paid_by: determineWhoPaidResult.paid,
        amount: validatedData.amount,
      },
    ])
    .select();

  // insert the expense split into the database based on the split type
  if (
    validatedData.split === "owed-equally" ||
    validatedData.split === "equally"
  ) {
    const { error } = await supabase.from("expense_splits").insert([
      {
        expense_id: expensesInsertData[0].expense_id,
        user_id: determineWhoPaidResult.paid,
        amount: determineAmountResult.equal,
      },
      {
        expense_id: expensesInsertData[0].expense_id,
        user_id: determineWhoPaidResult.owed,
        amount: determineAmountResult.equal,
      },
    ]);
    console.log(error);

    // update the balances table
    await supabase
      .from("balances")
      .upsert([
        {
          user_id: determineWhoPaidResult.owed,
          owed_to: determineWhoPaidResult.paid,
          amount: determineAmountResult.equal,
        },
      ])
      .eq("user_id", determineWhoPaidResult.owed)
      .eq("owed_to", determineWhoPaidResult.paid);
  }

  // insert the expense split into the database based on the split type
  if (validatedData.split === "owed-full" || validatedData.split === "full") {
    const { error } = await supabase.from("expense_splits").insert([
      {
        expense_id: expensesInsertData[0].expense_id,
        user_id: determineWhoPaidResult.paid,
        amount: determineAmountResult.full,
      },
      {
        expense_id: expensesInsertData[0].expense_id,
        user_id: determineWhoPaidResult.owed,
        amount: 0,
      },
    ]);
    console.log(error);

    // update the balances table
    await supabase
      .from("balances")
      .update([
        {
          user_id: determineWhoPaidResult.owed,
          owed_to: determineWhoPaidResult.paid,
          amount: determineAmountResult.full,
        },
      ])
      .eq("user_id", determineWhoPaidResult.owed)
      .eq("owed_to", determineWhoPaidResult.paid);
  }

  revalidatePath("/protected/overview");
  redirect("/protected/overview");
}

export async function fetchProfiles(): Promise<Profile[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .neq("id", user?.id);

  return data;
}
