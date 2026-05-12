"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { 
    MapPin, 
    Plus, 
    Search, 
    Pencil, 
    Trash2, 
    Map as MapIcon,
    ArrowUpDown,
    FilterX,
    Building2
} from 'lucide-react';
import { getUnidades, createUnidade, updateUnidade, deleteUnidade } from '../../actions';
import ModalConfirm from '@/components/admin/ModalConfirm';
import UnidadeModal from '@/components/admin/UnidadeModal';
import { useToast } from '@/components/ui/Toast';

export interface Unidade {
    id: string;
    nome: string;
    cidade_estado: string;
    endereco: string;
    ordem: number;
    created_at: string;
}

export default function UnidadesPage() {
    const { success, error: showError } = useToast();
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal States
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isUnidadeModalOpen, setIsUnidadeModalOpen] = useState(false);
    const [selectedUnidade, setSelectedUnidade] = useState<Unidade | null>(null);
    const [unidadeToDelete, setUnidadeToDelete] = useState<string | null>(null);

    const loadUnidades = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUnidades();
            setUnidades(data as Unidade[]);
        } catch (err) {
            console.error(err);
            showError('Falha ao carregar unidades');
        } finally {
            setLoading(false);
        }
    }, [showError]);

    useEffect(() => {
        loadUnidades();
    }, [loadUnidades]);

    async function confirmDelete(id: string) {
        setUnidadeToDelete(id);
        setIsConfirmOpen(true);
    }

    async function handleDeleteExecute() {
        if (!unidadeToDelete) return;
        
        const result = await deleteUnidade(unidadeToDelete);
        if (result.success) {
            success('Unidade removida com sucesso!');
            loadUnidades();
        } else {
            showError('Erro ao remover unidade.');
        }
        setIsConfirmOpen(false);
    }

    async function handleSaveUnidade(data: any) {
        let result;
        if (selectedUnidade) {
            result = await updateUnidade(selectedUnidade.id, data);
        } else {
            result = await createUnidade(data);
        }

        if (result.success) {
            success(selectedUnidade ? 'Unidade atualizada!' : 'Nova unidade cadastrada!');
            loadUnidades();
            setIsUnidadeModalOpen(false);
        } else {
            showError(result.error || 'Ocorreu um erro.');
        }
    }

    const filteredUnidades = unidades.filter(u => 
        u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.cidade_estado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* HEADER PRO MAX */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Nossas Unidades</h1>
                    <p className="text-white/40 uppercase text-[10px] font-black tracking-[0.3em] mt-1">Gestão de Infraestrutura e Pontos Estratégicos</p>
                </div>
                <button 
                    onClick={() => { setSelectedUnidade(null); setIsUnidadeModalOpen(true); }}
                    className="bg-secondary hover:bg-[#84cc16] text-primary font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Unidade</span>
                </button>
            </div>

            {/* FILTROS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-[2rem]">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome ou cidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:outline-none focus:border-secondary/30 transition-all placeholder:text-white/10 text-sm font-bold"
                    />
                </div>
            </div>

            {/* TABELA PREMIUM */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            <th className="px-10 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown className="w-3 h-3" />
                                    Ordem
                                </div>
                            </th>
                            <th className="px-10 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Unidade</th>
                            <th className="px-10 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Localização</th>
                            <th className="px-10 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-10 py-8">
                                        <div className="h-4 bg-white/5 rounded-full w-48" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredUnidades.length > 0 ? (
                            filteredUnidades.map((unidade) => (
                                <tr key={unidade.id} className="group hover:bg-white/[0.02] transition-all duration-300 relative">
                                    <td className="px-10 py-8">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                            <span className="text-secondary font-black text-xs">{unidade.ordem}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-secondary/20 transition-all shadow-inner">
                                                <Building2 className="w-5 h-5 text-white/20 group-hover:text-secondary transition-colors" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors tracking-tight">
                                                    {unidade.nome}
                                                </span>
                                                <span className="text-[10px] text-white/30 font-medium line-clamp-1 max-w-xs">
                                                    {unidade.endereco}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2">
                                            <MapIcon className="w-4 h-4 text-secondary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">
                                                {unidade.cidade_estado}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                            <button 
                                                onClick={() => { setSelectedUnidade(unidade); setIsUnidadeModalOpen(true); }}
                                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-white/40 hover:text-secondary transition-all shadow-xl" 
                                                title="Editar Unidade"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => confirmDelete(unidade.id)}
                                                className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl border border-white/5 text-white/40 hover:text-red-400 transition-all shadow-xl" 
                                                title="Remover Unidade"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-10 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 mb-2 shadow-inner">
                                            <FilterX className="w-10 h-10 text-white/10" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white/40 tracking-tight">Nenhuma unidade encontrada</h3>
                                        <button 
                                            onClick={() => setSearchTerm('')}
                                            className="text-secondary font-black text-[10px] uppercase tracking-[0.3em] hover:underline hover:text-[#84cc16] transition-colors"
                                        >
                                            Limpar filtros
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODALS */}
            <ModalConfirm 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteExecute}
                title="Remover Unidade"
                description="Tem certeza que deseja remover esta unidade? Ela deixará de ser exibida no rodapé do site imediatamente."
                confirmText="Remover Unidade"
            />

            <UnidadeModal 
                isOpen={isUnidadeModalOpen}
                onClose={() => setIsUnidadeModalOpen(false)}
                onSave={handleSaveUnidade}
                unidade={selectedUnidade}
            />
        </div>
    );
}
