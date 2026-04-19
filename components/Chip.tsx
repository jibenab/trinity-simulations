import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  active?: boolean;
};

export function Chip({ active, className, ...props }: ChipProps) {
  return (
    <span
      className={cn("chip", active && "active", className)}
      {...props}
    />
  );
}

type ChipButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function ChipButton({
  active,
  className,
  ...props
}: ChipButtonProps) {
  return (
    <button
      className={cn("chip", active && "active", className)}
      {...props}
    />
  );
}
