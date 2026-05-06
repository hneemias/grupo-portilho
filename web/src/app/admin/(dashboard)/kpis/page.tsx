'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, Hash } from 'lucide-react';
import Link from 'next/link';
import ModalConfirm from '../../components/ModalConfirm';

export default function AdminKPIs() {
    const [kpis, setKpis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [modal, setModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
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
        const novo = { valor: "Nova Métrica", label: "0", unidade: "", ordem: kpis.length };
        const { data, error } = await supabase.from('gp_kpis').insert([novo]).select();
        if (data) setKpis([...kpis, data[0]]);
    }

    async function confirmDelete(id: string) {
        setModal({ isOpen: true, id });
    }

    async function deleteKPI() {
        if (!modal.id) return;
        
        const { error } = await supabase.from('gp_kpis').delete().eq('id', modal.id);
        if (!error) {
            setKpis(kpis.filter(k => k.id !== modal.id));
            setToastMsg('Métrica removida com sucesso!');
            setTimeout(() => setToastMsg(null), 3000);
        }
        setModal({ isOpen: false, id: null });
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
            <ModalConfirm 
                isOpen={modal.isOpen}
                title="Excluir Métrica?"
                message="Esta ação removerá permanentemente este indicador do portal público. Tem certeza que deseja continuar?"
                onConfirm={deleteKPI}
                onCancel={() => setModal({ isOpen: false, id: null })}
            />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                <div>
                    <Link 
                        href="/admin" 
                        className="inline-flex items-center gap-2 text-white/30 hover:text-secondary transition-colors mb-6 group/back font-black text-[10px] uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" /> Voltar ao Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Gestão de <span className="text-secondary drop-shadow-[0_0_15px_rgba(162,225,37,0.3)]">Indicadores</span>
                    </h1>
                    <p className="text-white/40 font-medium mt-2">Configure os números de impacto e KPIs operacionais exibidos no portal.</p>
                </div>

                <button
                    onClick={addKPI}
                    className="flex items-center gap-3 bg-secondary text-primary font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-glow group"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" /> Adicionar Métrica
                </button>
            </div>

            {loading ? (
                <div className="text-white/30 font-black animate-pulse text-center py-20 uppercase tracking-[0.2em] font-mono">Sincronizando Indicadores...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {kpis.map((kpi) => (
                        <div key={kpi.id} className="group glass-card premium-border rounded-[2.5rem] p-10 transition-all duration-300 hover:scale-[1.02] hover:border-secondary/30 shadow-premium flex flex-col h-full">
                            <div className="flex flex-col gap-6 flex-1">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-black font-mono">Título / Identificador da Métrica</label>
                                    <input
                                        className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white font-black text-2xl focus:border-secondary focus:bg-white/10 outline-none transition-all placeholder:text-white/5"
                                        defaultValue={kpi.valor}
                                        onBlur={(e) => saveKPI(kpi.id, { valor: e.target.value })}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-secondary/40 font-black font-mono">Valor (Número)</label>
                                        <input
                                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-secondary font-black text-2xl focus:border-secondary focus:bg-secondary/5 outline-none transition-all focus:shadow-glow placeholder:text-secondary/10"
                                            defaultValue={kpi.label}
                                            onBlur={(e) => saveKPI(kpi.id, { label: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-black font-mono">Unidade / Metadado</label>
                                        <input
                                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white/40 text-sm font-medium focus:border-secondary focus:bg-white/10 outline-none transition-all font-mono"
                                            defaultValue={kpi.unidade}
                                            onBlur={(e) => saveKPI(kpi.id, { unidade: e.target.value })}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                        <Hash className="w-3 h-3 text-white/20" />
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest font-mono">Ordem:</span>
                                        <input
                                            type="number"
                                            className="bg-transparent text-secondary font-black w-8 focus:outline-none text-sm"
                                            defaultValue={kpi.ordem}
                                            onBlur={(e) => saveKPI(kpi.id, { ordem: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    
                                    {/* Action button appears on hover of card could be good, but here we'll keep it simple but premium */}
                                    <button 
                                        onClick={() => confirmDelete(kpi.id)} 
                                        className="p-3 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group/del"
                                    >
                                        <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* TOAST NOTIFICATION */}
            {toastMsg && (
                <div className="fixed bottom-8 right-8 bg-primary border border-secondary text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-fade-in flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    <span className="font-bold text-sm">{toastMsg}</span>
                </div>
            )}
        </div>
    );
}
