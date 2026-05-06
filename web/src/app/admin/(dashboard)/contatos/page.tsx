'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, Save, Phone, Loader2, User, Image as ImageIcon, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Toast from '../../components/Toast';
import ModalConfirm from '../../components/ModalConfirm';

export default function AdminContatos() {
    const [contatos, setContatos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading' } | null>(null);
    const [modal, setModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    
    const supabase = createClient();

    useEffect(() => {
        fetchContatos();
    }, []);

    async function fetchContatos() {
        setLoading(true);
        const { data, error } = await supabase
            .from('gp_contatos')
            .select('*')
            .order('ordem', { ascending: true });
            
        if (data) setContatos(data);
        setLoading(false);
    }

    async function addContato() {
        setToast({ message: 'Adicionando contato...', type: 'loading' });
        const novo = {
            nome: "Novo Consultor",
            departamento: "Comercial",
            telefone: "55629...",
            foto_url: "",
            ordem: contatos.length + 1
        };
        const { data, error } = await supabase.from('gp_contatos').insert([novo]).select();
        
        if (error) {
            setToast({ message: 'Erro ao adicionar contato', type: 'error' });
        } else if (data) {
            setContatos([...contatos, data[0]]);
            setToast({ message: 'Novo contato adicionado!', type: 'success' });
        }
    }

    async function confirmDelete(id: string) {
        setModal({ isOpen: true, id });
    }

    async function deleteContato() {
        if (!modal.id) return;
        
        const { error } = await supabase.from('gp_contatos').delete().eq('id', modal.id);
        if (!error) {
            setContatos(contatos.filter(c => c.id !== modal.id));
            setToast({ message: 'Contato removido!', type: 'success' });
        } else {
            setToast({ message: 'Erro ao remover contato', type: 'error' });
        }
        setModal({ isOpen: false, id: null });
    }

    async function handleSave(id: string, updates: any) {
        if (!updates.nome?.trim()) {
            setToast({ message: 'O nome é obrigatório!', type: 'error' });
            return;
        }

        setSavingId(id);
        const { error } = await supabase.from('gp_contatos').update(updates).eq('id', id);
        
        if (!error) {
            setToast({ message: 'Contato atualizado!', type: 'success' });
            setSavingId(null);
            fetchContatos();
        } else {
            setToast({ message: 'Erro ao salvar', type: 'error' });
            setSavingId(null);
        }
    }

    return (
        <div className="animate-fade-in pb-20 mt-8">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white/50" />
                    </Link>
                    <h1 className="text-3xl font-black text-white">Contatos <span className="text-[#a3e635]">Diretos</span></h1>
                </div>

                <button
                    onClick={addContato}
                    className="flex items-center gap-2 bg-[#a3e635] text-[#051c36] font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-lg"
                >
                    <Plus className="w-5 h-5" /> Adicionar Pessoa
                </button>
            </div>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse text-center py-20 uppercase tracking-widest">Carregando especialistas...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contatos.map((contato) => (
                        <div key={contato.id} className="group bg-[#041a33] border border-white/10 rounded-[2.5rem] transition-all hover:border-[#a3e635]/40 shadow-xl hover:shadow-[0_0_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
                            {/* Preview da Foto */}
                            <div className="h-48 relative bg-[#0b2545] flex items-center justify-center overflow-hidden">
                                {contato.foto_url ? (
                                    <img src={contato.foto_url} alt={contato.nome} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-white/10">
                                        <User className="w-16 h-16 mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Sem Foto</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-[#a3e635] text-[#051c36] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                    {contato.departamento}
                                </div>
                            </div>

                            {/* Conteúdo */}
                            <div className="p-8">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Nome Completo</label>
                                        <div className="relative">
                                            <input
                                                id={`nome-${contato.id}`}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2 text-white font-bold focus:border-[#a3e635] outline-none text-sm transition-colors"
                                                defaultValue={contato.nome}
                                            />
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Departamento / Cargo</label>
                                        <div className="relative">
                                            <input
                                                id={`depto-${contato.id}`}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2 text-white/70 focus:border-[#a3e635] outline-none text-sm transition-colors font-medium"
                                                defaultValue={contato.departamento}
                                            />
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">WhatsApp (com DDD)</label>
                                        <div className="relative">
                                            <input
                                                id={`tel-${contato.id}`}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2 text-[#a3e635] font-black focus:border-[#a3e635] outline-none text-sm transition-colors"
                                                defaultValue={contato.telefone}
                                            />
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">URL da Foto</label>
                                        <div className="relative">
                                            <input
                                                id={`url-${contato.id}`}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-10 py-2 text-white/50 text-xs focus:border-[#a3e635] outline-none transition-colors"
                                                defaultValue={contato.foto_url}
                                                placeholder="https://..."
                                            />
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <button 
                                            onClick={() => {
                                                const n = (document.getElementById(`nome-${contato.id}`) as HTMLInputElement).value;
                                                const d = (document.getElementById(`depto-${contato.id}`) as HTMLInputElement).value;
                                                const t = (document.getElementById(`tel-${contato.id}`) as HTMLInputElement).value;
                                                const u = (document.getElementById(`url-${contato.id}`) as HTMLInputElement).value;
                                                handleSave(contato.id, { nome: n, departamento: d, telefone: t, foto_url: u });
                                            }}
                                            className="flex items-center justify-center gap-2 bg-[#a3e635] hover:brightness-110 text-[#051c36] font-black py-3 rounded-xl transition-all text-xs shadow-lg"
                                        >
                                            {savingId === contato.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                            Salvar
                                        </button>

                                        <button
                                            onClick={() => confirmDelete(contato.id)}
                                            className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-3 rounded-xl transition-all border border-red-500/20 text-xs"
                                        >
                                            <Trash2 className="w-3 h-3" /> Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}

            <ModalConfirm 
                isOpen={modal.isOpen}
                title="Remover Especialista?"
                message="Esta pessoa não aparecerá mais como contato direto no site oficial."
                onConfirm={deleteContato}
                onCancel={() => setModal({ isOpen: false, id: null })}
                confirmText="Sim, Remover"
                cancelText="Manter"
            />
        </div>
    );
}
