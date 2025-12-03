import Link from "next/link";
import type { Direction } from "../../../lib/game";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { allowedDirections, calculateNextTargets, formatPlateNumber } from "../../../lib/game";
import { getCurrentUser } from "../../../lib/auth";
import { Win98Window } from "../../../components/win98/Win98Window";
import { Win98Card } from "../../../components/win98/Win98Card";
import { Win98Button } from "../../../components/win98/Win98Button";
import { Win98Input } from "../../../components/win98/Win98Input";
import { Win98Progress } from "../../../components/win98/Win98Progress";
import { RandomPlate } from "./RandomPlate";
import { FoundTable, DisplayEntry } from "./FoundTable";

interface Props {
  params: { roomId: string };
  searchParams: { join?: string; error?: string };
}

async function registerPlateAction(roomId: string, formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) notFound();

  const number = Number(formData.get("number"));
  const direction = (formData.get("direction") as Direction) || "NONE";

  if (Number.isNaN(number) || number < 0 || number > 999) {
    redirect(`/rooms/${roomId}?error=invalid`);
  }

  if (!allowedDirections(room.mode).includes(direction)) {
    redirect(`/rooms/${roomId}?error=direction`);
  }

  const existing = await prisma.plateEntry.findFirst({ where: { roomId, number } });
  if (existing) {
    redirect(`/rooms/${roomId}?error=duplicate`);
  }

  await prisma.plateEntry.create({
    data: {
      roomId,
      number,
      direction,
      foundById: user.id
    }
  });

  revalidatePath(`/rooms/${roomId}`);
}

async function ensureMembership(roomId: string, userId: string) {
  const membership = await prisma.roomMember.findFirst({ where: { roomId, userId } });
  if (membership) return membership;
  return prisma.roomMember.create({
    data: { roomId, userId, role: "PLAYER" }
  });
}

export default async function RoomPage({ params, searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const room = await prisma.room.findUnique({
    where: { id: params.roomId },
    include: {
      host: true,
      members: { include: { user: true } },
      entries: { include: { foundBy: true }, orderBy: { foundAt: "desc" } }
    }
  });

  if (!room) notFound();

  const isMember = room.members.some((m) => m.userId === user.id);
  if (!isMember && searchParams.join === "1") {
    await ensureMembership(params.roomId, user.id);
  } else if (!isMember && searchParams.join !== "1") {
    redirect(`/dashboard`);
  }

  const foundNumbers = room.entries.map((entry) => entry.number);
  const { nextAsc, nextDesc } = calculateNextTargets(foundNumbers);
  const progressPct = Math.round((foundNumbers.length / 1000) * 100);
  const allowed = allowedDirections(room.mode);

  const membershipList = room.members
    .map((m) => `${m.user.username}${m.role === "HOST" ? " (Host)" : ""}`)
    .join(", ");

  const nextTargets = (
    <Win98Card title="Próximos objetivos" className="space-y-1">
      {room.mode === "RANDOM" ? (
        <div>Modo aleatorio activo. Genera un número al azar.</div>
      ) : (
        <>
          <div>
            Ascendente: {nextAsc !== null ? formatPlateNumber(nextAsc) : "Completado"}
          </div>
          {room.mode === "DUAL" ? (
            <div>
              Descendente: {nextDesc !== null ? formatPlateNumber(nextDesc) : "Completado"}
            </div>
          ) : null}
        </>
      )}
    </Win98Card>
  );

  const errorMessage =
    searchParams.error === "invalid"
      ? "El número debe estar entre 000 y 999."
      : searchParams.error === "direction"
      ? "Esa dirección no está permitida para el modo de esta sala."
      : searchParams.error === "duplicate"
      ? "El número ya fue encontrado en esta sala."
      : null;

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <Win98Window title={`Sala: ${room.name}`} className="w-full max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-800">
            Estás en la sala <span className="font-bold">{room.name}</span>
          </div>
          <Link href="/dashboard" className="underline">
            Volver al lobby
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Win98Card className="lg:col-span-2 space-y-2" title="Información de la sala">
            <div>Modo: {room.mode}</div>
            <div>Anfitrión: {room.host.username}</div>
            <div>Jugadores: {membershipList}</div>
            {room.inviteCode ? (
              <div className="text-xs mt-1">
                Código de invitación: <span className="font-mono">{room.inviteCode}</span>
              </div>
            ) : null}
            <div className="mt-2">
              <div className="text-xs mb-1">Progreso: {foundNumbers.length} / 1000 ({progressPct}%)</div>
              <Win98Progress value={progressPct} />
            </div>
            {nextTargets}
          </Win98Card>
          <div className="space-y-3">
            {room.mode === "RANDOM" ? <RandomPlate foundNumbers={foundNumbers} /> : null}
            <Win98Card title="Registrar patente">
              <form action={registerPlateAction.bind(null, room.id)} className="space-y-2">
                {errorMessage ? (
                  <div className="text-xs bg-red-600 text-white px-2 py-1 win98-border">
                    {errorMessage}
                  </div>
                ) : null}
                <div>
                  <label className="block text-sm font-bold">Número (000-999)</label>
                  <Win98Input name="number" type="number" min={0} max={999} required />
                </div>
                <div>
                  <label className="block text-sm font-bold">Dirección</label>
                  <select name="direction" className="win98-input w-full">
                    {allowed.map((dir) => (
                      <option key={dir} value={dir}>
                        {dir}
                      </option>
                    ))}
                  </select>
                </div>
                <Win98Button type="submit" className="w-full">
                  Guardar
                </Win98Button>
              </form>
            </Win98Card>
          </div>
        </div>
        <FoundTable entries={room.entries as DisplayEntry[]} />
      </Win98Window>
    </div>
  );
}
