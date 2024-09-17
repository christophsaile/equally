import { euroFormatter } from "@/app/expense/utils";

type Props = {
  amount: number;
  name: string;
};

export default function HomeGreetings({ amount, name }: Props) {
  const isAmountNegative = amount < 0;

  return (
    <p className="text-2xl leading-relaxed text-gray-600 dark:text-neutral-400">
      <span className="font-semibold text-gray-800 dark:text-white">
        Hey {name} 👋
      </span>
      <br />
      {isAmountNegative ? (
        <span>
          Overall, you owe{" "}
          <span className="font-semibold text-red-500">
            {euroFormatter(amount)}
          </span>{" "}
          to your friends.
        </span>
      ) : (
        <span>
          Overall, you are owed{" "}
          <span className="font-semibold text-teal-500">
            {euroFormatter(amount)}
          </span>{" "}
          from your friends.
        </span>
      )}
    </p>
  );
}
