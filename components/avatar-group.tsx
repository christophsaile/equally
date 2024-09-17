import { ReactNode } from "react";

export default function AvatarGroup({
  children,
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  spacing?: string;
}) {
  return <div className="flex -space-x-2">{children}</div>;
}
