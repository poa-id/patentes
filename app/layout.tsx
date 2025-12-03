import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patentes Bingo",
  description: "Completa todas las patentes de Argentina"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
