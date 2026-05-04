'use client'

import { useState, useTransition } from 'react'
import type { Item, EgresoRecord } from '../types'
import { updateItem, registrarEgreso, registrarDevolucion } from '../actions'
import Image from 'next/image'
import logo from '../../public/logo.png'

const ESTADO: Record<string, { label: string; badge: string }> = {
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

type InfoFormData = {
  nombre: string
  categoria: string
  descripcion: string
  estado: string
  ubicacion: string
}

type EgresoFormData = {
  prestadoA: string
  fechaEgreso: string
  fechaDevolucionEstimada: string
  motivo: string
}

type DevolucionFormData = {
  fechaDevolucion: string
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function formatDate(isoDate: string): string {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
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
  const lastEgreso = item.historialEgresos.at(-1)

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-[#912ac8] hover:shadow-md"
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
          {item.prestado && lastEgreso && (
            <div className="mt-2 space-y-0.5 text-xs text-zinc-400">
              <div>Tiene: <span className="font-medium text-zinc-600">{lastEgreso.prestadoA}</span></div>
              <div>Desde: <span className="font-medium text-zinc-600">{formatDate(lastEgreso.fechaEgreso)}</span></div>
              <div>Devol. est.: <span className="font-medium text-zinc-600">{formatDate(lastEgreso.fechaDevolucionEstimada)}</span></div>
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {item.prestado ? (
            <span className="inline-flex shrink-0 items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              Fuera de la oficina
            </span>
          ) : (
            <>
              <Badge config={ESTADO} value={item.estado} />
              <Badge config={UBICACION} value={item.ubicacion} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Modal({
  item,
  onClose,
  onSaveInfo,
  onRegistrarEgreso,
  onRegistrarDevolucion,
  isPending,
}: {
  item: Item
  onClose: () => void
  onSaveInfo: (data: InfoFormData) => void
  onRegistrarEgreso: (data: EgresoFormData) => void
  onRegistrarDevolucion: (data: DevolucionFormData) => void
  isPending: boolean
}) {
  const [activeTab, setActiveTab] = useState<'info' | 'egreso'>('info')
  const [infoForm, setInfoForm] = useState<InfoFormData>({
    nombre: item.nombre,
    categoria: item.categoria,
    descripcion: item.descripcion,
    estado: item.estado,
    ubicacion: item.ubicacion,
  })
  const [egresoForm, setEgresoForm] = useState<EgresoFormData>({
    prestadoA: '',
    fechaEgreso: today(),
    fechaDevolucionEstimada: '',
    motivo: '',
  })
  const [devolucionForm, setDevolucionForm] = useState<DevolucionFormData>({
    fechaDevolucion: today(),
  })
  const [historialOpen, setHistorialOpen] = useState(false)

  const lastEgreso = item.historialEgresos.at(-1)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl" style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold text-zinc-900">{item.nombre}</h2>
            {/* Sub-tab switcher */}
            <div className="mt-2 flex gap-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === 'info'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                Información
              </button>
              <button
                onClick={() => setActiveTab('egreso')}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === 'egreso'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                Egreso / Devolución
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5">

          {/* ── Tab: Información ── */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <Field label="Nombre">
                <input
                  type="text"
                  value={infoForm.nombre}
                  onChange={(e) => setInfoForm({ ...infoForm, nombre: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label="Categoría">
                <input
                  type="text"
                  value={infoForm.categoria}
                  onChange={(e) => setInfoForm({ ...infoForm, categoria: e.target.value })}
                  className={inputClass}
                />
              </Field>

              <Field label="Descripción">
                <textarea
                  value={infoForm.descripcion}
                  onChange={(e) => setInfoForm({ ...infoForm, descripcion: e.target.value })}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <Field label="Estado">
                <div className="flex items-center gap-3">
                  <Badge config={ESTADO} value={infoForm.estado} />
                  <select
                    value={infoForm.estado}
                    onChange={(e) => setInfoForm({ ...infoForm, estado: e.target.value })}
                    className={`flex-1 ${inputClass}`}
                  >
                    {Object.entries(ESTADO).map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </Field>

              <Field label="Ubicación">
                <div className="flex items-center gap-3">
                  <Badge config={UBICACION} value={infoForm.ubicacion} />
                  <select
                    value={infoForm.ubicacion}
                    onChange={(e) => setInfoForm({ ...infoForm, ubicacion: e.target.value })}
                    className={`flex-1 ${inputClass}`}
                  >
                    {Object.entries(UBICACION).map(([value, { label }]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </Field>
            </div>
          )}

          {/* ── Tab: Egreso / Devolución ── */}
          {activeTab === 'egreso' && (
            <div className="space-y-5">

              {/* Egreso form (item en oficina) */}
              {!item.prestado && (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-500">Completá los datos para registrar la salida del elemento.</p>
                  <Field label="Prestado a">
                    <input
                      type="text"
                      placeholder="Nombre de quien lo lleva"
                      value={egresoForm.prestadoA}
                      onChange={(e) => setEgresoForm({ ...egresoForm, prestadoA: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Fecha de egreso">
                    <input
                      type="date"
                      value={egresoForm.fechaEgreso}
                      onChange={(e) => setEgresoForm({ ...egresoForm, fechaEgreso: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Fecha de devolución estimada">
                    <input
                      type="date"
                      value={egresoForm.fechaDevolucionEstimada}
                      onChange={(e) => setEgresoForm({ ...egresoForm, fechaDevolucionEstimada: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Motivo / destino">
                    <textarea
                      placeholder="¿Para qué evento o uso?"
                      value={egresoForm.motivo}
                      onChange={(e) => setEgresoForm({ ...egresoForm, motivo: e.target.value })}
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </div>
              )}

              {/* Devolución panel (item fuera de la oficina) */}
              {item.prestado && lastEgreso && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Tiene</span>
                      <span className="font-medium text-zinc-800">{lastEgreso.prestadoA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Desde</span>
                      <span className="font-medium text-zinc-800">{formatDate(lastEgreso.fechaEgreso)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Devol. estimada</span>
                      <span className="font-medium text-zinc-800">{formatDate(lastEgreso.fechaDevolucionEstimada)}</span>
                    </div>
                    {lastEgreso.motivo && (
                      <div className="flex justify-between gap-4">
                        <span className="text-zinc-500 shrink-0">Motivo</span>
                        <span className="font-medium text-zinc-800 text-right">{lastEgreso.motivo}</span>
                      </div>
                    )}
                  </div>
                  <Field label="Fecha de devolución real">
                    <input
                      type="date"
                      value={devolucionForm.fechaDevolucion}
                      onChange={(e) => setDevolucionForm({ fechaDevolucion: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                </div>
              )}

              {/* Historial colapsable */}
              <div className="border-t border-zinc-100 pt-4">
                <button
                  onClick={() => setHistorialOpen(!historialOpen)}
                  className="flex w-full items-center justify-between text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  <span>Historial de egresos ({item.historialEgresos.length})</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${historialOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {historialOpen && (
                  <div className="mt-3 space-y-2">
                    {item.historialEgresos.length === 0 ? (
                      <p className="text-sm text-zinc-400">Sin historial de egresos.</p>
                    ) : (
                      [...item.historialEgresos].reverse().map((eg, i) => (
                        <div key={i} className="rounded-lg border border-zinc-200 p-3 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Prestado a</span>
                            <span className="font-medium text-zinc-800">{eg.prestadoA}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Egreso</span>
                            <span className="font-medium text-zinc-800">{formatDate(eg.fechaEgreso)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Devol. est.</span>
                            <span className="font-medium text-zinc-800">{formatDate(eg.fechaDevolucionEstimada)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-500">Devuelto</span>
                            <span className={`font-medium ${eg.fechaDevolucion ? 'text-green-700' : 'text-amber-600'}`}>
                              {eg.fechaDevolucion ? formatDate(eg.fechaDevolucion) : 'Pendiente'}
                            </span>
                          </div>
                          {eg.motivo && (
                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-500 shrink-0">Motivo</span>
                              <span className="font-medium text-zinc-800 text-right">{eg.motivo}</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-zinc-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Cancelar
          </button>

          {activeTab === 'info' && (
            <button
              onClick={() => onSaveInfo(infoForm)}
              disabled={isPending}
              className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              {isPending ? 'Guardando…' : 'Guardar cambios'}
            </button>
          )}

          {activeTab === 'egreso' && !item.prestado && (
            <button
              onClick={() => onRegistrarEgreso(egresoForm)}
              disabled={isPending || !egresoForm.prestadoA || !egresoForm.fechaDevolucionEstimada}
              className="flex-1 rounded-lg bg-[#912ac8] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7a23ab] disabled:opacity-50"
            >
              {isPending ? 'Registrando…' : 'Registrar Egreso'}
            </button>
          )}

          {activeTab === 'egreso' && item.prestado && (
            <button
              onClick={() => onRegistrarDevolucion(devolucionForm)}
              disabled={isPending || !devolucionForm.fechaDevolucion}
              className="flex-1 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-50"
            >
              {isPending ? 'Registrando…' : 'Registrar Devolución'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InventoryClient({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems)
  const [activeMainTab, setActiveMainTab] = useState<'oficina' | 'fuera'>('oficina')
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
    const lastEgreso = item.historialEgresos.at(-1)
    const prestadoALabel = lastEgreso?.prestadoA ?? ''
    return (
      item.nombre.toLowerCase().includes(q) ||
      item.categoria.toLowerCase().includes(q) ||
      item.descripcion.toLowerCase().includes(q) ||
      estadoLabel.toLowerCase().includes(q) ||
      ubicLabel.toLowerCase().includes(q) ||
      prestadoALabel.toLowerCase().includes(q)
    )
  })

  function switchTab(tab: 'oficina' | 'fuera') {
    setActiveMainTab(tab)
    setSearch('')
    setFilterEstado('')
    setFilterUbicacion('')
    setFilterCategoria('')
  }

  function closeModal() {
    setSelectedItem(null)
  }

  function handleSaveInfo(data: InfoFormData) {
    if (!selectedItem) return
    setItems((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? { ...item, ...data } : item))
    )
    closeModal()
    startTransition(async () => {
      await updateItem(selectedItem.id, data)
    })
  }

  function handleRegistrarEgreso(data: EgresoFormData) {
    if (!selectedItem) return
    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? { ...item, prestado: true, historialEgresos: [...item.historialEgresos, data] }
          : item
      )
    )
    closeModal()
    startTransition(async () => {
      await registrarEgreso(selectedItem.id, data)
    })
  }

  function handleRegistrarDevolucion(data: DevolucionFormData) {
    if (!selectedItem) return
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== selectedItem.id) return item
        const historial = [...item.historialEgresos]
        historial[historial.length - 1] = { ...historial[historial.length - 1], ...data }
        return { ...item, prestado: false, historialEgresos: historial }
      })
    )
    closeModal()
    startTransition(async () => {
      await registrarDevolucion(selectedItem.id, data.fechaDevolucion)
    })
  }

  const hasFilters = search || filterEstado || filterUbicacion || filterCategoria

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <header className="border-b border-zinc-200 bg-[#912ac8] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Inventario de Oficina</h1>
            <p className="mt-0.5 text-sm text-white/80">Gestión de elementos y recursos</p>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center">
            <Image src={logo} alt='' width={50} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">

        {/* Main tabs */}
        <div className="flex border-b border-zinc-200">
          <button
            onClick={() => switchTab('oficina')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeMainTab === 'oficina'
                ? 'border-[#912ac8] text-[#912ac8]'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            En la oficina ({enOficinaCount})
          </button>
          <button
            onClick={() => switchTab('fuera')}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeMainTab === 'fuera'
                ? 'border-[#912ac8] text-[#912ac8]'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            Fuera de la oficina ({fueraCount})
          </button>
        </div>

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
              <p className="py-16 text-center text-sm text-zinc-400">
                No se encontraron elementos.
              </p>
            ) : (
              filtered.map((item) => (
                <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
              ))
            )}
          </div>
        </section>
      </main>

      {selectedItem && (
        <Modal
          item={selectedItem}
          onClose={closeModal}
          onSaveInfo={handleSaveInfo}
          onRegistrarEgreso={handleRegistrarEgreso}
          onRegistrarDevolucion={handleRegistrarDevolucion}
          isPending={isPending}
        />
      )}
    </div>
  )
}
