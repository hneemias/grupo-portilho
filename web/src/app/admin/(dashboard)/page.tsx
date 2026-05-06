import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Mail, Image as ImageIcon } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    return (
        <div className="animate-fade-in-up mt-8">
            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
                    Painel de <span className="text-secondary drop-shadow-[0_0_15px_rgba(162,225,37,0.3)]">Gestão</span>
                </h1>
                <p className="text-white/50 text-lg font-medium max-w-2xl">
                    Bem-vindo ao centro de comando operacional do Grupo Portilho. Gerencie infraestrutura, métricas e conexões.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Card: Mensagens / Leads - HIGHLIGHTED */}
                <div className="glass-card premium-border rounded-[2.5rem] p-8 shadow-premium flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Mail className="w-24 h-24 text-secondary" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                                <Mail className="w-5 h-5 text-secondary" />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-black text-secondary">Comunicação</span>
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-white">Leads e Mensagens</h3>
                        <p className="text-white/40 text-sm mb-8 leading-relaxed">Gestão centralizada de contatos, propostas e histórico de interações B2B.</p>
                    </div>
                    <Link href="/admin/mensagens" className="w-full py-4 bg-secondary text-primary text-center font-black rounded-2xl hover:shadow-glow transition-all">Ver Mensagens</Link>
                </div>

                {/* Card: Galeria - HIGHLIGHTED */}
                <div className="glass-card premium-border rounded-[2.5rem] p-8 shadow-premium flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                                <ImageIcon className="w-5 h-5 text-secondary" />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-black text-secondary">Mídia & Eventos</span>
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-white">Galerias e Álbuns</h3>
                        <p className="text-white/40 text-sm mb-8 leading-relaxed">Acervo visual de infraestrutura, safras e eventos corporativos.</p>
                    </div>
                    <Link href="/admin/galeria" className="w-full py-4 bg-secondary text-primary text-center font-black rounded-2xl hover:shadow-glow transition-all">Gerenciar Álbuns</Link>
                </div>

                {/* Card: Contatos Diretos - HIGHLIGHTED */}
                <div className="glass-card premium-border rounded-[2.5rem] p-8 shadow-premium flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                                <span className="font-black text-secondary text-xs">GP</span>
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-black text-secondary">Capital Humano</span>
                        </div>
                        <h3 className="text-2xl font-black mb-2 text-white">Contatos Diretos</h3>
                        <p className="text-white/40 text-sm mb-8 leading-relaxed">Administração da equipe de especialistas e canais diretos de atendimento.</p>
                    </div>
                    <Link href="/admin/contatos" className="w-full py-4 bg-secondary text-primary text-center font-black rounded-2xl hover:shadow-glow transition-all">Gerenciar Equipe</Link>
                </div>

                {/* Card: KPIs */}
                <div className="bg-surface/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-secondary/20 transition-all duration-300">
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-white">Métricas e KPIs</h3>
                        <p className="text-white/40 text-sm mb-6">Valores de Safra e dados operacionais.</p>
                    </div>
                    <Link href="/admin/kpis" className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/70 text-center font-bold rounded-xl transition-colors">Gerenciar</Link>
                </div>

                {/* Card: Mapas */}
                <div className="bg-surface/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-secondary/20 transition-all duration-300">
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-white">Cartografia</h3>
                        <p className="text-white/40 text-sm mb-6">Fazendas, matrizes e geolocalização.</p>
                    </div>
                    <Link href="/admin/mapa" className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/70 text-center font-bold rounded-xl transition-colors">Gerenciar</Link>
                </div>

                {/* Card: Depoimentos */}
                <div className="bg-surface/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-secondary/20 transition-all duration-300">
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-white">Depoimentos</h3>
                        <p className="text-white/40 text-sm mb-6">Gestão de provas sociais e avaliações.</p>
                    </div>
                    <Link href="/admin/depoimentos" className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/70 text-center font-bold rounded-xl transition-colors">Gerenciar</Link>
                </div>

                {/* Card: Configurações Globais */}
                <div className="bg-surface/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-secondary/20 transition-all duration-300">
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-white text-white/50">Configurações</h3>
                        <p className="text-white/30 text-sm mb-6 italic">Gerais e SMTP.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin/config" className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/50 text-center font-bold rounded-xl transition-colors">Geral</Link>
                        <Link href="/admin/smtp" className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/50 text-center font-bold rounded-xl transition-colors">SMTP</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
