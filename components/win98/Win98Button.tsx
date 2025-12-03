import React from "react";
import clsx from "classnames";

interface Win98ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Win98Button({ children, className, ...props }: Win98ButtonProps) {
  return (
    <button
      className={clsx(
        "win98-button text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
