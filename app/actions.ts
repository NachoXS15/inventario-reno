'use server'

import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'
import type { Item, EgresoRecord } from './types'

const dataPath = path.join(process.cwd(), 'data', 'items.json')

export async function updateItem(
  id: string,
  data: Omit<Item, 'id' | 'prestado' | 'historialEgresos'>
) {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  const items: Item[] = JSON.parse(raw)
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return
  items[index] = { ...items[index], ...data }
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2), 'utf-8')
  revalidatePath('/')
}

export async function registrarEgreso(
  id: string,
  egreso: Omit<EgresoRecord, 'fechaDevolucion'>
) {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  const items: Item[] = JSON.parse(raw)
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return
  items[index] = {
    ...items[index],
    prestado: true,
    historialEgresos: [...items[index].historialEgresos, egreso],
  }
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2), 'utf-8')
  revalidatePath('/')
}

export async function registrarDevolucion(id: string, fechaDevolucion: string) {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  const items: Item[] = JSON.parse(raw)
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return
  const historial = [...items[index].historialEgresos]
  if (historial.length === 0) return
  historial[historial.length - 1] = { ...historial[historial.length - 1], fechaDevolucion }
  items[index] = { ...items[index], prestado: false, historialEgresos: historial }
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2), 'utf-8')
  revalidatePath('/')
}
