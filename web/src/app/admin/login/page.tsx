import LoginForm from './LoginForm'

export default async function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
    const params = await searchParams;
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#031428] font-fira-sans px-4 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[150px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md p-10 rounded-[2.5rem] bg-[#020b1a]/80 backdrop-blur-2xl shadow-2xl border border-white/5 relative z-10 scale-in-center">
                <div className="flex flex-col items-center mb-10">
                    <img src="/assets/img/logo_gp.png" alt="Grupo Portilho" className="h-16 w-auto mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                    <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase font-black text-center">Ambiente Corporativo</p>
                </div>

                <LoginForm error={params?.error} />

                <div className="mt-12 flex justify-center opacity-30">
                    <img src="/assets/img/logo_gp_completo.png" alt="Grupo Portilho" className="h-8 w-auto grayscale" />
                </div>
            </div>
        </div>
    )
}
