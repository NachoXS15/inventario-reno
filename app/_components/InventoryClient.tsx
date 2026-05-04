'use client'

import { useState, useTransition } from 'react'
import type { Item, Contact } from '../types'
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
import { ContactsTab } from './ContactsTab'
import { ESTADO, UBICACION, type InfoFormData, type EgresoFormData, type DevolucionFormData } from './constants'

export default function InventoryClient({
  initialItems,
  initialContacts,
}: {
  initialItems: Item[]
  initialContacts: Contact[]
}) {
  const [items, setItems] = useState(initialItems)
  const [contacts, setContacts] = useState(initialContacts)
  const [activeMainTab, setActiveMainTab] = useState<'oficina' | 'fuera' | 'contactos'>('oficina')
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterUbicacion, setFilterUbicacion] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
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
    startTransition(async () => { await registrarEgreso(selectedItem.id, data) })
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
    startTransition(async () => { await addContact(data) })
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
      <Header />

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">

        {/* Main tabs */}
        <div className="flex border-b border-zinc-200">
          {(['oficina', 'fuera'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
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
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
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
              <div className="mt-3 flex gap-3">
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#912ac8] focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  <option value="">Estado</option>
                  {Object.entries(ESTADO).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={filterUbicacion}
                  onChange={(e) => setFilterUbicacion(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#912ac8] focus:outline-none focus:ring-2 focus:ring-zinc-200"
                >
                  <option value="">Ubicación</option>
                  {Object.entries(UBICACION).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[#912ac8] focus:outline-none focus:ring-2 focus:ring-zinc-200"
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

            {/* Item list */}
            <section>
              <div className="space-y-3">
                {filtered.length === 0 ? (
                  <p className="py-16 text-center text-sm text-zinc-400">No se encontraron elementos.</p>
                ) : (
                  filtered.map((item) => (
                    <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                  ))
                )}
              </div>
            </section>
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
    </div>
  )
}
