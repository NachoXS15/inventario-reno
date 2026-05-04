import type { Item } from '../types'
import { Badge } from './Badge'
import { ESTADO, UBICACION, formatDate } from './constants'

export function ItemCard({ item, onClick }: { item: Item; onClick: () => void }) {
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
