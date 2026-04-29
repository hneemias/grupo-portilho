'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, Save, Star } from 'lucide-react';
import Link from 'next/link';

export default function AdminDepoimentos() {
    const [depoimentos, setDepoimentos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchDepoimentos();
    }, []);

    async function fetchDepoimentos() {
        setLoading(true);
        const { data } = await supabase.from('gp_depoimentos').select('*').order('created_at', { ascending: false });
        if (data) setDepoimentos(data);
        setLoading(false);
    }

    async function addDepoimento() {
        const novo = {
            nome: "Novo Cliente",
            papel: "Cargo/Empresa",
            texto: "Escreva o depoimento aqui...",
            estrelas: 5,
            avatar_url: ""
        };
        const { data, error } = await supabase.from('gp_depoimentos').insert([novo]).select();
        if (data) setDepoimentos([data[0], ...depoimentos]);
    }

    async function deleteDepoimento(id: string) {
        const { error } = await supabase.from('gp_depoimentos').delete().eq('id', id);
        if (!error) setDepoimentos(depoimentos.filter(d => d.id !== id));
    }

    async function saveDepoimento(id: string, updates: any) {
        setSaving(true);
        const { error } = await supabase.from('gp_depoimentos').update(updates).eq('id', id);
        setSaving(false);
        if (!error) {
            setToastMsg('Alteração salva com sucesso!');
            setTimeout(() => setToastMsg(null), 3000);
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white/50" />
                </Link>
                <h1 className="text-3xl font-black text-white">Gestão de <span className="text-[#a3e635]">Depoimentos</span></h1>
            </div>

            <button
                onClick={addDepoimento}
                className="mb-8 flex items-center gap-2 bg-[#a3e635] text-[#051c36] font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform"
            >
                <Plus className="w-5 h-5" /> Adicionar Depoimento
            </button>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse">Carregando dados do servidor...</div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {depoimentos.map((depo) => (
                        <div key={depo.id} className="bg-[#051c36] border border-white/5 p-6 rounded-3xl shadow-xl group hover:border-[#a3e635]/30 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Cliente</label>
                                    <input
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-[#a3e635] outline-none"
                                        defaultValue={depo.nome}
                                        onBlur={(e) => saveDepoimento(depo.id, { nome: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Cargo / Empresa</label>
                                    <input
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-[#a3e635] outline-none"
                                        defaultValue={depo.papel}
                                        onBlur={(e) => saveDepoimento(depo.id, { papel: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Avatar URL</label>
                                    <input
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-[#a3e635] outline-none"
                                        defaultValue={depo.avatar_url}
                                        onBlur={(e) => saveDepoimento(depo.id, { avatar_url: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Estrelas (1-5)</label>
                                    <input
                                        type="number" min="1" max="5"
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-[#a3e635] outline-none"
                                        defaultValue={depo.estrelas}
                                        onBlur={(e) => saveDepoimento(depo.id, { estrelas: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-6">
                                <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Depoimento</label>
                                <textarea
                                    rows={3}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-[#a3e635] outline-none resize-none"
                                    defaultValue={depo.texto}
                                    onBlur={(e) => saveDepoimento(depo.id, { texto: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => deleteDepoimento(depo.id)}
                                    className="p-3 text-red-400 bg-red-400/5 hover:bg-red-400/20 rounded-xl transition-colors border border-red-400/10"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
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
