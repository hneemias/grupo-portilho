import { login } from '../actions'

export default async function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
    const params = await searchParams;
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#031428] font-plus-jakarta px-4">
            <div className="w-full max-w-md p-8 rounded-3xl bg-[#020b1a] shadow-2xl border border-white/5">

                <div className="flex flex-col items-center mb-8">
                    <img src="/assets/img/logo_gp.png" alt="Grupo Portilho" className="h-12 w-auto mb-4" />
                    <p className="text-white/50 text-sm tracking-widest uppercase font-bold text-center">Acesso Corporativo</p>
                </div>

                <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-white/80 font-bold" htmlFor="email">
                            Email Institucional
                        </label>
                        <input
                            className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-secondary transition-colors"
                            name="email"
                            placeholder="diretoria@grupoportilho.com.br"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-white/80 font-bold" htmlFor="password">
                            Chave de Segurança (JWT Auth)
                        </label>
                        <input
                            className="rounded-xl px-4 py-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-secondary transition-colors"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        formAction={login}
                        className="bg-secondary text-primary text-lg font-bold rounded-xl px-4 py-3 mt-4 hover:scale-[1.02] transition-transform"
                    >
                        Autenticar Sessão
                    </button>

                    {params?.error && (
                        <p className="mt-4 p-4 bg-red-900/40 text-red-400 text-sm text-center border border-red-500/20 rounded-xl">
                            Erro: Credenciais inválidas ou sem autorização.
                        </p>
                    )}
                </form>

            </div>
        </div>
    )
}
