'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Item, Contact, Team } from '../types'
import {
  updateItem,
  registrarEgreso,
  registrarDevolucion,
  addContact,
  updateContact,
  deleteContact,
} from '../actions'
import { Header } from './Header'
import { ItemCard } from './ItemCard'
import { Modal } from './Modal'
import { BulkEgresoPanel } from './BulkEgresoPanel'
import { BulkEgresoModal } from './BulkEgresoModal'
import { BulkDevolucionModal } from './BulkDevolucionModal'
import { ContactsTab } from './ContactsTab'
import { ESTADO, UBICACION, type InfoFormData, type EgresoFormData, type DevolucionFormData } from './constants'

export default function InventoryClient({
  initialItems,
  initialContacts,
  userTeam,
  activeTeam,
}: {
  initialItems: Item[]
  initialContacts: Contact[]
  userTeam: Team
  activeTeam: 'comunicacion' | 'mantenimiento'
}) {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [contacts, setContacts] = useState(initialContacts)
  const [activeMainTab, setActiveMainTab] = useState<'oficina' | 'fuera' | 'contactos'>('oficina')
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterUbicacion, setFilterUbicacion] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkItems, setBulkItems] = useState<Item[]>([])
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const [bulkDevMode, setBulkDevMode] = useState(false)
  const [bulkDevItems, setBulkDevItems] = useState<Item[]>([])
  const [bulkDevModalOpen, setBulkDevModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const enOficinaCount = items.filter((i) => !i.prestado).length
  const fueraCount = items.filter((i) => i.prestado).length
  const categorias = Array.from(new Set(items.map((i) => i.categoria))).sort()

  const tabItems = items.filter((i) =>
    activeMainTab === 'oficina' ? !i.prestado : i.prestado
  )

  const filtered = tabItems.filter((item) => {
    if (filterEstado && item.estado !== filterEstado) return false
    if (filterUbicacion && item.ubicacion !== filterUbicacion) return false
    if (filterCategoria && item.categoria !== filterCategoria) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const estadoLabel = ESTADO[item.estado]?.label ?? ''
    const ubicLabel = UBICACION[item.ubicacion]?.label ?? ''
    const prestadoALabel = item.historialEgresos.at(-1)?.prestadoA ?? ''
    return (
      item.nombre.toLowerCase().includes(q) ||
      item.categoria.toLowerCase().includes(q) ||
      item.descripcion.toLowerCase().includes(q) ||
      estadoLabel.toLowerCase().includes(q) ||
      ubicLabel.toLowerCase().includes(q) ||
      prestadoALabel.toLowerCase().includes(q)
    )
  })

  function switchTab(tab: 'oficina' | 'fuera' | 'contactos') {
    setActiveMainTab(tab)
    setSearch('')
    setFilterEstado('')
    setFilterUbicacion('')
    setFilterCategoria('')
    setBulkMode(false)
    setBulkItems([])
    setBulkDevMode(false)
    setBulkDevItems([])
  }

  function handleDropToBulk(itemId: string) {
    const item = items.find((i) => i.id === itemId)
    if (!item || item.prestado) return
    if (bulkItems.some((i) => i.id === itemId)) return
    setBulkItems((prev) => [...prev, item])
  }

  function handleRemoveFromBulk(itemId: string) {
    setBulkItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  function handleDropToBulkDev(itemId: string) {
    const item = items.find((i) => i.id === itemId)
    if (!item || !item.prestado) return
    if (bulkDevItems.some((i) => i.id === itemId)) return
    setBulkDevItems((prev) => [...prev, item])
  }

  function handleRemoveFromBulkDev(itemId: string) {
    setBulkDevItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  function handleBulkDevolucion(data: DevolucionFormData) {
    const itemsToProcess = [...bulkDevItems]
    setItems((prev) =>
      prev.map((i) => {
        if (!itemsToProcess.some((bi) => bi.id === i.id)) return i
        const historial = [...i.historialEgresos]
        historial[historial.length - 1] = { ...historial[historial.length - 1], ...data }
        return { ...i, prestado: false, historialEgresos: historial }
      })
    )
    setBulkDevItems([])
    setBulkDevModalOpen(false)
    setBulkDevMode(false)
    startTransition(async () => {
      for (const item of itemsToProcess) {
        await registrarDevolucion(item.id, data.fechaDevolucion)
      }
    })
  }

  function handleBulkEgreso(data: EgresoFormData) {
    const itemsToProcess = [...bulkItems]
    setItems((prev) =>
      prev.map((i) =>
        itemsToProcess.some((bi) => bi.id === i.id)
          ? { ...i, prestado: true, historialEgresos: [...i.historialEgresos, data] }
          : i
      )
    )
    setBulkItems([])
    setBulkModalOpen(false)
    setBulkMode(false)
    startTransition(async () => {
      for (const item of itemsToProcess) {
        await registrarEgreso(item.id, data, activeTeam)
      }
    })
  }

  function handleSaveInfo(data: InfoFormData) {
    if (!selectedItem) return
    setItems((prev) => prev.map((i) => (i.id === selectedItem.id ? { ...i, ...data } : i)))
    setSelectedItem(null)
    startTransition(async () => { await updateItem(selectedItem.id, data) })
  }

  function handleRegistrarEgreso(data: EgresoFormData) {
    if (!selectedItem) return
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id
          ? { ...i, prestado: true, historialEgresos: [...i.historialEgresos, data] }
          : i
      )
    )
    setSelectedItem(null)
    startTransition(async () => { await registrarEgreso(selectedItem.id, data, activeTeam) })
  }

  function handleRegistrarDevolucion(data: DevolucionFormData) {
    if (!selectedItem) return
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== selectedItem.id) return i
        const historial = [...i.historialEgresos]
        historial[historial.length - 1] = { ...historial[historial.length - 1], ...data }
        return { ...i, prestado: false, historialEgresos: historial }
      })
    )
    setSelectedItem(null)
    startTransition(async () => { await registrarDevolucion(selectedItem.id, data.fechaDevolucion) })
  }

  function handleAddContact(data: Omit<Contact, 'id'>) {
    setContacts((prev) => [...prev, { id: crypto.randomUUID(), ...data }])
    startTransition(async () => { await addContact(data, activeTeam) })
  }

  function handleUpdateContact(id: string, data: Omit<Contact, 'id'>) {
    setContacts((prev) => prev.map((c) => (c.id === id ? { id, ...data } : c)))
    startTransition(async () => { await updateContact(id, data) })
  }

  function handleDeleteContact(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id))
    startTransition(async () => { await deleteContact(id) })
  }

  const hasFilters = search || filterEstado || filterUbicacion || filterCategoria

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <Header activeTeam={activeTeam} />

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">

        {/* Admin team switcher */}
        {userTeam === 'admin' && (
          <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1 w-fit shadow-sm">
            <button
              onClick={() => router.push('/?team=comunicacion')}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTeam === 'comunicacion'
                  ? 'bg-[#912ac8] text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Comunicación
            </button>
            <button
              onClick={() => router.push('/?team=mantenimiento')}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTeam === 'mantenimiento'
                  ? 'bg-[#912ac8] text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              Mantenimiento
            </button>
          </div>
        )}

        {/* Main tabs */}
        <div className="flex overflow-x-auto border-b border-zinc-200">
          {(['oficina', 'fuera'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`whitespace-nowrap px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px sm:px-5 sm:py-3 sm:text-sm ${
                activeMainTab === tab
                  ? 'border-[#912ac8] text-[#912ac8]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {tab === 'oficina' ? `En la oficina (${enOficinaCount})` : `Fuera de la oficina (${fueraCount})`}
            </button>
          ))}
          <button
            onClick={() => switchTab('contactos')}
            className={`whitespace-nowrap px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px sm:px-5 sm:py-3 sm:text-sm ${
              activeMainTab === 'contactos'
                ? 'border-[#912ac8] text-[#912ac8]'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Contactos ({contacts.length})
          </button>
        </div>

        {activeMainTab !== 'contactos' && (
          <>
            {/* Search + filters */}
            <section>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  placeholder="Buscar por nombre, categoría, estado, ubicación…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#912ac8] focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#912ac8] focus:outline-none focus:ring-2 focus:ring-zinc-200 sm:flex-1"
                >
                  <option value="">Estado</option>
                  {Object.entries(ESTADO).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={filterUbicacion}
                  onChange={(e) => setFilterUbicacion(e.target.value)}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#912ac8] focus:outline-none focus:ring-2 focus:ring-zinc-200 sm:flex-1"
                >
                  <option value="">Ubicación</option>
                  {Object.entries(UBICACION).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className={`${!hasFilters ? 'col-span-2' : ''} rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#912ac8] focus:outline-none focus:ring-2 focus:ring-zinc-200 sm:flex-1`}
                >
                  <option value="">Categoría</option>
                  {categorias.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {hasFilters && (
                  <button
                    onClick={() => { setSearch(''); setFilterEstado(''); setFilterUbicacion(''); setFilterCategoria('') }}
                    className="shrink-0 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-700"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </section>

            {/* Bulk mode toggle */}
            {(activeMainTab === 'oficina' || activeMainTab === 'fuera') && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  {bulkMode && (bulkItems.length > 0
                    ? `${bulkItems.length} elemento${bulkItems.length !== 1 ? 's' : ''} seleccionado${bulkItems.length !== 1 ? 's' : ''}`
                    : 'Hacé clic o arrastrá para seleccionar')}
                  {bulkDevMode && (bulkDevItems.length > 0
                    ? `${bulkDevItems.length} elemento${bulkDevItems.length !== 1 ? 's' : ''} seleccionado${bulkDevItems.length !== 1 ? 's' : ''}`
                    : 'Hacé clic o arrastrá para seleccionar')}
                </span>
                {activeMainTab === 'oficina' && (
                  <button
                    onClick={() => { setBulkMode(!bulkMode); setBulkItems([]) }}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      bulkMode
                        ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                        : 'bg-[#912ac8]/10 text-[#912ac8] hover:bg-[#912ac8]/20'
                    }`}
                  >
                    {bulkMode ? 'Cancelar selección' : 'Egreso múltiple'}
                  </button>
                )}
                {activeMainTab === 'fuera' && (
                  <button
                    onClick={() => { setBulkDevMode(!bulkDevMode); setBulkDevItems([]) }}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      bulkDevMode
                        ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                        : 'bg-green-700/10 text-green-700 hover:bg-green-700/20'
                    }`}
                  >
                    {bulkDevMode ? 'Cancelar selección' : 'Devolución múltiple'}
                  </button>
                )}
              </div>
            )}

            {/* Item list + bulk panel */}
            <div className="flex items-start gap-4">
              <section className="min-w-0 flex-1">
                <div className="space-y-3">
                  {filtered.length === 0 ? (
                    <p className="py-16 text-center text-sm text-zinc-400">No se encontraron elementos.</p>
                  ) : (
                    filtered.map((item) => {
                      const inBulk = bulkItems.some((b) => b.id === item.id)
                      const inBulkDev = bulkDevItems.some((b) => b.id === item.id)
                      return (
                        <ItemCard
                          key={item.id}
                          item={item}
                          bulkMode={bulkMode}
                          bulkDevMode={bulkDevMode}
                          isInBulk={inBulk || inBulkDev}
                          onClick={
                            bulkMode && !item.prestado
                              ? () => (inBulk ? handleRemoveFromBulk(item.id) : handleDropToBulk(item.id))
                              : bulkMode && item.prestado
                              ? () => undefined
                              : bulkDevMode && item.prestado
                              ? () => (inBulkDev ? handleRemoveFromBulkDev(item.id) : handleDropToBulkDev(item.id))
                              : () => setSelectedItem(item)
                          }
                        />
                      )
                    })
                  )}
                </div>
              </section>

              {bulkMode && (
                <BulkEgresoPanel
                  items={bulkItems}
                  onDropItem={handleDropToBulk}
                  onRemoveItem={handleRemoveFromBulk}
                  onConfirmar={() => setBulkModalOpen(true)}
                  onCancel={() => { setBulkMode(false); setBulkItems([]) }}
                />
              )}

              {bulkDevMode && (
                <BulkEgresoPanel
                  items={bulkDevItems}
                  onDropItem={handleDropToBulkDev}
                  onRemoveItem={handleRemoveFromBulkDev}
                  onConfirmar={() => setBulkDevModalOpen(true)}
                  onCancel={() => { setBulkDevMode(false); setBulkDevItems([]) }}
                  title="Devolución múltiple"
                  confirmLabel="Registrar devolución"
                />
              )}
            </div>
          </>
        )}

        {activeMainTab === 'contactos' && (
          <ContactsTab
            contacts={contacts}
            onAdd={handleAddContact}
            onUpdate={handleUpdateContact}
            onDelete={handleDeleteContact}
          />
        )}
      </main>

      {selectedItem && (
        <Modal
          item={selectedItem}
          contacts={contacts}
          onClose={() => setSelectedItem(null)}
          onSaveInfo={handleSaveInfo}
          onRegistrarEgreso={handleRegistrarEgreso}
          onRegistrarDevolucion={handleRegistrarDevolucion}
          isPending={isPending}
        />
      )}

      {bulkModalOpen && (
        <BulkEgresoModal
          items={bulkItems}
          contacts={contacts}
          onClose={() => setBulkModalOpen(false)}
          onConfirmar={handleBulkEgreso}
          isPending={isPending}
        />
      )}

      {bulkDevModalOpen && (
        <BulkDevolucionModal
          items={bulkDevItems}
          onClose={() => setBulkDevModalOpen(false)}
          onConfirmar={handleBulkDevolucion}
          isPending={isPending}
        />
      )}
    </div>
  )
}
