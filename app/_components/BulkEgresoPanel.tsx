'use client'

import { useState } from 'react'
import type { Item } from '../types'

export function BulkEgresoPanel({
  items,
  onDropItem,
  onRemoveItem,
  onConfirmar,
  onCancel,
  title = 'Egreso múltiple',
  confirmLabel = 'Registrar egreso',
}: {
  items: Item[]
  onDropItem: (itemId: string) => void
  onRemoveItem: (itemId: string) => void
  onConfirmar: () => void
  onCancel: () => void
  title?: string
  confirmLabel?: string
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div className="sticky top-6 w-64 shrink-0">
      <div className="rounded-2xl border border-[#912ac8]/20 bg-white shadow-lg overflow-hidden">

        <div className="flex items-center justify-between bg-[#912ac8] px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs text-white/70">
              {items.length === 0
                ? 'Sin elementos'
                : `${items.length} elemento${items.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            const id = e.dataTransfer.getData('text/plain')
            if (id) onDropItem(id)
          }}
          className={`min-h-28 p-3 transition-colors ${isDragOver ? 'bg-purple-50' : 'bg-white'}`}
        >
          {items.length === 0 ? (
            <div className={`flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed transition-colors ${
              isDragOver ? 'border-[#912ac8] text-[#912ac8]' : 'border-zinc-200 text-zinc-400'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p className="text-xs text-center leading-relaxed">Arrastrá o hacé clic<br />en los elementos</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2"
                >
                  <span className="flex-1 truncate text-xs font-medium text-zinc-800">{item.nombre}</span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="shrink-0 text-zinc-300 transition-colors hover:text-red-500"
                    aria-label="Quitar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              {isDragOver && (
                <div className="flex h-8 items-center justify-center rounded-lg border-2 border-dashed border-[#912ac8]/40 text-xs text-[#912ac8]">
                  + Agregar aquí
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-zinc-100 p-3">
          {items.length > 0 ? (
            <button
              onClick={onConfirmar}
              className="w-full rounded-lg bg-[#912ac8] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#7a23ab]"
            >
              {confirmLabel} ({items.length})
            </button>
          ) : (
            <p className="py-1 text-center text-xs text-zinc-400">
              Seleccioná elementos de la lista
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
