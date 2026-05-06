'use client';

import { useState, useEffect, use, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Upload, Trash2, Star, ExternalLink, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { compressImage } from '@/lib/utils/image';

export default function AdminAlbumDetalhe({ params }: { params: Promise<{ albumId: string }> }) {
    const { albumId } = use(params);
    const [album, setAlbum] = useState<any>(null);
    const [fotos, setFotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchAlbumDetails();
    }, [albumId]);

    async function fetchAlbumDetails() {
        setLoading(true);
        const { data: albumData } = await supabase.from('gp_albuns').select('*').eq('id', albumId).single();
        if (albumData) setAlbum(albumData);

        const { data: fotosData } = await supabase
            .from('gp_galeria')
            .select('*')
            .eq('album_id', albumId)
            .order('is_capa', { ascending: false })
            .order('created_at', { ascending: false });
            
        if (fotosData) setFotos(fotosData);
        setLoading(false);
    }

    // Função para gerar Hash do arquivo (Digital Fingerprint)
    async function calculateHash(file: File): Promise<string> {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setProgress({ current: 0, total: files.length });
        const validFormats = ['image/jpeg', 'image/jpg', 'image/png'];
        let successCount = 0;
        let duplicateCount = 0;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setProgress(prev => ({ ...prev, current: i + 1 }));

            if (!validFormats.includes(file.type)) continue;

            // 1. Verificar Duplicidade via Hash
            const fileHash = await calculateHash(file);
            const { data: existing } = await supabase
                .from('gp_galeria')
                .select('id')
                .eq('hash', fileHash)
                .eq('album_id', albumId) // Verifica duplicado apenas NESTE álbum
                .maybeSingle();

            if (existing) {
                duplicateCount++;
                continue;
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${albumId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // 2. Compressão Dinâmica (NOVO!)
            const compressedFile = await compressImage(file);

            // 3. Upload com Retry
            const uploadWithRetry = async (retries = 3): Promise<string | null> => {
                for (let attempt = 1; attempt <= retries; attempt++) {
                    try {
                        const { error: uploadError } = await supabase.storage
                            .from('galeria')
                            .upload(fileName, compressedFile); // Enviando o arquivo comprimido
                        if (uploadError) throw uploadError;
                        
                        const { data: { publicUrl } } = supabase.storage
                            .from('galeria')
                            .getPublicUrl(fileName);
                        return publicUrl;
                    } catch (err: any) {
                        if (attempt === retries) return null;
                        await new Promise(res => setTimeout(res, 1000 * attempt));
                    }
                }
                return null;
            };

            const publicUrl = await uploadWithRetry();

            if (publicUrl) {
                await supabase.from('gp_galeria').insert([{
                    album_id: albumId,
                    url: publicUrl,
                    legenda: "",
                    hash: fileHash,
                    is_capa: fotos.length === 0 && successCount === 0
                }]);
                successCount++;
            }
        }

        setUploading(false);
        let msg = `${successCount} novas fotos adicionadas.`;
        if (duplicateCount > 0) msg += ` ${duplicateCount} já existiam no álbum.`;
        setToastMsg(msg);
        fetchAlbumDetails();
        setTimeout(() => setToastMsg(null), 4000);
    };

    async function deleteFoto(foto: any) {
        const path = foto.url.split('/galeria/').pop();
        if (path) await supabase.storage.from('galeria').remove([path]);
        const { error } = await supabase.from('gp_galeria').delete().eq('id', foto.id);
        if (!error) setFotos(fotos.filter(f => f.id !== foto.id));
    }

    async function setCapa(id: string) {
        await supabase.from('gp_galeria').update({ is_capa: false }).eq('album_id', albumId);
        await supabase.from('gp_galeria').update({ is_capa: true }).eq('id', id);
        setFotos(fotos.map(f => ({ ...f, is_capa: f.id === id })));
    }

    async function updateLegenda(id: string, legenda: string) {
        await supabase.from('gp_galeria').update({ legenda }).eq('id', id);
        setToastMsg('Legenda salva!');
        setTimeout(() => setToastMsg(null), 1500);
    }

    const progressPercentage = (progress.current / progress.total) * 100;

    return (
        <div className="animate-fade-in pb-20">
            {/* PROGRESS OVERLAY */}
            {uploading && (
                <div className="fixed inset-0 bg-[#051c36]/90 backdrop-blur-xl z-[200] flex items-center justify-center p-8">
                    <div className="w-full max-w-md bg-[#051c36] border border-white/10 rounded-[3rem] p-10 shadow-2xl text-center">
                        <Loader2 className="w-12 h-12 text-[#a3e635] animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-white mb-2">Processando Fotos</h2>
                        <p className="text-white/40 text-sm mb-8">Enviando {progress.current} de {progress.total} arquivos...</p>
                        
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                            <div 
                                className="h-full bg-[#a3e635] transition-all duration-300 shadow-[0_0_15px_rgba(163,230,53,0.5)]" 
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <span className="text-[#a3e635] font-black text-xs uppercase tracking-widest">{Math.round(progressPercentage)}% concluído</span>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <Link href="/admin/galeria" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white/50" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white">Álbum: <span className="text-[#a3e635]">{album?.titulo}</span></h1>
                        <p className="text-white/40 text-sm">{album?.descricao}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <input type="file" multiple accept=".jpg,.jpeg,.png" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 bg-[#a3e635] text-[#051c36] font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                    >
                        <Upload className="w-5 h-5" />
                        Fazer Upload de Fotos
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse text-center py-20 uppercase tracking-widest">Carregando fotos do álbum...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {fotos.map((foto) => (
                        <div key={foto.id} className={`bg-[#051c36] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all group ${foto.is_capa ? 'ring-2 ring-[#a3e635] border-transparent' : ''}`}>
                            <div className="h-56 relative overflow-hidden bg-black/20">
                                <img src={foto.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <a href={foto.url} target="_blank" className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md">
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                    <button onClick={() => deleteFoto(foto)} className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 backdrop-blur-md">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                {foto.is_capa && (
                                    <div className="absolute top-6 right-6 bg-[#a3e635] text-[#051c36] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        Capa Ativa
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-black">Legenda da Foto</label>
                                    <input
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#a3e635] outline-none transition-colors"
                                        placeholder="Clique para adicionar legenda..."
                                        defaultValue={foto.legenda}
                                        onBlur={(e) => updateLegenda(foto.id, e.target.value)}
                                    />
                                </div>

                                {!foto.is_capa && (
                                    <button
                                        onClick={() => setCapa(foto.id)}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl text-xs font-black transition-all"
                                    >
                                        <Star className="w-4 h-4" /> Definir como Capa
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {fotos.length === 0 && !uploading && (
                        <div className="col-span-full text-center py-32 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5">
                            <ImageIcon className="w-16 h-16 text-white/5 mx-auto mb-6" />
                            <p className="text-white/20 font-bold uppercase tracking-widest text-sm">Este álbum ainda está vazio.<br/>Selecione suas fotos no botão acima.</p>
                        </div>
                    )}
                </div>
            )}

            {toastMsg && (
                <div className="fixed bottom-8 right-8 bg-[#051c36] border border-[#a3e635] text-white px-8 py-5 rounded-3xl shadow-2xl z-[100] animate-fade-in flex items-center gap-4">
                    {toastMsg.includes('Erro') ? <AlertCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-[#a3e635]" />}
                    <span className="font-bold text-sm tracking-wide">{toastMsg}</span>
                </div>
            )}
        </div>
    );
}
