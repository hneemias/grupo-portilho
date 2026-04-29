'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, Globe, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function AdminConfig() {
    const [configs, setConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const supabase = createClient();

    // Standard keys we expect to have
    const expectedKeys = [
        { chave: 'footer_phone', label: 'WhatsApp / Telefone', icon: <Phone className="w-4 h-4" /> },
        { chave: 'footer_email', label: 'E-mail de Contato', icon: <Mail className="w-4 h-4" /> },
        { chave: 'footer_address', label: 'Endereço Completo', icon: <MapPin className="w-4 h-4" /> },
        { chave: 'wa_number', label: 'Número WhatsApp (Apenas dígitos)', icon: <Globe className="w-4 h-4" /> }
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
            setToastMsg('Configuração global salva!');
            setTimeout(() => setToastMsg(null), 2000);
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white/50" />
                </Link>
                <h1 className="text-3xl font-black text-white">Configurações <span className="text-[#a3e635]">Globais</span></h1>
            </div>

            <p className="text-white/50 mb-8 max-w-2xl">Ajuste os dados que aparecem no rodapé e nos botões de contato em todo o site.</p>

            {loading ? (
                <div className="text-white/30 font-bold animate-pulse">Carregando portal...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {expectedKeys.map((item) => {
                        const currentVal = configs.find(c => c.chave === item.chave)?.valor || "";
                        return (
                            <div key={item.chave} className="bg-[#051c36] border border-white/5 p-8 rounded-3xl shadow-xl flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-[#a3e635] mb-2">
                                    {item.icon}
                                    <label className="text-xs uppercase tracking-widest font-black">{item.label}</label>
                                </div>
                                <textarea
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a3e635] outline-none resize-none font-medium text-lg"
                                    defaultValue={currentVal}
                                    rows={item.chave === 'footer_address' ? 3 : 1}
                                    onBlur={(e) => saveConfig(item.chave, e.target.value)}
                                />
                                <p className="text-[10px] text-white/20 italic">A alteração é salva automaticamente ao sair do campo.</p>
                            </div>
                        );
                    })}
                </div>
            )}
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
