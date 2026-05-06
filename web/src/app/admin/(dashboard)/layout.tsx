import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout, getUserProfile } from '../actions'
import { LogOut, User as UserIcon, Shield, Users, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { ToastProvider } from '@/components/ui/Toast'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) redirect('/admin/login')

    const { data: perfil, error: perfilError } = await supabase
        .from('gp_perfis')
        .select('*')
        .eq('id', user.id)
        .single()
    
    if (perfilError) {
        console.error('ERRO AO BUSCAR PERFIL:', {
            error: perfilError,
            userId: user.id
        });
    }

    const profile = {
        id: user.id,
        email: user.email,
        role: (user.email === 'hneemias.barbosa@gmail.com' ? 'super' : (perfil?.role || 'normal')),
        status: (user.email === 'hneemias.barbosa@gmail.com' ? 'ativo' : (perfil?.status || 'ativo'))
    }

    if (profile.status === 'bloqueado') {
        await supabase.auth.signOut()
        redirect('/admin/login?error=blocked')
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-[#031428] font-fira-sans text-white">
                {/* Top Navbar PRO MAX */}
                <header className="w-full bg-[#020b1a]/80 backdrop-blur-xl border-b border-white/5 py-5 px-8 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
                    <div className="flex items-center gap-6">
                        <img src="/assets/img/logo_gp.png" alt="Grupo Portilho" className="h-9 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                        <div className="hidden sm:flex flex-col border-l border-white/10 pl-6">
                            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Portal B2B</span>
                            <span className="text-[9px] font-medium text-white/20 uppercase tracking-[0.2em]">Ambiente Administrativo</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* User Profile Card */}
                        <div className="hidden md:flex items-center gap-4 bg-white/[0.03] border border-white/5 px-5 py-2.5 rounded-[1.25rem] hover:bg-white/[0.05] transition-all group">
                            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-glow group-hover:scale-105 transition-transform">
                                <span className="text-secondary font-black text-xs font-mono">{profile.email?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase font-black tracking-widest text-white/20 mb-0.5">
                                    {profile.role === 'super' ? 'Diretor de Sistemas' : `Operador (ID: ${profile.id.substring(0,8)}...)`}
                                </span>
                                <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors tracking-tight">{profile.email}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 p-1 rounded-2xl">
                            <Link href="/admin" title="Painel Geral" className="p-3 text-white/40 hover:text-secondary hover:bg-white/5 rounded-xl transition-all">
                                <LayoutDashboard className="w-5 h-5" />
                            </Link>
                            <Link href="/admin/perfil" title="Minha Segurança" className="p-3 text-white/40 hover:text-secondary hover:bg-white/5 rounded-xl transition-all">
                                <Shield className="w-5 h-5" />
                            </Link>
                            {profile.role === 'super' && (
                                <Link href="/admin/usuarios" title="Gestão de Operadores" className="p-3 text-white/40 hover:text-secondary hover:bg-white/5 rounded-xl transition-all">
                                    <Users className="w-5 h-5" />
                                </Link>
                            )}
                        </div>

                        <form action={logout}>
                            <button type="submit" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-red-500/5 hover:bg-red-500 text-red-400 hover:text-white px-6 py-3.5 rounded-2xl transition-all border border-red-500/10 hover:border-red-500 shadow-lg group active:scale-95">
                                <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                <span className="hidden sm:inline">Sair</span>
                            </button>
                        </form>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto p-6 lg:p-10 min-h-[calc(100vh-200px)]">
                    {children}
                </main>

                {/* Footer PRO MAX */}
                <footer className="w-full bg-[#020b1a]/40 border-t border-white/5 py-12 px-8 mt-20 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <img
                                src="/assets/img/logo_gp_completo.png"
                                alt="Grupo Portilho"
                                className="h-14 w-auto opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            />
                            <div className="flex flex-col items-center md:items-start">
                                <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/10 mb-1">Sistema de Gestão de Elite</p>
                                <div className="h-0.5 w-12 bg-secondary/20 rounded-full" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-3">
                            <div className="flex gap-6 mb-2">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Infraestrutura</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Segurança</span>
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Performance</span>
                            </div>
                            <div className="flex flex-col items-center md:items-end">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-white/20 italic">© 2026 GRUPO PORTILHO. TODOS OS DIREITOS RESERVADOS.</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </ToastProvider>
    )
}
