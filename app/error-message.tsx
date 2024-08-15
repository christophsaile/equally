import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

export function ErrorMessage({ children }: Props) {
  return <div className="text-red-600">{children}</div>;
}
