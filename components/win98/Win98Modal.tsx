"use client";

import React from "react";
import { Win98Window } from "./Win98Window";

interface Win98ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export function Win98Modal({ open, title, children, onClose, className }: Win98ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <Win98Window title={title} onClose={onClose} className={className}>
        {children}
      </Win98Window>
    </div>
  );
}
