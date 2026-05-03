'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, Save, Link as LinkIcon, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Toast from '../../components/Toast';
import ModalConfirm from '../../components/ModalConfirm';

export default function AdminParceiros() {
    const [parceiros, setParceiros] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading' } | null>(null);
    const [modal, setModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    
    const supabase = createClient();

    useEffect(() => {
        fetchParceiros();
    }, []);

    async function fetchParceiros() {
        setLoading(true);
        const { data } = await supabase
            .from('gp_parceiros')
            .select('*')
            .order('ordem', { ascending: true });
            
        if (data) setParceiros(data);
        setLoading(false);
    }

    async function addParceiro() {
        setToast({ message: 'Adicionando parceiro...', type: 'loading' });
        const novo = {
            nome: "Novo Parceiro",
            logo_url: "",
            categoria: "Produção",
            ordem: parceiros.length + 1
        };
        const { data, error } = await supabase.from('gp_parceiros').insert([novo]).select();
        
        if (error) {
            setToast({ message: 'Erro ao adicionar parceiro', type: 'error' });
        } else if (data) {
            setParceiros([...parceiros, data[0]]);
            setToast({ message: 'Novo parceiro adicionado!', type: 'success' });
        }
    }

    async function confirmDelete(id: string) {
        setModal({ isOpen: true, id });
    }

    async function deleteParceiro() {
        if (!modal.id) return;
        
        const { error } = await supabase.from('gp_parceiros').delete().eq('id', modal.id);
        if (!error) {
            setParceiros(parceiros.filter(p => p.id !== modal.id));
            setToast({ message: 'Parceiro removido com sucesso!', type: 'success' });
        } else {
            setToast({ message: 'Erro ao remover parceiro', type: 'error' });
        }
        setModal({ isOpen: false, id: null });
    }

    async function handleSave(id: string, updates: any) {
        if (!updates.nome?.trim()) {
            setToast({ message: 'O nome da empresa é obrigatório!', type: 'error' });
            return;
        }

        setSavingId(id);
        const { error } = await supabase.from('gp_parceiros').update(updates).eq('id', id);
        
        if (!error) {
            setToast({ message: 'Alterações salvas!', type: 'success' });
            setSavingId(null);
            fetchParceiros(); // Refresh para atualizar preview
        } else {
            setToast({ message: 'Erro ao salvar alterações', type: 'error' });
            setSavingId(null);
        }
    }

    return (
        <div className="animate-fade-in pb-20">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white/50" />
                    </Link>
                    <h1 className="text-3xl font-black text-white">Parceiros de <span className="text-[#a3e635]">Produção</span></h1>
                </div>

                <button
                    onClick={addParceiro}
                    className="flex items-center gap-2 bg-[#a3e635] text-[#051c36] font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-lg"
                >
                    <Plus className="w-5 h-5" /> Adicionar Parceiro
                </button>
            </div>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse text-center py-20 uppercase tracking-widest">Sincronizando parceiros...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
                    {parceiros.map((parceiro) => (
                        <div key={parceiro.id} className="group bg-[#041a33] border border-white/10 rounded-[2.5rem] transition-all hover:border-[#a3e635]/40 shadow-xl hover:shadow-[0_0_40px_rgba(0,0,0,0.4)] relative">
                            {/* Preview da Logo */}
                            <div className="h-32 relative bg-white flex items-center justify-center p-6 overflow-hidden rounded-t-[2.4rem]">
                                {parceiro.logo_url ? (
                                    <img src={parceiro.logo_url} alt={parceiro.nome} className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-black/10">
                                        <ImageIcon className="w-8 h-8 mb-1" />
                                        <span className="text-[8px] font-black uppercase tracking-widest text-black/20">Sem Logo</span>
                                    </div>
                                )}
                            </div>

                            {/* Conteúdo */}
                            <div className="p-8">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Nome da Empresa</label>
                                        <input
                                            id={`nome-${parceiro.id}`}
                                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold focus:border-[#a3e635] outline-none text-sm transition-colors"
                                            defaultValue={parceiro.nome}
                                            placeholder="Ex: John Deere"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">URL da Logo (PNG/SVG)</label>
                                        <div className="relative">
                                            <input
                                                id={`url-${parceiro.id}`}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white/60 text-xs focus:border-[#a3e635] outline-none transition-colors"
                                                defaultValue={parceiro.logo_url}
                                                placeholder="https://..."
                                            />
                                            <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button 
                                            onClick={() => {
                                                const n = (document.getElementById(`nome-${parceiro.id}`) as HTMLInputElement).value;
                                                const u = (document.getElementById(`url-${parceiro.id}`) as HTMLInputElement).value;
                                                handleSave(parceiro.id, { nome: n, logo_url: u });
                                            }}
                                            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-2 rounded-xl transition-all border border-white/10 text-xs"
                                        >
                                            {savingId === parceiro.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                            Salvar
                                        </button>

                                        <button
                                            onClick={() => confirmDelete(parceiro.id)}
                                            className="flex items-center justify-center gap-2 bg-red-500/5 hover:bg-red-500/10 text-red-400 py-2 rounded-xl transition-all border border-red-500/10 text-xs"
                                        >
                                            <Trash2 className="w-3 h-3" /> Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {parceiros.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20 bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/5">
                             <p className="text-white/20 font-bold uppercase tracking-widest text-sm">Nenhum parceiro cadastrado.</p>
                        </div>
                    )}
                </div>
            )}

            {/* FEEDBACK COMPONENTS */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}

            <ModalConfirm 
                isOpen={modal.isOpen}
                title="Excluir Parceiro?"
                message="Esta ação removerá a empresa e sua logo da lista de parceiros exibida no site."
                onConfirm={deleteParceiro}
                onCancel={() => setModal({ isOpen: false, id: null })}
                confirmText="Sim, Excluir"
                cancelText="Manter Parceiro"
            />
        </div>
    );
}
