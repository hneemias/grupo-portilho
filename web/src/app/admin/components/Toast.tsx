'use client';

import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'loading';
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        if (type !== 'loading') {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [type, duration, onClose]);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-[#a3e635]" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        loading: <Loader2 className="w-5 h-5 text-[#a3e635] animate-spin" />
    };

    const colors = {
        success: 'border-[#a3e635]',
        error: 'border-red-500/50',
        loading: 'border-[#a3e635]/50'
    };

    return (
        <div className={`fixed bottom-8 right-8 bg-[#051c36] border ${colors[type]} text-white px-8 py-5 rounded-3xl shadow-2xl z-[999] animate-fade-in flex items-center gap-4 min-w-[300px]`}>
            {icons[type]}
            <span className="font-bold text-sm tracking-wide flex-1">{message}</span>
            <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-4 h-4 text-white/20" />
            </button>
        </div>
    );
}
