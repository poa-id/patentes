import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { getCurrentUser } from "../../lib/auth";
import { revalidatePath } from "next/cache";
import { DashboardClient } from "./DashboardClient";

async function createRoomAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string).trim();
  const mode = (formData.get("mode") as string) || "DUAL";

  if (!name) return;

  const inviteCode = Math.random().toString(36).slice(2, 8).toUpperCase();

  const room = await prisma.room.create({
    data: { name, mode, hostId: user.id, inviteCode }
  });

  await prisma.roomMember.create({
    data: { roomId: room.id, userId: user.id, role: "HOST" }
  });

  revalidatePath("/dashboard");
  redirect(`/rooms/${room.id}`);
}

async function joinByCodeAction(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const rawCode = (formData.get("code") as string) || "";
  const code = rawCode.trim().toUpperCase();
  if (!code) return;

  const room = await prisma.room.findFirst({ where: { inviteCode: code } });
  if (!room) {
    return;
  }

  await prisma.roomMember.upsert({
    where: { roomId_userId: { roomId: room.id, userId: user.id } },
    create: { roomId: room.id, userId: user.id, role: "PLAYER" },
    update: {}
  });

  revalidatePath("/dashboard");
  redirect(`/rooms/${room.id}`);
}

async function deleteRoomAction(roomId: string) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) return;

  if (room.hostId !== user.id) {
    return;
  }

  await prisma.room.delete({ where: { id: roomId } });
  revalidatePath("/dashboard");
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
    <DashboardClient
      userName={user.username}
      memberships={memberships}
      createRoomAction={createRoomAction}
      joinByCodeAction={joinByCodeAction}
      deleteRoomAction={deleteRoomAction}
    />
  );
}
