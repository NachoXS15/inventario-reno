'use server'

import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'
import type { Item } from './types'

const dataPath = path.join(process.cwd(), 'data', 'items.json')

export async function updateItem(id: string, data: Omit<Item, 'id'>) {
  const raw = fs.readFileSync(dataPath, 'utf-8')
  const items: Item[] = JSON.parse(raw)
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return
  items[index] = { id, ...data }
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2), 'utf-8')
  revalidatePath('/')
}
