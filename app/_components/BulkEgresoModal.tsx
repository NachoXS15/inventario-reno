'use client'

import { useState } from 'react'
import type { Item, Contact } from '../types'
import { inputClass, today, type EgresoFormData } from './constants'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      {children}
    </div>
  )
}

export function BulkEgresoModal({
  items,
  contacts,
  onClose,
  onConfirmar,
  isPending,
}: {
  items: Item[]
  contacts: Contact[]
  onClose: () => void
  onConfirmar: (data: EgresoFormData) => void
  isPending: boolean
}) {
  const [form, setForm] = useState<EgresoFormData>({
    prestadoA: '',
    fechaEgreso: today(),
    fechaDevolucionEstimada: '',
    motivo: '',
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl" style={{ maxHeight: '90vh' }}>

        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Egreso múltiple</h2>
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
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Elementos incluidos</p>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#912ac8]" />
                  <span className="text-zinc-800">{item.nombre}</span>
                  <span className="text-xs text-zinc-400">{item.categoria}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-zinc-500">
            Estos datos se aplicarán a todos los elementos seleccionados.
          </p>

          <Field label="Prestado a">
            <select
              value={form.prestadoA}
              onChange={(e) => setForm({ ...form, prestadoA: e.target.value })}
              className={inputClass}
            >
              <option value="">Seleccionar contacto…</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.nombre}>
                  {c.nombre}{c.telefono ? ` — ${c.telefono}` : ''}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Fecha de egreso">
            <input
              type="date"
              value={form.fechaEgreso}
              onChange={(e) => setForm({ ...form, fechaEgreso: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="Fecha de devolución estimada">
            <input
              type="date"
              value={form.fechaDevolucionEstimada}
              onChange={(e) => setForm({ ...form, fechaDevolucionEstimada: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="Motivo / destino">
            <textarea
              placeholder="¿Para qué evento o uso?"
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              rows={2}
              className={`${inputClass} resize-none`}
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
            disabled={isPending || !form.prestadoA || !form.fechaDevolucionEstimada}
            className="flex-1 rounded-lg bg-[#912ac8] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7a23ab] disabled:opacity-50"
          >
            {isPending ? 'Registrando…' : `Registrar egreso (${items.length})`}
          </button>
        </div>
      </div>
    </div>
  )
}
