'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ModalConfirmProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info';
}

export default function ModalConfirm({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "Confirmar", 
    cancelText = "Cancelar",
    type = 'danger'
}: ModalConfirmProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#051c36]/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#051c36] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 rounded-full ${type === 'danger' ? 'bg-red-500' : 'bg-[#a3e635]'}`} />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${type === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-[#a3e635]/10 text-[#a3e635]'}`}>
                        {type === 'danger' ? <AlertTriangle className="w-8 h-8" /> : <X className="w-8 h-8" />}
                    </div>

                    <h3 className="text-2xl font-black text-white mb-3">{title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-10">{message}</p>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-4 font-black rounded-2xl transition-all shadow-lg hover:scale-105 ${type === 'danger' ? 'bg-red-500 text-white' : 'bg-[#a3e635] text-[#051c36]'}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
