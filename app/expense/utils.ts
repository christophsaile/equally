import { object, string, number } from "yup";

export type Profile = {
  id: number;
  first_name: string;
  last_name: string;
};

type ValidateExpenseFormData = {
  profile_id: string;
  description: string;
  amount: number;
  split: number;
  expense_id?: number;
};

const expenseSchema = object({
  profile_id: string().required(),
  description: string().required(),
  amount: number().positive().required(),
  split: number().positive().required(),
  expense_id: number().optional(),
});

export function determineWhoPaid(
  validatedData: ValidateExpenseFormData,
  userId: string,
): { paid: string; owed: string } {
  if ([1, 2].includes(validatedData.split)) {
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

export function determineAmount(validatedData: ValidateExpenseFormData): {
  equal: number;
  full: number;
} {
  return {
    equal: Math.round((validatedData.amount / 2) * 100) / 100,
    full: validatedData.amount,
  };
}

export function determineSplittedAmount(amount: number, split: number) {
  return split === 1 || split === 3 ? amount / 2 : amount;
}

export async function validateExpenseFormData(
  formData: FormData,
): Promise<ValidateExpenseFormData> {
  const validatedData = await expenseSchema.validate({
    profile_id: formData.get("profile[id]"),
    description: formData.get("description"),
    amount: Number(formData.get("amount")),
    split: Number(formData.get("split")),
    expense_id: Number(formData.get("expense_id")),
  });

  return validatedData;
}

export function euroFormatter(amount: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
