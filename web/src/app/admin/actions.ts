'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/admin/login?error=true')
    }

    revalidatePath('/', 'layout')
    redirect('/admin')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/admin/login')
}

export async function updatePassword(password: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password })
    
    if (error) return { success: false, error: error.message }
    return { success: true }
}

export async function getUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    // Buscar dados estendidos da tabela gp_perfis
    const { data: perfil } = await supabase
        .from('gp_perfis')
        .select('*')
        .eq('id', user.id)
        .single()

    return {
        id: user.id,
        email: user.email,
        role: perfil?.role || 'normal',
        status: perfil?.status || 'ativo'
    }
}

export async function getAdminUsers() {
    const supabase = await createClient()
    
    // Verificar se o usuário solicitante é super
    const profile = await getUserProfile()
    if (profile?.role !== 'super') {
        throw new Error('Acesso negado: Somente super usuários podem listar operadores.')
    }

    const { data, error } = await supabase
        .from('gp_perfis')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function toggleUserStatus(userId: string, currentStatus: string) {
    const supabase = await createClient()
    const newStatus = currentStatus === 'ativo' ? 'bloqueado' : 'ativo'

    const { error } = await supabase
        .from('gp_perfis')
        .update({ status: newStatus })
        .eq('id', userId)

    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/usuarios')
    return { success: true }
}

export async function deleteUser(userId: string) {
    const supabase = await createClient()
    
    // Verificar permissão
    const profile = await getUserProfile()
    if (profile?.role !== 'super') {
        throw new Error('Acesso negado: Somente super usuários podem remover operadores.')
    }

    const { error } = await supabase
        .from('gp_perfis')
        .delete()
        .eq('id', userId)

    if (error) return { success: false, error: error.message }
    
    // IMPORTANTE: Para deletar do Auth, precisaríamos de service_role. 
    // Por enquanto, deletamos apenas o perfil e bloqueamos o acesso se não houver service_role.
    
    revalidatePath('/admin/usuarios')
    return { success: true }
}
