"use client";

import React, { useEffect, useState } from 'react';
import { 
    Users, 
    UserPlus, 
    Search, 
    MoreHorizontal, 
    Eye, 
    Pencil, 
    Trash2, 
    ShieldCheck, 
    ShieldAlert,
    Ban,
    CheckCircle2,
    FilterX
} from 'lucide-react';
import { getAdminUsers, toggleUserStatus, deleteUser } from '../../actions';

interface AdminUser {
    id: string;
    email: string;
    role: 'super' | 'normal';
    status: 'ativo' | 'bloqueado';
    created_at: string;
}

export default function UsuariosPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'bloqueado'>('todos');

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        try {
            const data = await getAdminUsers();
            setUsers(data as any);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleStatus(user: AdminUser) {
        const result = await toggleUserStatus(user.id, user.status);
        if (result.success) {
            loadUsers();
        }
    }

    async function handleDeleteUser(userId: string) {
        if (!confirm('Tem certeza que deseja remover este operador?')) return;
        
        const result = await deleteUser(userId);
        if (result.success) {
            loadUsers();
        }
    }

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'todos' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* HEADER PRO MAX */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Operadores</h1>
                    <p className="text-white/40 uppercase text-[10px] font-black tracking-[0.3em] mt-1">Gestão de Acesso e Hierarquia de Comando</p>
                </div>
                <button className="bg-secondary hover:bg-[#84cc16] text-primary font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-3">
                    <UserPlus className="w-5 h-5" />
                    <span>Novo Operador</span>
                </button>
            </div>

            {/* FILTROS SEGMENTED CONTROLS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-[2rem]">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                        type="text" 
                        placeholder="Buscar por e-mail..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/10"
                    />
                </div>

                <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/5">
                    {(['todos', 'ativo', 'bloqueado'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                statusFilter === status 
                                ? 'bg-secondary text-primary shadow-lg' 
                                : 'text-white/40 hover:text-white/60'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABELA PREMIUM */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-10 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Operador</th>
                            <th className="px-10 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Nível</th>
                            <th className="px-10 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-10 py-8">
                                        <div className="h-4 bg-white/5 rounded-full w-48" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors relative">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-secondary/20 transition-all">
                                                <span className="text-white/40 group-hover:text-secondary font-black text-xs font-mono">
                                                    {user.email.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors tracking-tight">
                                                    {user.email}
                                                </span>
                                                <span className="text-[9px] text-white/20 uppercase font-black tracking-widest mt-0.5">
                                                    Desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2">
                                            {user.role === 'super' ? (
                                                <ShieldCheck className="w-4 h-4 text-secondary" />
                                            ) : (
                                                <Users className="w-4 h-4 text-white/20" />
                                            )}
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'super' ? 'text-secondary' : 'text-white/40'}`}>
                                                {user.role === 'super' ? 'Diretoria' : 'Operador'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                                            user.status === 'ativo' 
                                            ? 'bg-green-500/5 border-green-500/10 text-green-400' 
                                            : 'bg-red-500/5 border-red-500/10 text-red-400'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ativo' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                                            {user.status}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-white/40 hover:text-white transition-all shadow-lg" title="Visualizar Detalhes">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(user)}
                                                className={`p-3 rounded-xl border transition-all shadow-lg ${
                                                    user.status === 'ativo'
                                                    ? 'bg-red-500/5 border-red-500/10 text-red-400/50 hover:text-red-400 hover:bg-red-500/20'
                                                    : 'bg-green-500/5 border-green-500/10 text-green-400/50 hover:text-green-400 hover:bg-green-500/20'
                                                }`} 
                                                title={user.status === 'ativo' ? "Bloquear Operador" : "Ativar Operador"}
                                            >
                                                {user.status === 'ativo' ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl border border-white/5 text-white/40 hover:text-red-400 transition-all shadow-lg" 
                                                title="Remover Operador"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-10 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 mb-2">
                                            <FilterX className="w-8 h-8 text-white/10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white/40 tracking-tight">Nenhum operador encontrado</h3>
                                        <button 
                                            onClick={() => { setSearchTerm(''); setStatusFilter('todos'); }}
                                            className="text-secondary font-black text-[10px] uppercase tracking-[0.2em] hover:underline"
                                        >
                                            Limpar todos os filtros
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* RODAPÉ DE INFRAESTRUTURA */}
            <div className="bg-secondary/5 border border-secondary/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex gap-6 items-center">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-glow">
                        <ShieldCheck className="w-7 h-7 text-secondary" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-lg leading-none">Segurança de Camada 7</h4>
                        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-2">Protocolos de auditoria ativos em tempo real</p>
                    </div>
                </div>
                <div className="text-center md:text-right">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] block mb-2">Capacidade do Sistema</span>
                    <div className="flex gap-1">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className={`h-1.5 w-6 rounded-full ${i < 4 ? 'bg-secondary' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
