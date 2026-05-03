'use client'

import { useState, useTransition } from 'react'
import type { Item } from '../types'
import { updateItem } from '../actions'

const DISPONIBILIDAD: Record<string, { label: string; badge: string }> = {
  disponible:    { label: 'Disponible',    badge: 'bg-green-100 text-green-800 border-green-200' },
  en_uso:        { label: 'En uso',        badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  en_reparacion: { label: 'En reparación', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
  no_disponible: { label: 'No disponible', badge: 'bg-red-100 text-red-800 border-red-200' },
}

const UBICACION: Record<string, { label: string; badge: string }> = {
  oficina_principal: { label: 'Oficina principal', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
  sala_reuniones:    { label: 'Sala de reuniones',  badge: 'bg-purple-100 text-purple-800 border-purple-200' },
  deposito:          { label: 'Depósito',           badge: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
  recepcion:         { label: 'Recepción',          badge: 'bg-teal-100 text-teal-800 border-teal-200' },
  laboratorio:       { label: 'Laboratorio',        badge: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
}

const ASIGNADO = [
  { value: '',         label: 'Sin asignar' },
  { value: 'nacho',    label: 'Nacho' },
  { value: 'corcho',   label: 'Corcho' },
  { value: 'facu',     label: 'Facu' },
  { value: 'miqueas',  label: 'Miqueas' },
  { value: 'camilo',   label: 'Camilo' },
  { value: 'fabri',    label: 'Fabri' },
  { value: 'flor',     label: 'Flor' },
  { value: 'lore',     label: 'Lore' },
  { value: 'chueca',   label: 'Chueca' },
  { value: 'externos', label: 'Externos' },
]

type FormData = Omit<Item, 'id'>

function getAsignadoLabel(item: Item): string | null {
  if (!item.asignadoA) return null
  if (item.asignadoA === 'externos') {
    return item.externoNombre ? item.externoNombre : 'Externo'
  }
  return ASIGNADO.find((o) => o.value === item.asignadoA)?.label ?? null
}

function Badge({ config, value }: { config: Record<string, { label: string; badge: string }>; value: string }) {
  const entry = config[value]
  if (!entry) return null
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${entry.badge}`}>
      {entry.label}
    </span>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200'

function ItemCard({ item, onClick }: { item: Item; onClick: () => void }) {
  const asignadoLabel = getAsignadoLabel(item)

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <h2 className="truncate text-base font-semibold text-zinc-900">{item.nombre}</h2>
            <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
              {item.categoria}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-zinc-500">{item.descripcion}</p>
          {asignadoLabel && (
            <div className="mt-2 flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-zinc-400"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
              <span className="text-xs text-zinc-400">Tiene: <span className="font-medium text-zinc-600">{asignadoLabel}</span></span>
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge config={DISPONIBILIDAD} value={item.disponibilidad} />
          <Badge config={UBICACION} value={item.ubicacion} />
        </div>
      </div>
    </div>
  )
}

function Modal({
  formData,
  onChange,
  onSave,
  onClose,
  isPending,
}: {
  formData: FormData
  onChange: (data: FormData) => void
  onSave: () => void
  onClose: () => void
  isPending: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-900">Editar elemento</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <Field label="Nombre">
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => onChange({ ...formData, nombre: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Categoría">
              <input
                type="text"
                value={formData.categoria}
                onChange={(e) => onChange({ ...formData, categoria: e.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Descripción">
              <textarea
                value={formData.descripcion}
                onChange={(e) => onChange({ ...formData, descripcion: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>

            <Field label="Disponibilidad">
              <div className="flex items-center gap-3">
                <Badge config={DISPONIBILIDAD} value={formData.disponibilidad} />
                <select
                  value={formData.disponibilidad}
                  onChange={(e) => onChange({ ...formData, disponibilidad: e.target.value })}
                  className={`flex-1 ${inputClass}`}
                >
                  {Object.entries(DISPONIBILIDAD).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </Field>

            <Field label="Ubicación">
              <div className="flex items-center gap-3">
                <Badge config={UBICACION} value={formData.ubicacion} />
                <select
                  value={formData.ubicacion}
                  onChange={(e) => onChange({ ...formData, ubicacion: e.target.value })}
                  className={`flex-1 ${inputClass}`}
                >
                  {Object.entries(UBICACION).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </Field>

            <Field label="Asignado a">
              <select
                value={formData.asignadoA}
                onChange={(e) => {
                  const next = e.target.value
                  onChange({
                    ...formData,
                    asignadoA: next,
                    externoNombre: next !== 'externos' ? '' : formData.externoNombre,
                  })
                }}
                className={inputClass}
              >
                {ASIGNADO.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {formData.asignadoA === 'externos' && (
                <input
                  type="text"
                  placeholder="¿Quién lo tiene? (nombre del externo)"
                  value={formData.externoNombre}
                  onChange={(e) => onChange({ ...formData, externoNombre: e.target.value })}
                  className={`mt-2 ${inputClass}`}
                />
              )}
            </Field>
          </div>
        </div>

        <div className="flex gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={isPending}
            className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {isPending ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InventoryClient({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = items.filter((item) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const dispLabel = DISPONIBILIDAD[item.disponibilidad]?.label ?? ''
    const ubicLabel = UBICACION[item.ubicacion]?.label ?? ''
    const asigLabel = getAsignadoLabel(item) ?? ''
    return (
      item.nombre.toLowerCase().includes(q) ||
      item.categoria.toLowerCase().includes(q) ||
      item.descripcion.toLowerCase().includes(q) ||
      dispLabel.toLowerCase().includes(q) ||
      ubicLabel.toLowerCase().includes(q) ||
      asigLabel.toLowerCase().includes(q)
    )
  })

  function openModal(item: Item) {
    setSelectedItem(item)
    setFormData({
      nombre: item.nombre,
      categoria: item.categoria,
      disponibilidad: item.disponibilidad,
      descripcion: item.descripcion,
      ubicacion: item.ubicacion,
      asignadoA: item.asignadoA,
      externoNombre: item.externoNombre,
    })
  }

  function closeModal() {
    setSelectedItem(null)
    setFormData(null)
  }

  function handleSave() {
    if (!selectedItem || !formData) return
    setItems((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { id: item.id, ...formData } : item))
    )
    closeModal()
    startTransition(async () => {
      await updateItem(selectedItem.id, formData)
    })
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Inventario de Oficina</h1>
            <p className="mt-0.5 text-sm text-zinc-500">Gestión de elementos y recursos</p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-300"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
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
              placeholder="Buscar por nombre, categoría, disponibilidad, ubicación, persona…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>
        </section>

        <section>
          <div className="mx-auto w-3/4 space-y-3">
            {filtered.length === 0 ? (
              <p className="py-16 text-center text-sm text-zinc-400">
                No se encontraron elementos.
              </p>
            ) : (
              filtered.map((item) => (
                <ItemCard key={item.id} item={item} onClick={() => openModal(item)} />
              ))
            )}
          </div>
        </section>
      </div>

      {selectedItem && formData && (
        <Modal
          formData={formData}
          onChange={setFormData}
          onSave={handleSave}
          onClose={closeModal}
          isPending={isPending}
        />
      )}
    </div>
  )
}
