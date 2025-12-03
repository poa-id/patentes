"use client";

import { useMemo, useState } from "react";
import { PlateEntry, User } from "@prisma/client";
import { format } from "date-fns";
import { formatPlateNumber } from "../../../lib/game";
import { Win98Card } from "../../../components/win98/Win98Card";

export interface DisplayEntry extends PlateEntry {
  foundBy: User;
}

type SortKey = "number" | "foundAt";

export function FoundTable({ entries }: { entries: DisplayEntry[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("foundAt");

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => {
      if (sortKey === "number") return a.number - b.number;
      return new Date(b.foundAt).getTime() - new Date(a.foundAt).getTime();
    });
  }, [entries, sortKey]);

  return (
    <Win98Card title="Números encontrados">
      <div className="flex space-x-2 text-xs mb-2">
        <button className="underline" onClick={() => setSortKey("number")}>Ordenar por número</button>
        <button className="underline" onClick={() => setSortKey("foundAt")}>Ordenar por fecha</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="pr-4">Número</th>
              <th className="pr-4">Dirección</th>
              <th className="pr-4">Encontrado por</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-300">
                <td className="py-1">{formatPlateNumber(entry.number)}</td>
                <td>{entry.direction}</td>
                <td>{entry.foundBy.username}</td>
                <td>{format(new Date(entry.foundAt), "yyyy-MM-dd HH:mm")}</td>
              </tr>
            ))}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-2 italic">
                  Aún no se registraron números.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Win98Card>
  );
}
