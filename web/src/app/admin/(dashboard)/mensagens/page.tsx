'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Trash2, Mail, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import ModalConfirm from '../../components/ModalConfirm';

export default function AdminMensagens() {
    const [mensagens, setMensagens] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [modal, setModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const supabase = createClient();

    useEffect(() => {
        fetchMensagens();
    }, []);

    async function fetchMensagens() {
        setLoading(true);
        const { data } = await supabase.from('gp_mensagens').select('*').order('created_at', { ascending: false });
        if (data) setMensagens(data);
        setLoading(false);
    }

    async function toggleLida(id: string, currentLida: boolean) {
        const { error } = await supabase.from('gp_mensagens').update({ lida: !currentLida }).eq('id', id);
        if (!error) {
            setMensagens(mensagens.map(m => m.id === id ? { ...m, lida: !currentLida } : m));
            setToastMsg(currentLida ? 'Marcada como não lida' : 'Marcada como lida');
            setTimeout(() => setToastMsg(null), 2000);
        }
    }

    async function confirmDelete(id: string) {
        setModal({ isOpen: true, id });
    }

    async function deleteMensagem() {
        if (!modal.id) return;
        
        const { error } = await supabase.from('gp_mensagens').delete().eq('id', modal.id);
        if (!error) {
            setMensagens(mensagens.filter(m => m.id !== modal.id));
            setToastMsg('Mensagem excluída permanentemente');
            setTimeout(() => setToastMsg(null), 3000);
        }
        setModal({ isOpen: false, id: null });
    }

    const [filtro, setFiltro] = useState<'todas' | 'novas' | 'lidas'>('todas');
    const [busca, setBusca] = useState('');

    const mensagensFiltradas = mensagens.filter(m => {
        const matchesSearch = m.nome.toLowerCase().includes(busca.toLowerCase()) || 
                             m.email.toLowerCase().includes(busca.toLowerCase()) || 
                             m.mensagem.toLowerCase().includes(busca.toLowerCase());
        
        if (filtro === 'novas') return !m.lida && matchesSearch;
        if (filtro === 'lidas') return m.lida && matchesSearch;
        return matchesSearch;
    });

    return (
        <div className="animate-fade-in pb-20">
            <ModalConfirm 
                isOpen={modal.isOpen}
                title="Excluir Lead?"
                message="Esta mensagem será removida permanentemente do banco de dados. Deseja continuar?"
                onConfirm={deleteMensagem}
                onCancel={() => setModal({ isOpen: false, id: null })}
            />
            {/* HEADER PRO MAX */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                <div>
                    <Link 
                        href="/admin" 
                        className="inline-flex items-center gap-2 text-white/30 hover:text-secondary transition-colors mb-6 group/back font-black text-[10px] uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" /> Voltar ao Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                        <span className="text-secondary drop-shadow-[0_0_15px_rgba(162,225,37,0.3)]">Leads</span> de Contato
                    </h1>
                    <p className="text-white/40 font-medium mt-2">Gerencie as interações e propostas recebidas pelo portal.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-surface/50 border border-white/5 p-1 rounded-2xl flex">
                        {(['todas', 'novas', 'lidas'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFiltro(f)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filtro === f ? 'bg-secondary text-primary shadow-glow' : 'text-white/40 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* FILTROS E BUSCA */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                <div className="relative flex-1 w-full">
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou conteúdo..."
                        className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-secondary/50 outline-none transition-all placeholder:text-white/20"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse py-20 text-center uppercase tracking-widest font-mono">Sincronizando Leads...</div>
            ) : (
                <div className="space-y-4">
                    {mensagensFiltradas.length === 0 ? (
                        <div className="glass-card rounded-[3rem] p-20 text-center border-2 border-dashed border-white/5">
                            <Mail className="w-16 h-16 text-white/5 mx-auto mb-6" />
                            <p className="text-white/30 font-black uppercase tracking-widest">Nenhum resultado encontrado.</p>
                            <button onClick={() => {setBusca(''); setFiltro('todas');}} className="mt-4 text-secondary font-bold text-sm hover:underline">Limpar filtros e busca</button>
                        </div>
                    ) : (
                        mensagensFiltradas.map((msg) => (
                            <div 
                                key={msg.id} 
                                className={`group glass-card premium-border rounded-[2.5rem] p-8 transition-all duration-300 hover:scale-[1.01] hover:border-secondary/20 relative overflow-hidden ${msg.lida ? 'opacity-50' : 'opacity-100'}`}
                            >
                                {!msg.lida && <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary shadow-glow" />}
                                
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${msg.lida ? 'bg-white/5 border-white/10' : 'bg-secondary/10 border-secondary/20'}`}>
                                                <Mail className={`w-5 h-5 ${msg.lida ? 'text-white/30' : 'text-secondary'}`} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-white leading-tight">{msg.nome}</h4>
                                                <p className="text-secondary/60 text-xs font-mono tracking-tighter uppercase">{msg.email}</p>
                                            </div>
                                            <div className="ml-auto md:ml-8 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] font-mono">
                                                {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 italic text-white/80 leading-relaxed relative">
                                            <span className="text-4xl text-white/5 absolute -top-2 -left-2 font-serif">"</span>
                                            {msg.mensagem}
                                        </div>
                                    </div>

                                    {/* ACTIONS ON HOVER */}
                                    <div className="flex md:flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                        <button
                                            onClick={() => toggleLida(msg.id, msg.lida)}
                                            className={`p-4 rounded-2xl border transition-all hover:scale-110 shadow-lg ${msg.lida ? 'bg-white/5 text-white/30 border-white/10' : 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20'}`}
                                            title={msg.lida ? "Marcar como não lida" : "Marcar como lida"}
                                        >
                                            <CheckCircle className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(msg.id)}
                                            className="p-4 text-red-400 bg-red-400/5 hover:bg-red-400 text-white rounded-2xl transition-all hover:scale-110 border border-red-400/10 shadow-lg"
                                            title="Excluir Lead"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {toastMsg && (
                <div className="fixed bottom-8 right-8 glass-card border border-secondary/50 text-white px-10 py-6 rounded-[2rem] shadow-premium z-[100] animate-fade-in flex items-center gap-5 backdrop-blur-2xl">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                        <CheckCircle className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest font-black text-secondary/60">Lead Management</span>
                        <span className="font-bold text-sm tracking-wide text-white">{toastMsg}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
