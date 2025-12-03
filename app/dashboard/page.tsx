import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { getCurrentUser } from "../../lib/auth";
import { Win98Window } from "../../components/win98/Win98Window";
import { Win98Card } from "../../components/win98/Win98Card";
import { Win98Input } from "../../components/win98/Win98Input";
import { Win98Button } from "../../components/win98/Win98Button";
import { Win98Progress } from "../../components/win98/Win98Progress";
import { RoomMode } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function createRoomAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string).trim();
  const mode = (formData.get("mode") as RoomMode) || "DUAL";

  if (!name) return;

  const room = await prisma.room.create({
    data: { name, mode, hostId: user.id }
  });

  await prisma.roomMember.create({
    data: { roomId: room.id, userId: user.id, role: "HOST" }
  });

  revalidatePath("/dashboard");
  redirect(`/rooms/${room.id}`);
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const memberships = await prisma.roomMember.findMany({
    where: { userId: user.id },
    include: {
      room: {
        include: {
          entries: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <Win98Window title={`Bienvenido, ${user.username}`} className="w-full max-w-5xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Win98Card className="md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Salas</h2>
              <Link href="/logout" className="underline">
                Cerrar sesión
              </Link>
            </div>
            <div className="space-y-3">
              {memberships.map((member) => {
                const found = member.room.entries.length;
                const pct = Math.round((found / 1000) * 100);
                return (
                  <div key={member.id} className="win98-card p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-lg">{member.room.name}</div>
                        <div className="text-xs text-gray-700">Modo: {member.room.mode}</div>
                      </div>
                      <Link href={`/rooms/${member.roomId}`} className="underline">
                        Entrar
                      </Link>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs mb-1">Progreso: {found} / 1000 ({pct}%)</div>
                      <Win98Progress value={pct} />
                    </div>
                    <div className="text-xs mt-2 break-all">
                      Invitación: /rooms/{member.roomId}?join=1
                    </div>
                  </div>
                );
              })}
              {memberships.length === 0 ? <div className="italic">Aún no perteneces a ninguna sala.</div> : null}
            </div>
          </Win98Card>
          <Win98Card title="Crear nueva sala">
            <form action={createRoomAction} className="space-y-2">
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
              <Win98Button type="submit" className="w-full">
                Crear sala
              </Win98Button>
            </form>
          </Win98Card>
        </div>
      </Win98Window>
    </div>
  );
}
