"use client";

import React, { useState } from 'react';
import { Shield, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { updatePassword } from '../../actions';

export default function PerfilPage() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const confirm = formData.get('confirm') as string;

        if (password !== confirm) {
            setMsg({ type: 'error', text: 'As senhas não coincidem.' });
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setMsg({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' });
            setLoading(false);
            return;
        }

        const result = await updatePassword(password);

        if (result.success) {
            setMsg({ type: 'success', text: 'Senha atualizada com sucesso!' });
            (e.target as HTMLFormElement).reset();
        } else {
            setMsg({ type: 'error', text: result.error || 'Erro ao atualizar senha.' });
        }
        setLoading(false);
    }

    return (
        <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-glow">
                        <Shield className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Segurança</h1>
                        <p className="text-white/40 uppercase text-[10px] font-black tracking-[0.3em] mt-1">Gerenciamento de Credenciais de Acesso</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 lg:p-12 shadow-2xl relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-[0.02] -mr-32 -mt-32 rounded-full blur-3xl group-hover:opacity-[0.05] transition-all duration-700" />

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1 flex items-center gap-2">
                                <Key className="w-3 h-3" /> Nova Senha
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" /> Confirmar Nova Senha
                            </label>
                            <input
                                type="password"
                                name="confirm"
                                required
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {msg && (
                        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
                            msg.type === 'success' 
                            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                            {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <span className="text-sm font-bold">{msg.text}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-secondary hover:bg-[#84cc16] disabled:opacity-50 disabled:cursor-not-allowed text-primary font-black uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        ) : (
                            <>
                                <Shield className="w-5 h-5" />
                                <span>Atualizar Senha de Acesso</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Info Card */}
            <div className="bg-secondary/5 border border-secondary/10 rounded-[2rem] p-6 flex gap-5 items-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                    <AlertCircle className="w-6 h-6 text-secondary" />
                </div>
                <div>
                    <p className="text-white/60 text-xs font-medium leading-relaxed">
                        A alteração da senha é imediata. Após atualizar, você continuará conectado nesta sessão, mas precisará da nova senha para futuros acessos em outros dispositivos.
                    </p>
                </div>
            </div>
        </div>
    );
}
