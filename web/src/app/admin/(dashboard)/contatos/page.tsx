'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, Save, Phone, Loader2, User, Image as ImageIcon, Briefcase, Upload, Camera } from 'lucide-react';
import Link from 'next/link';
import Toast from '../../components/Toast';
import ModalConfirm from '../../components/ModalConfirm';
import { compressImage } from '@/lib/utils/image';

export default function AdminContatos() {
    const [contatos, setContatos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading' } | null>(null);
    const [modal, setModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentEditId, setCurrentEditId] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchContatos();
    }, []);

    async function fetchContatos() {
        setLoading(true);
        const { data } = await supabase
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

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !currentEditId) return;

        setUploadingId(currentEditId);
        setToast({ message: 'Otimizando e enviando foto...', type: 'loading' });

        try {
            // 1. OTIMIZAÇÃO (Compressão e Redimensionamento)
            const compressedFile = await compressImage(file, 800); // Para contato, 800px é mais que suficiente

            const fileExt = compressedFile.name.split('.').pop();
            const fileName = `${currentEditId}-${Date.now()}.${fileExt}`;
            const filePath = `fotos-equipe/${fileName}`;

            // 2. UPLOAD
            const { error: uploadError } = await supabase.storage
                .from('galeria') 
                .upload(filePath, compressedFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('galeria')
                .getPublicUrl(filePath);

            // 3. ATUALIZAÇÃO NO BANCO
            const { error: updateError } = await supabase
                .from('gp_contatos')
                .update({ foto_url: publicUrl })
                .eq('id', currentEditId);

            if (updateError) throw updateError;

            setToast({ message: 'Foto otimizada e salva!', type: 'success' });
            fetchContatos();
        } catch (error) {
            console.error(error);
            setToast({ message: 'Erro no processamento da imagem', type: 'error' });
        } finally {
            setUploadingId(null);
            setCurrentEditId(null);
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
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload} 
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
                        Gestão de <span className="text-secondary drop-shadow-[0_0_15px_rgba(162,225,37,0.3)]">Especialistas</span>
                    </h1>
                    <p className="text-white/40 font-medium mt-2">Administre a equipe de atendimento direto e canais operacionais.</p>
                </div>

                <button
                    onClick={addContato}
                    className="flex items-center gap-3 bg-secondary text-primary font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-glow group"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" /> Adicionar Pessoa
                </button>
            </div>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse text-center py-20 uppercase tracking-widest">Carregando especialistas...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {contatos.map((contato) => (
                        <div key={contato.id} className="group glass-card premium-border rounded-[2.5rem] transition-all duration-300 hover:scale-[1.02] hover:border-secondary/30 shadow-premium relative overflow-hidden flex flex-col h-full">
                            {/* Preview da Foto - INDUSTRIAL STYLE */}
                            <div className="h-64 relative bg-surface/50 flex items-center justify-center overflow-hidden border-b border-white/5">
                                {contato.foto_url ? (
                                    <img src={contato.foto_url} alt={contato.nome} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-white/5">
                                        <User className="w-20 h-20 mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Sem Registro Visual</span>
                                    </div>
                                )}
                                
                                {/* Overlay de Upload - PREMIUM GLASS */}
                                <div 
                                    onClick={() => {
                                        setCurrentEditId(contato.id);
                                        fileInputRef.current?.click();
                                    }}
                                    className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer backdrop-blur-md"
                                >
                                    <div className="bg-black/40 p-6 rounded-[2rem] border border-white/10 flex flex-col items-center gap-3 hover:scale-110 transition-transform">
                                        {uploadingId === contato.id ? (
                                            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                                        ) : (
                                            <>
                                                <Camera className="w-8 h-8 text-secondary" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] font-mono">Atualizar Imagem</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="absolute top-6 left-8 bg-secondary text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-glow">
                                    {contato.departamento || 'OPERACIONAL'}
                                </div>
                            </div>

                            {/* Conteúdo - CLEAN & PRECISE */}
                            <div className="p-8 flex-1 flex flex-col gap-6">
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black font-mono">Nome Completo</label>
                                        <div className="relative group/input">
                                            <input
                                                id={`nome-${contato.id}`}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white font-black text-lg focus:border-secondary focus:bg-white/10 outline-none transition-all"
                                                defaultValue={contato.nome}
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within/input:text-secondary transition-colors" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black font-mono">Departamento / Cargo</label>
                                        <div className="relative group/input">
                                            <input
                                                id={`depto-${contato.id}`}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white/70 focus:border-secondary focus:bg-white/10 outline-none text-sm font-medium transition-all"
                                                defaultValue={contato.departamento}
                                            />
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within/input:text-secondary transition-colors" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-black font-mono">WhatsApp (Bypass Direto)</label>
                                        <div className="relative group/input">
                                            <input
                                                id={`tel-${contato.id}`}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-secondary font-black font-mono focus:border-secondary focus:bg-white/10 outline-none text-sm transition-all"
                                                defaultValue={contato.telefone}
                                            />
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/10 group-focus-within/input:text-secondary transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <button 
                                        onClick={() => {
                                            const n = (document.getElementById(`nome-${contato.id}`) as HTMLInputElement).value;
                                            const d = (document.getElementById(`depto-${contato.id}`) as HTMLInputElement).value;
                                            const t = (document.getElementById(`tel-${contato.id}`) as HTMLInputElement).value;
                                            handleSave(contato.id, { nome: n, departamento: d, telefone: t });
                                        }}
                                        className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white/80 font-black py-4 rounded-2xl transition-all border border-white/10 group/save"
                                    >
                                        {savingId === contato.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover/save:text-secondary transition-colors" />}
                                        Salvar
                                    </button>

                                    <button
                                        onClick={() => confirmDelete(contato.id)}
                                        className="flex items-center justify-center gap-3 bg-red-500/5 hover:bg-red-500 text-white font-black py-4 rounded-2xl transition-all border border-red-500/10 shadow-lg group/del"
                                    >
                                        <Trash2 className="w-4 h-4 group-hover/del:scale-110 transition-transform" /> Excluir
                                    </button>
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
