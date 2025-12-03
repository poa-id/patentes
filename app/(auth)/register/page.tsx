import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, hashPassword } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { Win98Window } from "../../../components/win98/Win98Window";
import { RegisterForm } from "./RegisterForm";

interface ActionState {
  error?: string;
}

async function registerAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  "use server";

  const username = (formData.get("username") as string).trim();
  const password = (formData.get("password") as string).trim();
  const confirm = (formData.get("confirm") as string).trim();

  if (!username || !password) {
    return { error: "Usuario y contraseña son requeridos." };
  }
  if (password !== confirm) {
    return { error: "Las contraseñas no coinciden." };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "El usuario ya existe." };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { username, passwordHash } });
  createSession(user.id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Win98Window title="Crear cuenta" className="w-full max-w-md">
        <RegisterForm action={registerAction} />
      </Win98Window>
    </div>
  );
}
