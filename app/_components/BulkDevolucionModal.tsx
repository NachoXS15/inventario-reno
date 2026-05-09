'use client'

import { useState } from 'react'
import type { Item } from '../types'
import { inputClass, today, formatDate, type DevolucionFormData } from './constants'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  )
}

export function BulkDevolucionModal({
  items,
  onClose,
  onConfirmar,
  isPending,
}: {
  items: Item[]
  onClose: () => void
  onConfirmar: (data: DevolucionFormData) => void
  isPending: boolean
}) {
  const [form, setForm] = useState<DevolucionFormData>({
    fechaDevolucion: today(),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl" style={{ maxHeight: '90vh' }}>

        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Devolución múltiple</h2>
            <p className="text-sm text-zinc-500">
              {items.length} elemento{items.length !== 1 ? 's' : ''} seleccionado{items.length !== 1 ? 's' : ''}
            </p>
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

        <div className="overflow-y-auto px-4 py-5 sm:px-6 space-y-5">

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Elementos a devolver</p>
            <div className="max-h-40 space-y-2 overflow-y-auto">
              {items.map((item) => {
                const lastEgreso = item.historialEgresos.at(-1)
                return (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                      <span className="truncate text-zinc-800">{item.nombre}</span>
                    </div>
                    {lastEgreso && (
                      <span className="shrink-0 text-xs text-zinc-400">
                        {lastEgreso.prestadoA} · desde {formatDate(lastEgreso.fechaEgreso)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-sm text-zinc-500">
            Esta fecha de devolución se aplicará a todos los elementos seleccionados.
          </p>

          <Field label="Fecha de devolución real">
            <input
              type="date"
              value={form.fechaDevolucion}
              onChange={(e) => setForm({ fechaDevolucion: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="flex gap-3 border-t border-zinc-100 px-4 py-4 sm:px-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onConfirmar(form)}
            disabled={isPending || !form.fechaDevolucion}
            className="flex-1 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:opacity-50"
          >
            {isPending ? 'Registrando…' : `Registrar devolución (${items.length})`}
          </button>
        </div>
      </div>
    </div>
  )
}
