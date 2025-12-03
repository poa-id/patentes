"use client";

import { useMemo, useState } from "react";
import { generateExamplePlate, randomMissingNumber, formatPlateNumber } from "../../../lib/game";
import { Win98Button } from "../../../components/win98/Win98Button";
import { Win98Card } from "../../../components/win98/Win98Card";

interface RandomPlateProps {
  foundNumbers: number[];
}

export function RandomPlate({ foundNumbers }: RandomPlateProps) {
  const missing = useMemo(() => {
    const set = new Set(foundNumbers);
    const result: number[] = [];
    for (let i = 0; i <= 999; i++) if (!set.has(i)) result.push(i);
    return result;
  }, [foundNumbers]);

  const [current, setCurrent] = useState<number | null>(null);
  const example = current !== null ? generateExamplePlate(current) : null;

  const handleGenerate = () => {
    const number = randomMissingNumber(foundNumbers);
    setCurrent(number);
  };

  if (missing.length === 0) {
    return <div className="italic">Sala completada, no quedan números.</div>;
  }

  return (
    <Win98Card title="Generar patente aleatoria" className="space-y-2">
      <Win98Button type="button" onClick={handleGenerate} className="w-full">
        Generar objetivo aleatorio
      </Win98Button>
      {current !== null ? (
        <div className="win98-card p-2 space-y-1">
          <div className="font-bold text-lg">Número: {formatPlateNumber(current)}</div>
          {example ? (
            <>
              <div>Formato viejo: {example.oldFormat}</div>
              <div>Formato nuevo: {example.newFormat}</div>
            </>
          ) : null}
        </div>
      ) : (
        <div className="text-sm">Presiona el botón para elegir un objetivo.</div>
      )}
      <div className="text-xs text-gray-700">Números restantes: {missing.length}</div>
    </Win98Card>
  );
}
