import type { Item, Contact, EgresoRecord } from './types'
import InventoryClient from './_components/InventoryClient'
import { supabaseServer } from '../lib/supabase'
import { getUserTeam } from '../lib/get-user-team'

export default async function Home({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  const params = await searchParams
  const supabase = supabaseServer()
  const userTeam = await getUserTeam()

  const activeTeam: 'comunicacion' | 'mantenimiento' =
    userTeam === 'admin'
      ? params.team === 'mantenimiento' ? 'mantenimiento' : 'comunicacion'
      : (userTeam as 'comunicacion' | 'mantenimiento')

  const [{ data: itemsData }, { data: egresosData }, { data: contactsData }] = await Promise.all([
    supabase.from('items').select('*').eq('team', activeTeam).order('nombre', { ascending: true }),
    supabase.from('egresos').select('*').eq('team', activeTeam).order('seq', { ascending: true }),
    supabase.from('contacts').select('*').eq('team', activeTeam).order('nombre', { ascending: true }),
  ])

  const items: Item[] = (itemsData ?? []).map((row) => ({
    id: row.id,
    nombre: row.nombre,
    categoria: row.categoria,
    descripcion: row.descripcion,
    estado: row.estado,
    ubicacion: row.ubicacion,
    prestado: row.prestado,
    cantidadTotal: row.cantidad_total ?? undefined,
    historialEgresos: (egresosData ?? [])
      .filter((e) => e.item_id === row.id)
      .map((e): EgresoRecord => ({
        prestadoA: e.prestado_a,
        fechaEgreso: e.fecha_egreso,
        fechaDevolucionEstimada: e.fecha_devolucion_estimada,
        fechaDevolucion: e.fecha_devolucion ?? undefined,
        motivo: e.motivo,
        cantidad: e.cantidad ?? undefined,
      })),
  }))

  const contacts: Contact[] = (contactsData ?? []).map((row) => ({
    id: row.id,
    nombre: row.nombre,
    telefono: row.telefono,
    categoria: row.categoria,
  }))

  return (
    <InventoryClient
      key={activeTeam}
      initialItems={items}
      initialContacts={contacts}
      userTeam={userTeam}
      activeTeam={activeTeam}
    />
  )
}
