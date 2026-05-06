'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, MapPin } from 'lucide-react';
import Link from 'next/link';
import ModalConfirm from '../../components/ModalConfirm';

export default function AdminMapa() {
    const [unidades, setUnidades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [modal, setModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const supabase = createClient();

    useEffect(() => {
        fetchUnidades();
    }, []);

    async function fetchUnidades() {
        setLoading(true);
        const { data } = await supabase.from('gp_mapa_unidades').select('*');
        if (data) setUnidades(data);
        setLoading(false);
    }

    async function addUnidade() {
        const novo = { nome: "Nova Unidade", latitude: -15.0, longitude: -50.0, estado: "UF" };
        const { data, error } = await supabase.from('gp_mapa_unidades').insert([novo]).select();
        if (data) setUnidades([...unidades, data[0]]);
    }

    async function confirmDelete(id: string) {
        setModal({ isOpen: true, id });
    }

    async function deleteUnidade() {
        if (!modal.id) return;
        
        const { error } = await supabase.from('gp_mapa_unidades').delete().eq('id', modal.id);
        if (!error) {
            setUnidades(unidades.filter(u => u.id !== modal.id));
            setToastMsg('Coordenada removida!');
            setTimeout(() => setToastMsg(null), 3000);
        }
        setModal({ isOpen: false, id: null });
    }

    async function saveUnidade(id: string, updates: any) {
        const { error } = await supabase.from('gp_mapa_unidades').update(updates).eq('id', id);
        if (!error) {
            setToastMsg('Coordenadas salvas!');
            setTimeout(() => setToastMsg(null), 2000);
        }
    }

    return (
        <div className="animate-fade-in">
            <ModalConfirm 
                isOpen={modal.isOpen}
                title="Excluir Ponto?"
                message="Esta coordenada será removida do mapa público. Deseja continuar com a exclusão permanente?"
                onConfirm={deleteUnidade}
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
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                        Malha <span className="text-secondary drop-shadow-[0_0_15px_rgba(162,225,37,0.3)]">Cartográfica</span>
                    </h1>
                    <p className="text-white/40 font-medium mt-2">Gerencie os pontos de presença, fazendas e matrizes operacionais no mapa.</p>
                </div>

                <button
                    onClick={addUnidade}
                    className="flex items-center gap-3 bg-secondary text-primary font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-glow group"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" /> Adicionar Novo Pin
                </button>
            </div>

            {loading ? (
                <div className="text-white/30 font-black animate-pulse text-center py-20 uppercase tracking-[0.2em] font-mono">Triangulando Coordenadas...</div>
            ) : (
                <div className="glass-card premium-border rounded-[2.5rem] overflow-hidden shadow-premium transition-all duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] text-[10px] uppercase tracking-[0.3em] font-black text-white/30 border-b border-white/5">
                                    <th className="px-10 py-8">Unidade / Identificação</th>
                                    <th className="px-10 py-8">Região / UF</th>
                                    <th className="px-10 py-8">Latitude (N/S)</th>
                                    <th className="px-10 py-8">Longitude (E/W)</th>
                                    <th className="px-10 py-8 text-right opacity-0">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {unidades.map((uni) => (
                                    <tr key={uni.id} className="hover:bg-white/[0.02] transition-all group">
                                        <td className="px-10 py-6">
                                            <input
                                                className="bg-transparent border-none outline-none text-white font-black text-lg w-full focus:text-secondary transition-colors"
                                                defaultValue={uni.nome}
                                                onBlur={(e) => saveUnidade(uni.id, { nome: e.target.value })}
                                            />
                                        </td>
                                        <td className="px-10 py-6">
                                            <input
                                                className="bg-transparent border-none outline-none text-white/50 font-bold uppercase tracking-widest text-xs w-full focus:text-white transition-colors"
                                                defaultValue={uni.estado}
                                                onBlur={(e) => saveUnidade(uni.id, { estado: e.target.value })}
                                            />
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2 text-secondary font-mono font-black">
                                                <MapPin className="w-3 h-3 text-white/10" />
                                                <input
                                                    type="number" step="any"
                                                    className="bg-transparent border-none outline-none w-full focus:shadow-glow-sm rounded"
                                                    defaultValue={uni.latitude}
                                                    onBlur={(e) => saveUnidade(uni.id, { latitude: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2 text-secondary font-mono font-black">
                                                <MapPin className="w-3 h-3 text-white/10" />
                                                <input
                                                    type="number" step="any"
                                                    className="bg-transparent border-none outline-none w-full focus:shadow-glow-sm rounded"
                                                    defaultValue={uni.longitude}
                                                    onBlur={(e) => saveUnidade(uni.id, { longitude: parseFloat(e.target.value) })}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                                <button 
                                                    onClick={() => confirmDelete(uni.id)} 
                                                    className="p-4 bg-red-500/5 hover:bg-red-500 text-white rounded-2xl transition-all border border-red-500/10 shadow-lg"
                                                    title="Excluir Coordenada"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
