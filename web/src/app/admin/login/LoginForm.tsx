"use client";

import { useFormStatus } from "react-dom";
import { login } from "../actions";
import { Loader2, ShieldCheck } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`relative w-full bg-secondary text-primary text-lg font-bold uppercase tracking-widest rounded-xl px-4 py-4 mt-6 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 active:scale-95 ${
        pending ? "opacity-70 cursor-not-allowed scale-95" : "hover:scale-[1.02] hover:shadow-secondary/20"
      }`}
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Verificando...</span>
        </>
      ) : (
        <>
          <ShieldCheck className="w-5 h-5" />
          <span>Autenticar Sessão</span>
        </>
      )}
    </button>
  );
}

export default function LoginForm({ error }: { error?: string }) {
  return (
    <form action={login} className="animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col w-full gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-white/60 font-bold" htmlFor="email">
          E-mail Institucional
        </label>
        <input
          className="rounded-xl px-5 py-4 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-secondary transition-all placeholder:text-white/10 text-base"
          name="email"
          type="email"
          placeholder="exemplo@grupoportilho.com.br"
          required
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-white/60 font-bold" htmlFor="password">
          Senha de Acesso
        </label>
        <input
          className="rounded-xl px-5 py-4 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-secondary transition-all placeholder:text-white/10 text-base"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      <SubmitButton />

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 text-red-400 text-xs font-bold text-center border border-red-500/20 rounded-xl animate-fade-in">
          {error === 'blocked' 
            ? 'Acesso Bloqueado: Operador sem permissão ativa.' 
            : 'Erro: Credenciais inválidas ou sem autorização.'}
        </div>
      )}
    </form>
  );
}
