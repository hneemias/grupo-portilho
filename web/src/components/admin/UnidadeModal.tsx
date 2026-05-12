"use client";

import React, { useState, useEffect } from 'react';
import { X, MapPin, Building2, Map as MapIcon, Hash, Save } from 'lucide-react';

interface UnidadeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    unidade?: any; // Se estiver editando
}

export default function UnidadeModal({
    isOpen,
    onClose,
    onSave,
    unidade
}: UnidadeModalProps) {
    const [nome, setNome] = useState('');
    const [cidadeEstado, setCidadeEstado] = useState('');
    const [endereco, setEndereco] = useState('');
    const [ordem, setOrdem] = useState(0);
    const [loading, setLoading] = useState(false);

    // Sincronizar estado com a unidade selecionada
    const [prevUnidade, setPrevUnidade] = useState<any>(undefined);
    if (unidade !== prevUnidade) {
        setNome(unidade?.nome || '');
        setCidadeEstado(unidade?.cidade_estado || '');
        setEndereco(unidade?.endereco || '');
        setOrdem(unidade?.ordem || 0);
        setPrevUnidade(unidade);
    }

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ nome, cidade_estado: cidadeEstado, endereco, ordem });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#020b1a]/90 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-[#031428] border border-white/5 w-full max-w-2xl rounded-[2.5rem] p-12 shadow-2xl animate-in slide-in-from-bottom-10 duration-500 max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-glow">
                            <MapPin className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tight">
                            {unidade ? 'Editar Unidade' : 'Nova Unidade'}
                        </h3>
                    </div>
                    <p className="text-white/40 uppercase text-[10px] font-black tracking-[0.3em]">Gerenciamento de pontos de operação e logística</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Building2 className="w-3 h-3" />
                                Nome da Unidade
                            </label>
                            <input
                                type="text"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/10 text-sm font-bold"
                                placeholder="Ex: Armazém Unidade Matriz"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 px-1">
                                <MapIcon className="w-3 h-3" />
                                Cidade - UF
                            </label>
                            <input
                                type="text"
                                required
                                value={cidadeEstado}
                                onChange={(e) => setCidadeEstado(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/10 text-sm font-bold"
                                placeholder="Ex: Cariri - TO"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 px-1">
                            <MapPin className="w-3 h-3" />
                            Endereço Completo
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/10 text-sm font-bold resize-none"
                            placeholder="Rua, número, bairro, CEP..."
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2 px-1">
                            <Hash className="w-3 h-3" />
                            Ordem de Exibição
                        </label>
                        <input
                            type="number"
                            required
                            value={ordem}
                            onChange={(e) => setOrdem(parseInt(e.target.value))}
                            className="w-32 bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/10 text-sm font-bold"
                        />
                        <p className="text-[9px] text-white/20 font-medium">Define a posição no rodapé do site (menor número aparece primeiro).</p>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-secondary hover:bg-[#84cc16] text-primary font-black uppercase tracking-[0.2em] text-[11px] py-5 rounded-[1.5rem] transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>{unidade ? 'Salvar Alterações' : 'Cadastrar Unidade'}</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black uppercase tracking-[0.2em] text-[11px] py-5 rounded-[1.5rem] transition-all border border-white/5"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
