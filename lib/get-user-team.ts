import { createAuthClient } from './supabase-auth'
import { supabaseServer } from './supabase'
import type { Team } from '../app/types'

export async function getUserTeam(): Promise<Team> {
  const authClient = await createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const supabase = supabaseServer()
  const { data } = await supabase.from('profiles').select('team').eq('id', user.id).single()
  return (data?.team as Team) ?? 'comunicacion'
}
