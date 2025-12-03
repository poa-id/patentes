"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Win98Window } from "../../components/win98/Win98Window";
import { Win98Card } from "../../components/win98/Win98Card";
import { Win98Input } from "../../components/win98/Win98Input";
import { Win98Button } from "../../components/win98/Win98Button";
import { Win98Progress } from "../../components/win98/Win98Progress";
import { Win98Modal } from "../../components/win98/Win98Modal";

interface DashboardClientProps {
  userName: string;
  memberships: any[];
  createRoomAction: (formData: FormData) => void;
  joinByCodeAction: (formData: FormData) => void;
  deleteRoomAction: (roomId: string) => void;
}

export function DashboardClient({
  userName,
  memberships,
  createRoomAction,
  joinByCodeAction,
  deleteRoomAction,
}: DashboardClientProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <Win98Window title={`Bienvenido, ${userName}`} className="w-full max-w-5xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Win98Card className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Salas</h2>
              <Link href="/logout" className="underline">
                Cerrar sesión
              </Link>
            </div>
            <div className="space-y-3">
              {memberships.map((member: any) => {
                const found = member.room.entries.length;
                const pct = Math.round((found / 1000) * 100);
                const isHost = member.role === "HOST";
                return (
                  <div key={member.id} className="win98-card p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold text-lg flex items-center gap-2">
                          {member.room.name}
                          {isHost ? (
                            <span className="text-[10px] px-1 py-[1px] border border-gray-500 bg-gray-200">
                              Host
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs text-gray-700">Modo: {member.room.mode}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Link href={`/rooms/${member.roomId}`} className="underline text-sm">
                          Entrar
                        </Link>
                        {isHost ? (
                          <form action={deleteRoomAction.bind(null, member.roomId)}>
                            <button
                              type="submit"
                              className="text-[10px] px-2 py-[2px] border border-gray-600 bg-red-600 text-white hover:bg-red-700"
                            >
                              Eliminar sala
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm">
                        Progreso: {found} / 1000 ({pct}%)
                      </div>
                      <Win98Progress value={pct} />
                    </div>
                    <div className="mt-2 text-sm break-all">
                      Código de invitación:{" "}
                      <span className="font-mono">{member.room.inviteCode}</span>
                    </div>
                  </div>
                );
              })}
              {memberships.length === 0 ? (
                <div className="italic">Aún no perteneces a ninguna sala.</div>
              ) : null}
            </div>
          </Win98Card>

          <Win98Card title="Acciones">
            <div className="space-y-2">
              <Win98Button type="button" className="w-full" onClick={() => setShowCreate(true)}>
                Crear nueva sala
              </Win98Button>
              <Win98Button type="button" className="w-full" onClick={() => setShowJoin(true)}>
                Unirse con código
              </Win98Button>
            </div>
          </Win98Card>
        </div>
      </Win98Window>

      <Win98Modal open={showCreate} onClose={() => setShowCreate(false)} title="Crear nueva sala">
        <form action={createRoomAction} className="space-y-2 min-w-[260px]">
          <div>
            <label className="block text-sm font-bold">Nombre</label>
            <Win98Input name="name" required />
          </div>
          <div>
            <label className="block text-sm font-bold">Modo</label>
            <select name="mode" className="win98-input w-full">
              <option value="DUAL">Dual</option>
              <option value="RANDOM">Aleatorio</option>
              <option value="ASC_ONLY">Solo Ascendente</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Win98Button type="button" onClick={() => setShowCreate(false)}>
              Cancelar
            </Win98Button>
            <Win98Button type="submit">Crear sala</Win98Button>
          </div>
        </form>
      </Win98Modal>

      <Win98Modal open={showJoin} onClose={() => setShowJoin(false)} title="Unirse con código">
        <form action={joinByCodeAction} className="space-y-2 min-w-[260px]">
          <div>
            <label className="block text-sm font-bold">Código de sala</label>
            <Win98Input
              name="code"
              placeholder="Ej: ABC123"
              className="uppercase"
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Win98Button type="button" onClick={() => setShowJoin(false)}>
              Cancelar
            </Win98Button>
            <Win98Button type="submit">Unirse</Win98Button>
          </div>
        </form>
      </Win98Modal>
    </div>
  );
}
