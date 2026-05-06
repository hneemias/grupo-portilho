"use client";

import React, { useState } from 'react';
import { X, UserPlus, Shield, Mail, Key, ShieldCheck } from 'lucide-react';

import { AdminUser, UserFormData } from '@/app/admin/(dashboard)/usuarios/page';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: UserFormData) => Promise<void>;
    user?: AdminUser | null;
}

export default function UserModal({
    isOpen,
    onClose,
    onSave,
    user
}: UserModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'super' | 'normal'>('normal');
    const [loading, setLoading] = useState(false);

    // Sincronizar estado com o usuário selecionado sem causar cascading renders
    const [prevUser, setPrevUser] = useState<AdminUser | null | undefined>(undefined);
    if (user !== prevUser) {
        setEmail(user?.email || '');
        setPassword('');
        setRole(user?.role || 'normal');
        setPrevUser(user);
    }

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ email, password, role });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#020b1a]/90 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-[#031428] border border-white/5 w-full max-w-xl rounded-[2.5rem] p-12 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
                <button 
                    onClick={onClose}
                    className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-glow">
                            <UserPlus className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tight">
                            {user ? 'Editar Operador' : 'Novo Operador'}
                        </h3>
                    </div>
                    <p className="text-white/40 uppercase text-[10px] font-black tracking-[0.3em]">Configuração de Credenciais e Nível de Acesso</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Mail className="w-3 h-3" />
                                E-mail Institucional
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/10 text-sm font-bold"
                                placeholder="exemplo@portilho.com"
                                disabled={!!user}
                            />
                        </div>

                        {!user && (
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <Key className="w-3 h-3" />
                                    Senha Provisória
                                </label>
                                <input
                                    type="password"
                                    required={!user}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/10 text-sm font-bold font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 px-1">
                            <Shield className="w-3 h-3" />
                            Nível de Autorização
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {(['normal', 'super'] as const).map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`flex flex-col items-start p-6 rounded-3xl border transition-all text-left group ${
                                        role === r 
                                        ? 'bg-secondary/5 border-secondary/30 ring-1 ring-secondary/20' 
                                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all ${
                                        role === r ? 'bg-secondary text-primary' : 'bg-white/5 text-white/20 group-hover:text-white/40'
                                    }`}>
                                        {r === 'super' ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${role === r ? 'text-secondary' : 'text-white/20'}`}>
                                        {r === 'super' ? 'Diretoria' : 'Operador'}
                                    </span>
                                    <span className="text-[11px] font-medium text-white/40 leading-relaxed">
                                        {r === 'super' ? 'Acesso total ao sistema e gestão de usuários.' : 'Acesso limitado a operações de rotina.'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-secondary hover:bg-[#84cc16] text-primary font-black uppercase tracking-[0.2em] text-[11px] py-5 rounded-[1.5rem] transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    <span>{user ? 'Salvar Alterações' : 'Confirmar Cadastro'}</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black uppercase tracking-[0.2em] text-[11px] py-5 rounded-[1.5rem] transition-all border border-white/5"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
