import React from "react";
import clsx from "classnames";

interface Win98InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Win98Input({ className, ...props }: Win98InputProps) {
  return <input className={clsx("win98-input w-full", className)} {...props} />;
}
