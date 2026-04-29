'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, Hash } from 'lucide-react';
import Link from 'next/link';

export default function AdminKPIs() {
    const [kpis, setKpis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchKPIs();
    }, []);

    async function fetchKPIs() {
        setLoading(true);
        const { data } = await supabase.from('gp_kpis').select('*').order('ordem', { ascending: true });
        if (data) setKpis(data);
        setLoading(false);
    }

    async function addKPI() {
        const novo = { label: "Nova Métrica", valor: "0", unidade: "", ordem: kpis.length };
        const { data, error } = await supabase.from('gp_kpis').insert([novo]).select();
        if (data) setKpis([...kpis, data[0]]);
    }

    async function deleteKPI(id: string) {
        const { error } = await supabase.from('gp_kpis').delete().eq('id', id);
        if (!error) setKpis(kpis.filter(k => k.id !== id));
    }

    async function saveKPI(id: string, updates: any) {
        const { error } = await supabase.from('gp_kpis').update(updates).eq('id', id);
        if (!error) {
            setToastMsg('Métrica atualizada!');
            setTimeout(() => setToastMsg(null), 2000);
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white/50" />
                </Link>
                <h1 className="text-3xl font-black text-white">Gestão de <span className="text-[#a3e635]">Métricas (KPIs)</span></h1>
            </div>

            <button
                onClick={addKPI}
                className="mb-8 flex items-center gap-2 bg-[#a3e635] text-[#051c36] font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform"
            >
                <Plus className="w-5 h-5" /> Adicionar Métrica
            </button>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse">Carregando métricas...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {kpis.map((kpi) => (
                        <div key={kpi.id} className="bg-[#051c36] border border-white/5 p-6 rounded-3xl shadow-xl hover:border-[#a3e635]/30 transition-colors">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Título / Label</label>
                                    <input
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-[#a3e635] outline-none text-white text-lg font-bold"
                                        defaultValue={kpi.label}
                                        onBlur={(e) => saveKPI(kpi.id, { label: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Valor (ex: +30k)</label>
                                        <input
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-[#a3e635] outline-none text-[#a3e635] font-black"
                                            defaultValue={kpi.valor}
                                            onBlur={(e) => saveKPI(kpi.id, { valor: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Unidade / Obs</label>
                                        <input
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-[#a3e635] outline-none text-white/50"
                                            defaultValue={kpi.unidade}
                                            onBlur={(e) => saveKPI(kpi.id, { unidade: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-white/20" />
                                        <input
                                            type="number"
                                            className="bg-transparent text-white/30 w-12 focus:outline-none"
                                            defaultValue={kpi.ordem}
                                            onBlur={(e) => saveKPI(kpi.id, { ordem: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <button onClick={() => deleteKPI(kpi.id)} className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
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
