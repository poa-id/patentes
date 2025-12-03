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

  const totalFound = entries.length;
  const remaining = 1000 - totalFound;

  const contribution = useMemo(() => {
    const map = new Map<string, { username: string; count: number }>();
    for (const entry of entries) {
      const key = entry.foundById;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { username: entry.foundBy.username, count: 1 });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => b.count - a.count || a.username.localeCompare(b.username)
    );
  }, [entries]);

  return (
    <div className="space-y-3">
      <Win98Card title="Números encontrados">
        <div className="flex flex-wrap items-center justify-between text-xs mb-2 gap-2">
          <div className="space-x-2">
            <button className="underline" onClick={() => setSortKey("number")}>
              Ordenar por número
            </button>
            <button className="underline" onClick={() => setSortKey("foundAt")}>
              Ordenar por fecha
            </button>
          </div>
          <div className="space-x-3">
            <span>
              Encontrados: <span className="font-bold">{totalFound}</span> / 1000
            </span>
            <span>
              Restantes: <span className="font-bold">{remaining}</span>
            </span>
          </div>
        </div>
        <div className="overflow-x-auto max-h-80 border border-gray-300 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 sticky top-0">
              <tr className="text-left">
                <th className="pr-4 py-1">Número</th>
                <th className="pr-4 py-1">Dirección</th>
                <th className="pr-4 py-1">Encontrado por</th>
                <th className="py-1">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry) => (
                <tr key={entry.id} className="border-t border-gray-200">
                  <td className="py-1 font-mono">{formatPlateNumber(entry.number)}</td>
                  <td className="text-xs">{entry.direction}</td>
                  <td>{entry.foundBy.username}</td>
                  <td className="text-xs">
                    {format(new Date(entry.foundAt), "yyyy-MM-dd HH:mm")}
                  </td>
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

      <Win98Card title="Ranking de contribuidores">
        {contribution.length === 0 ? (
          <div className="text-sm italic">Todavía no hay contribuciones.</div>
        ) : (
          <ol className="list-decimal list-inside text-sm space-y-1">
            {contribution.map((item, index) => (
              <li key={item.username} className="flex justify-between">
                <span>
                  {index + 1}. {item.username}
                </span>
                <span className="font-mono">{item.count} patentes</span>
              </li>
            ))}
          </ol>
        )}
      </Win98Card>
    </div>
  );
}
