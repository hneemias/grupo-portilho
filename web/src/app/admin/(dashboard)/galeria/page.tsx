'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, ChevronRight, Save, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function AdminAlbuns() {
    const [albuns, setAlbuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
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

    async function deleteAlbum(id: string) {
        if (!confirm("Isso excluirá permanentemente o álbum e todas as fotos dentro dele. Continuar?")) return;
        
        const { error } = await supabase.from('gp_albuns').delete().eq('id', id);
        if (!error) setAlbuns(albuns.filter(a => a.id !== id));
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
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white/50" />
                    </Link>
                    <h1 className="text-3xl font-black text-white">Gestão de <span className="text-[#a3e635]">Álbuns</span></h1>
                </div>

                <button
                    onClick={addAlbum}
                    className="flex items-center gap-2 bg-[#a3e635] text-[#051c36] font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-lg"
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
                            <div key={album.id} className="group bg-[#051c36] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-[#a3e635]/30">
                                <div className="h-48 relative bg-black/20 overflow-hidden">
                                    {capaUrl ? (
                                        <img src={capaUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-white/10">
                                            <ImageIcon className="w-12 h-12 mb-2" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Sem fotos</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#051c36] to-transparent" />
                                    
                                    <div className="absolute bottom-6 left-8 flex items-center gap-2">
                                        <div className="bg-[#a3e635] text-[#051c36] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            {album.gp_galeria?.length || 0} fotos
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 pt-2">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Título do Álbum</label>
                                            <input
                                                id={`titulo-${album.id}`}
                                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-[#a3e635] outline-none transition-colors"
                                                defaultValue={album.titulo}
                                                placeholder="Digite o título do evento..."
                                            />
                                        </div>
                                        
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Descrição do Evento</label>
                                            <textarea
                                                id={`desc-${album.id}`}
                                                rows={2}
                                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm focus:border-[#a3e635] outline-none resize-none transition-colors"
                                                defaultValue={album.descricao}
                                                placeholder="Breve descrição do álbum..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <button 
                                                onClick={() => {
                                                    const t = (document.getElementById(`titulo-${album.id}`) as HTMLInputElement).value;
                                                    const d = (document.getElementById(`desc-${album.id}`) as HTMLTextAreaElement).value;
                                                    handleSave(album.id, t, d);
                                                }}
                                                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all border border-white/10"
                                            >
                                                {savingId === album.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                                Salvar
                                            </button>

                                            <Link 
                                                href={`/admin/galeria/${album.id}`}
                                                className="flex items-center justify-center gap-2 bg-[#a3e635] hover:bg-[#bef264] text-[#051c36] font-black py-3 rounded-xl transition-all shadow-md"
                                            >
                                                <LayoutGrid className="w-4 h-4" />
                                                Fotos
                                            </Link>
                                        </div>

                                        <button
                                            onClick={() => deleteAlbum(album.id)}
                                            className="mt-2 text-red-400/40 hover:text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" /> Excluir Álbum Permanentemente
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {toastMsg && (
                <div className="fixed bottom-8 right-8 bg-[#051c36] border border-[#a3e635] text-white px-8 py-5 rounded-3xl shadow-2xl z-[100] animate-fade-in flex items-center gap-4">
                    <div className="w-2 h-2 bg-[#a3e635] rounded-full animate-pulse" />
                    <span className="font-bold text-sm tracking-wide">{toastMsg}</span>
                </div>
            )}
        </div>
    );
}
