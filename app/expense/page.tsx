import ExpenseForm from "./expense-form";

export default async function Expense({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let type: "add" | "edit" = "add";
  if (searchParams.expense_id) {
    type = "edit";
    console.log("searchParams", searchParams);
    // TODO: fetch expense data
    // pass data to ExpenseForm or client side rendering
  }

  return (
    <div>
      <span>{type} expense</span>
      <ExpenseForm></ExpenseForm>
    </div>
  );
}
