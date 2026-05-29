'use client'

import { useState } from 'react'
import { ESTADO, UBICACION, inputClass, type InfoFormData } from './constants'
import { Badge } from './Badge'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  )
}

export function AddItemModal({
  onClose,
  onAdd,
  isPending,
}: {
  onClose: () => void
  onAdd: (data: InfoFormData) => void
  isPending: boolean
}) {
  const [form, setForm] = useState<InfoFormData>({
    nombre: '',
    categoria: '',
    descripcion: '',
    estado: 'disponible',
    ubicacion: 'oficina_principal',
    cantidadTotal: undefined,
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl" style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-zinc-900">Nuevo elemento</h2>
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

        {/* Body */}
        <div className="overflow-y-auto px-4 py-5 sm:px-6">
          <div className="space-y-4">
            <Field label="Nombre *">
              <input
                type="text"
                placeholder="Ej: Cámara Sony A7III"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className={inputClass}
                autoFocus
              />
            </Field>
            <Field label="Categoría">
              <input
                type="text"
                placeholder="Ej: Cámara, Micrófono, Cable…"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Descripción">
              <textarea
                placeholder="Detalles adicionales…"
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>
            <Field label="Estado">
              <div className="flex items-center gap-3">
                <Badge config={ESTADO} value={form.estado} />
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
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
                <Badge config={UBICACION} value={form.ubicacion} />
                <select
                  value={form.ubicacion}
                  onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                  className={`flex-1 ${inputClass}`}
                >
                  {Object.entries(UBICACION).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </Field>
            <Field label="Cantidad total en stock">
              <input
                type="number"
                min={1}
                placeholder="Dejar vacío si es un solo elemento"
                value={form.cantidadTotal ?? ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  setForm({ ...form, cantidadTotal: isNaN(val) ? undefined : val })
                }}
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-zinc-100 px-4 py-4 sm:px-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onAdd(form)}
            disabled={isPending || !form.nombre.trim()}
            className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {isPending ? 'Guardando…' : 'Crear elemento'}
          </button>
        </div>
      </div>
    </div>
  )
}
