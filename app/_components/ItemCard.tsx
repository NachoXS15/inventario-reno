import type { Item } from '../types'
import { Badge } from './Badge'
import { ESTADO, UBICACION, formatDate } from './constants'

export function ItemCard({
  item,
  onClick,
  bulkMode,
  bulkDevMode,
  isInBulk,
}: {
  item: Item
  onClick: () => void
  bulkMode?: boolean
  bulkDevMode?: boolean
  isInBulk?: boolean
}) {
  const lastEgreso = item.historialEgresos.at(-1)
  const canDrag =
    (bulkMode && !item.prestado && !isInBulk) ||
    (bulkDevMode && item.prestado && !isInBulk)

  return (
    <div
      onClick={onClick}
      draggable={canDrag}
      onDragStart={canDrag ? (e) => {
        e.dataTransfer.setData('text/plain', item.id)
        e.dataTransfer.effectAllowed = 'copy'
      } : undefined}
      className={`rounded-xl border bg-white p-5 shadow-sm transition-all ${
        isInBulk && bulkDevMode
          ? 'border-green-500 ring-1 ring-green-500/20 cursor-pointer'
          : isInBulk
          ? 'border-[#912ac8] ring-1 ring-[#912ac8]/20 cursor-pointer'
          : (bulkMode && !item.prestado) || (bulkDevMode && item.prestado)
          ? 'border-zinc-200 cursor-grab hover:border-[#912ac8] hover:shadow-md active:cursor-grabbing'
          : bulkMode || bulkDevMode
          ? 'border-zinc-200 opacity-40 cursor-not-allowed'
          : 'cursor-pointer border-zinc-200 hover:border-[#912ac8] hover:shadow-md'
      }`}
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
          {isInBulk && (
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
              bulkDevMode
                ? 'border-green-300 bg-green-100 text-green-700'
                : 'border-[#912ac8]/30 bg-[#912ac8]/10 text-[#912ac8]'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Seleccionado
            </span>
          )}
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
