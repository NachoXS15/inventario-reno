import fs from 'fs'
import path from 'path'
import type { Item } from './types'
import InventoryClient from './_components/InventoryClient'

export default function Home() {
  const dataPath = path.join(process.cwd(), 'data', 'items.json')
  const items: Item[] = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  return <InventoryClient initialItems={items} />
}
