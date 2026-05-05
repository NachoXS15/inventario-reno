'use server'

import { redirect } from 'next/navigation'
import { createAuthClient } from '../lib/supabase-auth'

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'Email o contraseña incorrectos.',
  'Email not confirmed': 'Confirmá tu email antes de ingresar.',
  'Too many requests': 'Demasiados intentos. Esperá unos minutos.',
}

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const supabase = await createAuthClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })
  if (error) return { error: ERROR_MESSAGES[error.message] ?? error.message }
  redirect('/')
}

export async function logout() {
  const supabase = await createAuthClient()
  await supabase.auth.signOut()
  redirect('/login')
}
