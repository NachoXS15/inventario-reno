'use server'

import { revalidatePath } from 'next/cache'
import type { Item, EgresoRecord, Contact } from './types'
import { supabaseServer } from '../lib/supabase'

export async function updateItem(
  id: string,
  data: Omit<Item, 'id' | 'prestado' | 'historialEgresos'>
) {
  const supabase = supabaseServer()
  await supabase.from('items').update({
    nombre: data.nombre,
    categoria: data.categoria,
    descripcion: data.descripcion,
    estado: data.estado,
    ubicacion: data.ubicacion,
    cantidad_total: data.cantidadTotal ?? null,
  }).eq('id', id)
  revalidatePath('/')
}

export async function registrarEgreso(
  id: string,
  egreso: Omit<EgresoRecord, 'fechaDevolucion'>,
  team: 'comunicacion' | 'mantenimiento'
) {
  const supabase = supabaseServer()
  const cantidad = egreso.cantidad ?? 1

  await supabase.from('egresos').insert({
    item_id: id,
    prestado_a: egreso.prestadoA,
    fecha_egreso: egreso.fechaEgreso,
    fecha_devolucion_estimada: egreso.fechaDevolucionEstimada,
    motivo: egreso.motivo,
    cantidad,
    team,
  })

  const { data: item } = await supabase
    .from('items')
    .select('cantidad_total')
    .eq('id', id)
    .single()

  if (item?.cantidad_total) {
    const { data: active } = await supabase
      .from('egresos')
      .select('cantidad')
      .eq('item_id', id)
      .is('fecha_devolucion', null)
    const totalPrestado = (active ?? []).reduce((s, e) => s + (e.cantidad ?? 1), 0)
    if (totalPrestado >= item.cantidad_total) {
      await supabase.from('items').update({ prestado: true }).eq('id', id)
    }
  } else {
    await supabase.from('items').update({ prestado: true }).eq('id', id)
  }

  revalidatePath('/')
}

export async function registrarDevolucion(id: string, fechaDevolucion: string) {
  const supabase = supabaseServer()

  const { data: latest } = await supabase
    .from('egresos')
    .select('id')
    .eq('item_id', id)
    .is('fecha_devolucion', null)
    .order('seq', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!latest) return

  await supabase.from('egresos').update({ fecha_devolucion: fechaDevolucion }).eq('id', latest.id)

  const { data: remaining } = await supabase
    .from('egresos')
    .select('id')
    .eq('item_id', id)
    .is('fecha_devolucion', null)

  if (!remaining || remaining.length === 0) {
    await supabase.from('items').update({ prestado: false }).eq('id', id)
  }

  revalidatePath('/')
}

export async function addContact(
  data: Omit<Contact, 'id'>,
  team: 'comunicacion' | 'mantenimiento'
) {
  const supabase = supabaseServer()
  await supabase.from('contacts').insert({
    nombre: data.nombre,
    telefono: data.telefono,
    categoria: data.categoria,
    team,
  })
  revalidatePath('/')
}

export async function updateContact(id: string, data: Omit<Contact, 'id'>) {
  const supabase = supabaseServer()
  await supabase.from('contacts').update({
    nombre: data.nombre,
    telefono: data.telefono,
    categoria: data.categoria,
  }).eq('id', id)
  revalidatePath('/')
}

export async function deleteContact(id: string) {
  const supabase = supabaseServer()
  await supabase.from('contacts').delete().eq('id', id)
  revalidatePath('/')
}

export async function addItem(
  data: Omit<Item, 'id' | 'prestado' | 'historialEgresos'>,
  team: 'comunicacion' | 'mantenimiento'
) {
  const supabase = supabaseServer()
  await supabase.from('items').insert({
    nombre: data.nombre,
    categoria: data.categoria,
    descripcion: data.descripcion,
    estado: data.estado,
    ubicacion: data.ubicacion,
    cantidad_total: data.cantidadTotal ?? null,
    prestado: false,
    team,
  })
  revalidatePath('/')
}
