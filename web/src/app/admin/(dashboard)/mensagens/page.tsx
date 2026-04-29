'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Trash2, Mail, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminMensagens() {
    const [mensagens, setMensagens] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
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

    async function deleteMensagem(id: string) {
        if (!confirm('Excluir esta mensagem permanentemente?')) return;
        const { error } = await supabase.from('gp_mensagens').delete().eq('id', id);
        if (!error) {
            setMensagens(mensagens.filter(m => m.id !== id));
            setToastMsg('Mensagem excluída');
            setTimeout(() => setToastMsg(null), 2000);
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white/50" />
                    </Link>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter">Mensagens de <span className="text-[#a3e635]">Contato</span></h1>
                </div>
                <div className="bg-[#a3e635]/10 text-[#a3e635] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-[#a3e635]/20">
                    {mensagens.filter(m => !m.lida).length} Novas
                </div>
            </div>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse">Consultando caixa de entrada...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {mensagens.length === 0 ? (
                        <div className="bg-[#051c36] border border-dashed border-white/10 p-20 rounded-3xl text-center">
                            <Mail className="w-12 h-12 text-white/10 mx-auto mb-4" />
                            <p className="text-white/30 font-bold">Nenhuma mensagem recebida ainda.</p>
                        </div>
                    ) : (
                        mensagens.map((msg) => (
                            <div key={msg.id} className={`bg-[#051c36] border ${msg.lida ? 'border-white/5 opacity-60' : 'border-[#a3e635]/30'} p-6 rounded-3xl shadow-xl transition-all hover:scale-[1.01]`}>
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-black text-lg text-white">{msg.nome}</span>
                                            <span className="text-white/30 text-xs">—</span>
                                            <span className="text-[#a3e635] text-sm font-medium">{msg.email}</span>
                                        </div>
                                        <div className="text-white/40 text-xs mb-4 flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {new Date(msg.created_at).toLocaleString('pt-BR')}
                                            {msg.assunto && <span className="bg-white/5 px-2 py-0.5 rounded ml-2 uppercase font-black">{msg.assunto}</span>}
                                        </div>
                                        <p className="text-white/80 leading-relaxed bg-white/5 p-4 rounded-2xl italic">
                                            "{msg.mensagem}"
                                        </p>
                                    </div>
                                    <div className="flex md:flex-col gap-2 justify-end">
                                        <button
                                            onClick={() => toggleLida(msg.id, msg.lida)}
                                            className={`p-3 rounded-xl border transition-all ${msg.lida ? 'bg-white/5 text-white/30 border-white/5' : 'bg-[#a3e635]/10 text-[#a3e635] border-[#a3e635]/20 hover:bg-[#a3e635]/20'}`}
                                            title={msg.lida ? "Marcar como não lida" : "Marcar como lida"}
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteMensagem(msg.id)}
                                            className="p-3 text-red-400 bg-red-400/5 hover:bg-red-400/20 rounded-xl transition-colors border border-red-400/10"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* TOAST NOTIFICATION */}
            {toastMsg && (
                <div className="fixed bottom-8 right-8 bg-[#051c36] border border-[#a3e635] text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-fade-in flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#a3e635] rounded-full animate-pulse" />
                    <span className="font-bold text-sm">{toastMsg}</span>
                </div>
            )}
        </div>
    );
}
