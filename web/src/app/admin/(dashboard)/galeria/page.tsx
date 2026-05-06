'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, ChevronRight, Save, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import ModalConfirm from '../../components/ModalConfirm';

export default function AdminAlbuns() {
    const [albuns, setAlbuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [modal, setModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const supabase = createClient();

    useEffect(() => {
        fetchAlbuns();
    }, []);

    async function fetchAlbuns() {
        setLoading(true);
        const { data } = await supabase
            .from('gp_albuns')
            .select('*, gp_galeria(*)')
            .order('created_at', { ascending: false });
            
        if (data) setAlbuns(data);
        setLoading(false);
    }

    async function addAlbum() {
        const novo = {
            titulo: "",
            descricao: ""
        };
        const { data } = await supabase.from('gp_albuns').insert([novo]).select();
        if (data) {
            const novoAlbum = { ...data[0], gp_galeria: [] };
            setAlbuns([novoAlbum, ...albuns]);
            setToastMsg('Novo álbum criado! Preencha os dados abaixo.');
            setTimeout(() => setToastMsg(null), 3000);
        }
    }

    async function confirmDelete(id: string) {
        setModal({ isOpen: true, id });
    }

    async function deleteAlbum() {
        if (!modal.id) return;
        
        const { error } = await supabase.from('gp_albuns').delete().eq('id', modal.id);
        if (!error) {
            setAlbuns(albuns.filter(a => a.id !== modal.id));
            setToastMsg('Álbum excluído permanentemente.');
            setTimeout(() => setToastMsg(null), 3000);
        }
        setModal({ isOpen: false, id: null });
    }

    async function handleSave(id: string, titulo: string, descricao: string) {
        if (!titulo.trim()) {
            setToastMsg('Erro: O título do álbum não pode ser vazio!');
            setTimeout(() => setToastMsg(null), 3000);
            return;
        }

        setSavingId(id);
        const { error } = await supabase.from('gp_albuns').update({ titulo, descricao }).eq('id', id);
        
        if (!error) {
            setToastMsg('Álbum salvo com sucesso!');
            setTimeout(() => {
                setToastMsg(null);
                setSavingId(null);
            }, 2000);
        }
    }

    const getCapa = (album: any) => {
        const capa = album.gp_galeria?.find((f: any) => f.is_capa);
        return capa ? capa.url : album.gp_galeria?.[0]?.url;
    };

    return (
        <div className="animate-fade-in pb-20">
            <ModalConfirm 
                isOpen={modal.isOpen}
                title="Excluir Álbum?"
                message="Isso excluirá permanentemente o álbum e todas as fotos dentro dele. Esta ação não pode ser desfeita."
                onConfirm={deleteAlbum}
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
                        Gestão de <span className="text-secondary drop-shadow-[0_0_15px_rgba(162,225,37,0.3)]">Álbuns</span>
                    </h1>
                    <p className="text-white/40 font-medium mt-2">Acervo visual de infraestrutura, safras e eventos corporativos.</p>
                </div>

                <button
                    onClick={addAlbum}
                    className="flex items-center gap-2 bg-secondary text-primary font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-lg"
                >
                    <Plus className="w-5 h-5" /> Criar Novo Álbum
                </button>
            </div>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse text-center py-20 uppercase tracking-widest">Sincronizando álbuns...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {albuns.map((album) => {
                        const capaUrl = getCapa(album);
                        
                        return (
                            <div key={album.id} className="group glass-card premium-border rounded-[2.5rem] overflow-hidden shadow-premium transition-all duration-300 hover:scale-[1.02] hover:border-secondary/30 flex flex-col h-full">
                                <div className="h-48 relative bg-surface/50 overflow-hidden">
                                    {capaUrl ? (
                                        <img src={capaUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/10">
                                            <ImageIcon className="w-12 h-12 mb-2" />
                                            <span className="text-[10px] font-black uppercase tracking-widest font-mono">Status: Vazio</span>
                                        </div>
                                    )}
                                    
                                    {/* Overlay Glass on Hover for Meta info */}
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        <div className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10">
                                            <span className="text-secondary font-black text-xs uppercase tracking-widest font-mono">Gerenciar Álbum</span>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute top-6 left-8 flex items-center gap-2">
                                        <div className="bg-secondary text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-glow">
                                            {album.gp_galeria?.length || 0} fotos
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex flex-col gap-6 flex-1">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/30 font-black font-mono">ID: {album.id.substring(0,8)}</label>
                                            <input
                                                id={`titulo-${album.id}`}
                                                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white font-black text-xl focus:border-secondary focus:bg-white/10 outline-none transition-all placeholder:text-white/10"
                                                defaultValue={album.titulo}
                                                placeholder="Título do Álbum..."
                                            />
                                        </div>
                                        
                                        <div className="flex flex-col gap-2 flex-1">
                                            <label className="text-[10px] uppercase tracking-widest text-white/30 font-black font-mono">Descrição Técnica</label>
                                            <textarea
                                                id={`desc-${album.id}`}
                                                rows={2}
                                                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white/60 text-sm font-medium focus:border-secondary focus:bg-white/10 outline-none resize-none transition-all placeholder:text-white/10"
                                                defaultValue={album.descricao}
                                                placeholder="Breve resumo operacional..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <button 
                                                onClick={() => {
                                                    const t = (document.getElementById(`titulo-${album.id}`) as HTMLInputElement).value;
                                                    const d = (document.getElementById(`desc-${album.id}`) as HTMLTextAreaElement).value;
                                                    handleSave(album.id, t, d);
                                                }}
                                                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 font-bold py-4 rounded-2xl transition-all border border-white/10 group/btn"
                                            >
                                                {savingId === album.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4 group-hover/btn:text-secondary transition-colors" />}
                                                Salvar
                                            </button>

                                            <Link 
                                                href={`/admin/galeria/${album.id}`}
                                                className="flex items-center justify-center gap-2 bg-secondary hover:bg-[#bef264] text-primary font-black py-4 rounded-2xl transition-all shadow-md hover:shadow-glow"
                                            >
                                                <LayoutGrid className="w-4 h-4" />
                                                Fotos
                                            </Link>
                                        </div>

                                        {/* Actions: Appear only on card hover */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pt-2 border-t border-white/5">
                                            <button
                                                onClick={() => confirmDelete(album.id)}
                                                className="w-full text-red-400/40 hover:text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors py-2"
                                            >
                                                <Trash2 className="w-3 h-3" /> Excluir Registro Permanente
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {toastMsg && (
                <div className="fixed bottom-8 right-8 bg-primary border border-secondary text-white px-8 py-5 rounded-3xl shadow-2xl z-[100] animate-fade-in flex items-center gap-4">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    <span className="font-bold text-sm tracking-wide">{toastMsg}</span>
                </div>
            )}
        </div>
    );
}
