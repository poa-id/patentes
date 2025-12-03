"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Win98Card } from "../../../components/win98/Win98Card";
import { Win98Input } from "../../../components/win98/Win98Input";
import { Win98Button } from "../../../components/win98/Win98Button";

interface Props {
  action: (state: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
}

export function LoginForm({ action }: Props) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="space-y-3">
      <Win98Card>
        <div className="space-y-2">
          <label className="block text-sm font-bold">Usuario</label>
          <Win98Input name="username" required />
          <label className="block text-sm font-bold">Contraseña</label>
          <Win98Input name="password" type="password" required />
        </div>
      </Win98Card>
      {state?.error ? (
        <div className="win98-card p-2 text-red-700 bg-red-100 border border-red-500">{state.error}</div>
      ) : null}
      <div className="flex items-center justify-between">
        <Link href="/register" className="underline">
          Crear nueva cuenta
        </Link>
        <Win98Button type="submit">Entrar</Win98Button>
      </div>
    </form>
  );
}
