import { redirect } from "next/navigation";
import { createSession, verifyPassword } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { Win98Window } from "../../../components/win98/Win98Window";
import { LoginForm } from "./LoginForm";

interface ActionState {
  error?: string;
}

async function loginAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  "use server";

  const username = (formData.get("username") as string).trim();
  const password = (formData.get("password") as string).trim();

  if (!username || !password) {
    return { error: "Ingresa tus credenciales." };
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return { error: "Usuario o contraseña inválidos." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Usuario o contraseña inválidos." };
  }

  createSession(user.id);
  redirect("/dashboard");
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Win98Window title="Iniciar sesión" className="w-full max-w-md">
        <LoginForm action={loginAction} />
      </Win98Window>
    </div>
  );
}
