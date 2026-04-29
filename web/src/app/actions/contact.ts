'use server';

import { createClient } from '@/lib/supabase/server';
import nodemailer from 'nodemailer';

export async function sendContactMessage(formData: FormData) {
    const nome = formData.get('nome') as string;
    const email = formData.get('email') as string;
    const assunto = formData.get('assunto') as string;
    const mensagem = formData.get('mensagem') as string;

    const supabase = await createClient();

    // 1. Salvar no Banco de Dados
    const { error: dbError } = await supabase.from('gp_mensagens').insert([
        { nome, email, assunto, mensagem }
    ]);

    if (dbError) {
        console.error('Erro ao salvar mensagem:', dbError);
        return { success: false, error: 'Erro ao processar sua mensagem. Tente novamente mais tarde.' };
    }

    // 2. Tentar disparar E-mail (SMTP)
    try {
        const { data: smtpConfigs } = await supabase.from('gp_configuracoes').select('*');

        const config = (key: string) => smtpConfigs?.find(c => c.chave === key)?.valor;

        const host = config('smtp_host');
        const port = parseInt(config('smtp_port') || '587');
        const user = config('smtp_user');
        const pass = config('smtp_pass');
        const from = config('smtp_from');
        const to = config('smtp_to');

        if (host && user && pass && to) {
            const transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
            });

            await transporter.sendMail({
                from: `"GP Portal B2B" <${from || user}>`,
                to,
                subject: `Novo Lead: ${assunto || 'Contato do Site'}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                        <h2 style="color: #031428;">Nova Mensagem Recebida</h2>
                        <p><strong>Nome:</strong> ${nome}</p>
                        <p><strong>E-mail:</strong> ${email}</p>
                        <p><strong>Assunto:</strong> ${assunto || 'Não informado'}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="white-space: pre-wrap;">${mensagem}</p>
                    </div>
                `,
            });
        }
    } catch (mailError) {
        console.error('Erro ao enviar e-mail SMTP:', mailError);
        // Não barramos o sucesso se o e-mail falhar, pois o lead já foi salvo no banco.
    }

    return { success: true };
}
