"use client";

import React, { useState, createContext, useContext } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
    id: string;
    type: ToastType;
    title: string;
    message: string;
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message: string) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = (type: ToastType, title: string, message: string) => {
        const id = `toast-${toastCounter++}`;
        setToasts((prev) => [...prev, { id, type, title, message }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const success = (title: string, message: string = '') => showToast('success', title, message);
    const error = (title: string, message: string = '') => showToast('error', title, message);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, success, error }}>
            {children}
            <div className="fixed bottom-10 right-10 z-[200] flex flex-col gap-4 w-full max-w-sm">
                {toasts.map((toast) => (
                    <div 
                        key={toast.id}
                        className="bg-[#031428] border border-white/5 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-right-10 duration-300 flex items-start gap-4 relative overflow-hidden group"
                    >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                            toast.type === 'success' ? 'bg-secondary' : 
                            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            toast.type === 'success' ? 'bg-secondary/10 text-secondary' : 
                            toast.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                            {toast.type === 'info' && <Info className="w-5 h-5" />}
                        </div>

                        <div className="flex-1 pr-6">
                            <h5 className="text-white font-black text-[10px] uppercase tracking-widest mb-1">{toast.title}</h5>
                            <p className="text-white/40 text-xs font-medium leading-relaxed">{toast.message}</p>
                        </div>

                        <button 
                            onClick={() => removeToast(toast.id)}
                            className="absolute top-4 right-4 text-white/10 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
