import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../actions'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    return (
        <div className="min-h-screen bg-[#031428] font-plus-jakarta text-white">
            {/* Top Navbar */}
            <header className="w-full bg-[#051c36] border-b border-white/5 py-4 px-8 flex justify-between items-center sticky top-0 z-50 shadow-xl">
                <div className="font-black text-2xl tracking-tighter flex items-center gap-1">
                    <span className="text-[#a3e635]">G</span>P <span className="text-sm font-medium text-white/50 tracking-widest uppercase ml-4 border-l border-white/10 pl-4">Portal B2B</span>
                </div>

                <div className="flex items-center gap-6">
                    <span className="text-sm text-white/50 hidden md:block">Logado como: <strong className="text-white">{user.email}</strong></span>
                    <form action={logout}>
                        <button type="submit" className="text-sm font-bold bg-white/5 hover:bg-red-500/20 text-white hover:text-red-400 px-4 py-2 rounded-xl transition-colors border border-white/5">
                            Sair / Logout
                        </button>
                    </form>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto p-4 lg:p-8">
                {children}
            </main>
        </div>
    )
}
