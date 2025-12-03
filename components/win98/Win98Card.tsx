import React from "react";
import clsx from "classnames";

interface Win98CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Win98Card({ title, children, className }: Win98CardProps) {
  return (
    <div className={clsx("win98-card p-3 text-sm", className)}>
      {title ? <div className="font-bold mb-2">{title}</div> : null}
      {children}
    </div>
  );
}
