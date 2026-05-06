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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                <div>
                    <Link 
                        href="/admin" 
                        className="inline-flex items-center gap-2 text-white/30 hover:text-secondary transition-colors mb-6 group/back font-black text-[10px] uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" /> Voltar ao Dashboard
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
                        Rede de <span className="text-secondary drop-shadow-[0_0_15px_rgba(162,225,37,0.3)]">Parceiros</span>
                    </h1>
                    <p className="text-white/40 font-medium mt-2">Gerencie as marcas e empresas que fortalecem o ecossistema Portilho.</p>
                </div>

                <button
                    onClick={addParceiro}
                    className="flex items-center gap-3 bg-secondary text-primary font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-glow group"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" /> Adicionar Parceiro
                </button>
            </div>

            {loading ? (
                <div className="text-white/30 font-black animate-pulse text-center py-20 uppercase tracking-[0.2em] font-mono">Sincronizando Ecossistema...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {parceiros.map((parceiro) => (
                        <div key={parceiro.id} className="group glass-card premium-border rounded-[2.5rem] transition-all duration-300 hover:scale-[1.02] hover:border-secondary/30 shadow-premium relative overflow-hidden flex flex-col h-full">
                            {/* Preview da Logo - HIGH CONTRAST */}
                            <div className="h-40 relative bg-white flex items-center justify-center p-8 overflow-hidden rounded-t-[2.4rem] border-b border-white/5">
                                {parceiro.logo_url ? (
                                    <img src={parceiro.logo_url} alt={parceiro.nome} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-black/5">
                                        <ImageIcon className="w-12 h-12 mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Missing Asset</span>
                                    </div>
                                )}
                                
                                <div className="absolute top-4 right-6 bg-primary/5 text-primary/40 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/5">
                                    {parceiro.categoria || 'PARCEIRO'}
                                </div>
                            </div>

                            {/* Conteúdo - CLEAN & TECHNICAL */}
                            <div className="p-8 flex-1 flex flex-col gap-6">
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black font-mono">Empresa / Instituição</label>
                                        <input
                                            id={`nome-${parceiro.id}`}
                                            className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-lg focus:border-secondary focus:bg-white/10 outline-none transition-all placeholder:text-white/10"
                                            defaultValue={parceiro.nome}
                                            placeholder="Nome oficial..."
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black font-mono">Link do Logotipo (Asset URL)</label>
                                        <div className="relative group/input">
                                            <input
                                                id={`url-${parceiro.id}`}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/40 text-[10px] font-mono focus:border-secondary focus:bg-white/10 outline-none transition-all"
                                                defaultValue={parceiro.logo_url}
                                                placeholder="https://storage.google.com/..."
                                            />
                                            <LinkIcon className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within/input:text-secondary transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions on HOVER */}
                                <div className="grid grid-cols-2 gap-4 mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                    <button 
                                        onClick={() => {
                                            const n = (document.getElementById(`nome-${parceiro.id}`) as HTMLInputElement).value;
                                            const u = (document.getElementById(`url-${parceiro.id}`) as HTMLInputElement).value;
                                            handleSave(parceiro.id, { nome: n, logo_url: u });
                                        }}
                                        className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white/80 font-black py-4 rounded-2xl transition-all border border-white/10 group/save"
                                    >
                                        {savingId === parceiro.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover/save:text-secondary transition-colors" />}
                                        Salvar
                                    </button>

                                    <button
                                        onClick={() => confirmDelete(parceiro.id)}
                                        className="flex items-center justify-center gap-3 bg-red-500/5 hover:bg-red-500 text-white font-black py-4 rounded-2xl transition-all border border-red-500/10 shadow-lg group/del"
                                    >
                                        <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" /> Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {parceiros.length === 0 && !loading && (
                        <div className="col-span-full glass-card rounded-[3rem] p-32 text-center border-2 border-dashed border-white/5">
                             <ImageIcon className="w-16 h-16 text-white/5 mx-auto mb-6" />
                             <p className="text-white/20 font-black uppercase tracking-[0.3em] text-sm">Base de Parceiros Vazia</p>
                             <button onClick={addParceiro} className="mt-6 text-secondary font-bold hover:underline">Iniciar Cadastro</button>
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
                message="Esta ação removerá a empresa e sua logo da lista de parceiros exibida no site permanentemente."
                onConfirm={deleteParceiro}
                onCancel={() => setModal({ isOpen: false, id: null })}
                confirmText="Confirmar Exclusão"
                cancelText="Cancelar"
            />
        </div>
    );
}
