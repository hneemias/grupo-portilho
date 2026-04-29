'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AdminMapa() {
    const [unidades, setUnidades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
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

    async function deleteUnidade(id: string) {
        const { error } = await supabase.from('gp_mapa_unidades').delete().eq('id', id);
        if (!error) setUnidades(unidades.filter(u => u.id !== id));
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
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white/50" />
                </Link>
                <h1 className="text-3xl font-black text-white">Gestão do <span className="text-[#a3e635]">Mapa Operacional</span></h1>
            </div>

            <button
                onClick={addUnidade}
                className="mb-8 flex items-center gap-2 bg-[#a3e635] text-[#051c36] font-bold px-6 py-3 rounded-xl hover:scale-105 transition-transform"
            >
                <Plus className="w-5 h-5" /> Adicionar Novo Pin
            </button>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse">Carregando coordenadas...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-[#051c36] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-[11px] uppercase tracking-[0.2em] font-black text-white/30 border-b border-white/5">
                                    <th className="px-8 py-6">Nome / Identificação</th>
                                    <th className="px-8 py-6">Estado/UF</th>
                                    <th className="px-8 py-6">Latitude</th>
                                    <th className="px-8 py-6">Longitude</th>
                                    <th className="px-8 py-6 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unidades.map((uni) => (
                                    <tr key={uni.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-4">
                                            <input
                                                className="bg-transparent border-none outline-none text-white font-bold w-full"
                                                defaultValue={uni.nome}
                                                onBlur={(e) => saveUnidade(uni.id, { nome: e.target.value })}
                                            />
                                        </td>
                                        <td className="px-8 py-4">
                                            <input
                                                className="bg-transparent border-none outline-none text-white/60 w-full uppercase"
                                                defaultValue={uni.estado}
                                                onBlur={(e) => saveUnidade(uni.id, { estado: e.target.value })}
                                            />
                                        </td>
                                        <td className="px-8 py-4">
                                            <input
                                                type="number" step="any"
                                                className="bg-transparent border-none outline-none text-[#a3e635] font-mono w-full"
                                                defaultValue={uni.latitude}
                                                onBlur={(e) => saveUnidade(uni.id, { latitude: parseFloat(e.target.value) })}
                                            />
                                        </td>
                                        <td className="px-8 py-4">
                                            <input
                                                type="number" step="any"
                                                className="bg-transparent border-none outline-none text-[#a3e635] font-mono w-full"
                                                defaultValue={uni.longitude}
                                                onBlur={(e) => saveUnidade(uni.id, { longitude: parseFloat(e.target.value) })}
                                            />
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button onClick={() => deleteUnidade(uni.id)} className="text-white/20 hover:text-red-400 p-2 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
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
                <div className="fixed bottom-8 right-8 bg-[#051c36] border border-[#a3e635] text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-fade-in flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#a3e635] rounded-full animate-pulse" />
                    <span className="font-bold text-sm">{toastMsg}</span>
                </div>
            )}
        </div>
    );
}
