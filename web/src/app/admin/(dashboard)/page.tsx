import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Mail } from 'lucide-react'

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
            <h1 className="text-4xl font-plus-jakarta font-medium text-white mb-2">Painel de <strong className="font-black text-[secondary]">Gestão</strong></h1>
            <p className="text-white/50 mb-12">Configure os depoimentos, métricas de atuação, malhas geográficas e gestão de leads.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Card: Mensagens / Leads */}
                <div className="bg-[#0b2545] border border-[secondary]/20 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:scale-[1.02] transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Mail className="w-20 h-20 text-[secondary]" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-2 text-white">Leads e Mensagens</h3>
                        <p className="text-white/50 text-sm mb-6">Veja quem entrou em contato pelo site, emails recebidos e status das conversas.</p>
                    </div>
                    <Link href="/admin/mensagens" className="w-full py-4 bg-[secondary] text-[primary] text-center font-black rounded-xl relative z-10">Ver Mensagens</Link>
                </div>

                {/* Card: Depoimentos */}
                <div className="bg-[primary] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:border-[secondary]/20 transition-colors">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Depoimentos</h3>
                        <p className="text-white/50 text-sm mb-6">Aprovar ou adicionar avaliações de clientes.</p>
                    </div>
                    <Link href="/admin/depoimentos" className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-center font-bold rounded-xl transition-colors">Gerenciar</Link>
                </div>

                {/* Card: KPIs */}
                <div className="bg-[primary] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:border-[secondary]/20 transition-colors">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Métricas e KPIs</h3>
                        <p className="text-white/50 text-sm mb-6">Atualize os valores de Safra, Áreas de Cobertura e dados operacionais de infraestrutura.</p>
                    </div>
                    <Link href="/admin/kpis" className="w-full py-4 bg-[secondary] text-[primary] text-center font-bold rounded-xl hover:scale-[1.02] transition-transform">Gerenciar Métricas</Link>
                </div>

                {/* Card: Mapas */}
                <div className="bg-[primary] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:border-[secondary]/20 transition-colors">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Cartografia (Lugares)</h3>
                        <p className="text-white/50 text-sm mb-6">Adicione novas fazendas ou matrizes com Latitude e Longitude para pinar no Mapa.</p>
                    </div>
                    <Link href="/admin/mapa" className="w-full py-4 bg-[secondary] text-[primary] text-center font-bold rounded-xl hover:scale-[1.02] transition-transform">Gerenciar Mapa</Link>
                </div>

                {/* Card: Configurações Globais */}
                <div className="bg-[primary] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:border-[secondary]/20 transition-colors">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Configurações Gerais</h3>
                        <p className="text-white/50 text-sm mb-6">Dados de rodapé, WhatsApp e endereços.</p>
                    </div>
                    <Link href="/admin/config" className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-center font-bold rounded-xl transition-colors">Configurar</Link>
                </div>

                {/* Card: SMTP */}
                <div className="bg-[primary] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:border-[secondary]/20 transition-colors">
                    <div>
                        <h3 className="text-xl font-bold mb-2">E-mail (SMTP)</h3>
                        <p className="text-white/50 text-sm mb-6">Configurações de disparo e notificações.</p>
                    </div>
                    <Link href="/admin/smtp" className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-center font-bold rounded-xl transition-colors">Configurar SMTP</Link>
                </div>

                {/* Card: Galeria */}
                <div className="bg-[#0b2545] border border-[secondary]/20 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:scale-[1.02] transition-all relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-2 text-white">Galerias e Álbuns</h3>
                        <p className="text-white/50 text-sm mb-6">Crie álbuns de eventos, festas de safra e aniversários. Gerencie fotos e capas.</p>
                    </div>
                    <Link href="/admin/galeria" className="w-full py-4 bg-[secondary] text-[primary] text-center font-black rounded-xl relative z-10">Gerenciar Álbuns</Link>
                </div>

                {/* Card: Parceiros */}
                <div className="bg-[primary] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:border-[secondary]/20 transition-colors">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Parceiros de Produção</h3>
                        <p className="text-white/50 text-sm mb-6">Gerencie as logos das empresas parceiras exibidas no site.</p>
                    </div>
                    <Link href="/admin/parceiros" className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-center font-bold rounded-xl transition-colors">Gerenciar Parceiros</Link>
                </div>

                {/* Card: Contatos Diretos */}
                <div className="bg-[#0b2545] border border-[secondary]/20 rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:scale-[1.02] transition-all relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-2 text-white">Contatos Diretos</h3>
                        <p className="text-white/50 text-sm mb-6">Adicione especialistas, vendedores e gestores com foto e WhatsApp direto para os clientes.</p>
                    </div>
                    <Link href="/admin/contatos" className="w-full py-4 bg-[secondary] text-[primary] text-center font-black rounded-xl relative z-10">Gerenciar Equipe</Link>
                </div>
            </div>
        </div>
    )
}
