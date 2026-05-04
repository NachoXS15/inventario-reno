import type { Item, Contact, EgresoRecord } from './types'
import InventoryClient from './_components/InventoryClient'
import { supabaseServer } from '../lib/supabase'

export default async function Home() {
  const supabase = supabaseServer()

  const [{ data: itemsData }, { data: egresosData }, { data: contactsData }] = await Promise.all([
    supabase.from('items').select('*').order('nombre', { ascending: true }),
    supabase.from('egresos').select('*').order('seq', { ascending: true }),
    supabase.from('contacts').select('*').order('nombre', { ascending: true }),
  ])

  const items: Item[] = (itemsData ?? []).map((row) => ({
    id: row.id,
    nombre: row.nombre,
    categoria: row.categoria,
    descripcion: row.descripcion,
    estado: row.estado,
    ubicacion: row.ubicacion,
    prestado: row.prestado,
    historialEgresos: (egresosData ?? [])
      .filter((e) => e.item_id === row.id)
      .map((e): EgresoRecord => ({
        prestadoA: e.prestado_a,
        fechaEgreso: e.fecha_egreso,
        fechaDevolucionEstimada: e.fecha_devolucion_estimada,
        fechaDevolucion: e.fecha_devolucion ?? undefined,
        motivo: e.motivo,
      })),
  }))

  const contacts: Contact[] = (contactsData ?? []).map((row) => ({
    id: row.id,
    nombre: row.nombre,
    telefono: row.telefono,
    categoria: row.categoria,
  }))

  return <InventoryClient initialItems={items} initialContacts={contacts} />
}
