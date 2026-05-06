"use client";

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ModalConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ModalConfirm({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = 'danger'
}: ModalConfirmProps) {
    if (!isOpen) return null;

    const colors = {
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        warning: 'bg-yellow-500 hover:bg-yellow-600 text-black',
        info: 'bg-secondary hover:bg-[#84cc16] text-primary'
    };

    const iconColors = {
        danger: 'text-red-400 bg-red-400/10',
        warning: 'text-yellow-400 bg-yellow-400/10',
        info: 'text-secondary bg-secondary/10'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#020b1a]/90 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-[#031428] border border-white/5 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-glow ${iconColors[variant]}`}>
                        <AlertTriangle className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-2xl font-black text-white tracking-tight mb-3">
                        {title}
                    </h3>
                    
                    <p className="text-white/40 text-sm leading-relaxed mb-10">
                        {description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl active:scale-95 ${colors[variant]}`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all border border-white/5"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
