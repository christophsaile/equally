import ExpenseForm from "./expense-form";

export default async function Expense({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (searchParams.expense_id) {
    console.log("searchParams", searchParams);
    // TODO: fetch expense data
    // pass data to ExpenseForm or client side rendering
  }
  return <ExpenseForm></ExpenseForm>;
}
