import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

// TODO: check out global-error and error.tsx in nextjs
export function ErrorMessage({ children }: Props) {
  return <div className="text-red-600">{children}</div>;
}
