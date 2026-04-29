'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, Server, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminSMTP() {
    const [configs, setConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const supabase = createClient();

    const smtpKeys = [
        { chave: 'smtp_host', label: 'Servidor SMTP', type: 'text', placeholder: 'smtp.exemplo.com' },
        { chave: 'smtp_port', label: 'Porta', type: 'number', placeholder: '587' },
        { chave: 'smtp_user', label: 'Usuário / E-mail', type: 'text', placeholder: 'contato@dominio.com' },
        { chave: 'smtp_pass', label: 'Senha / App Password', type: 'password', placeholder: '••••••••' },
        { chave: 'smtp_from', label: 'E-mail Remetente', type: 'text', placeholder: 'noreply@dominio.com' },
        { chave: 'smtp_to', label: 'E-mail Destino (Notificação)', type: 'text', placeholder: 'diretoria@dominio.com' },
    ];

    useEffect(() => {
        fetchConfigs();
    }, []);

    async function fetchConfigs() {
        setLoading(true);
        const { data } = await supabase.from('gp_configuracoes').select('*');
        if (data) setConfigs(data);
        setLoading(false);
    }

    async function saveConfig(chave: string, valor: string) {
        setSaving(true);
        const { error } = await supabase.from('gp_configuracoes').upsert({ chave, valor });
        setSaving(false);
        if (!error) {
            setToastMsg('Configuração salva!');
            setTimeout(() => setToastMsg(null), 2000);
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white/50" />
                </Link>
                <h1 className="text-4xl font-black text-white italic tracking-tighter">Configuração <span className="text-[#a3e635]">SMTP</span></h1>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-3xl mb-8 flex gap-4 items-start">
                <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
                <div>
                    <h3 className="text-yellow-500 font-bold mb-1">Cuidado com os dados sensíveis</h3>
                    <p className="text-white/50 text-sm">Estas informações são usadas para enviar notificações de novos leads por e-mail. Certifique-se de usar uma "Senha de App" caso seu provedor (Gmail/Outlook) exija.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse">Carregando parâmetros...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {smtpKeys.map((item) => {
                        const val = configs.find(c => c.chave === item.chave)?.valor || "";
                        return (
                            <div key={item.chave} className="bg-[#051c36] border border-white/5 p-6 rounded-3xl shadow-xl">
                                <label className="text-[10px] uppercase tracking-widest text-[#a3e635] font-black mb-2 block">{item.label}</label>
                                <input
                                    type={item.type}
                                    placeholder={item.placeholder}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a3e635] outline-none transition-all"
                                    defaultValue={val}
                                    onBlur={(e) => saveConfig(item.chave, e.target.value)}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-12 p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-[#a3e635]/10 rounded-2xl">
                        <ShieldCheck className="w-8 h-8 text-[#a3e635]" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xl">Notificações Ativas</h4>
                        <p className="text-white/30 text-sm">O sistema enviará disparos automáticos assim que o SMTP for validado.</p>
                    </div>
                </div>
                <button className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-2xl transition-all border border-white/10">
                    Testar Conexão (Beta)
                </button>
            </div>

            {/* TOAST NOTIFICATION */}
            {toastMsg && (
                <div className="fixed bottom-8 right-8 bg-[#051c36] border border-[#a3e635] text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-fade-in flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#a3e635] rounded-full animate-pulse" />
                    <span className="font-bold text-sm">{toastMsg}</span>
                </div>
            )}
        </div>
    );
}
