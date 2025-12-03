import React from "react";
import clsx from "classnames";

interface Win98WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Retro styled container that mimics a Windows 98 dialog window.
 */
export function Win98Window({ title, children, className }: Win98WindowProps) {
  return (
    <div className={clsx("win98-window text-sm", className)}>
      <div className="flex items-center justify-between px-2 py-1 bg-blue-800 text-white font-bold">
        <span>{title}</span>
        <div className="flex space-x-1">
          <span className="w-3 h-3 bg-gray-200 border border-gray-800" />
          <span className="w-3 h-3 bg-gray-200 border border-gray-800" />
        </div>
      </div>
      <div className="p-3 space-y-3">{children}</div>
    </div>
  );
}
