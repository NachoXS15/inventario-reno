export const ESTADO: Record<string, { label: string; badge: string }> = {
  disponible:    { label: 'Disponible',    badge: 'bg-green-100 text-green-800 border-green-200' },
  en_uso:        { label: 'En uso',        badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  en_reparacion: { label: 'En reparación', badge: 'bg-orange-100 text-orange-800 border-orange-200' },
  no_disponible: { label: 'No disponible', badge: 'bg-red-100 text-red-800 border-red-200' },
}

export const UBICACION: Record<string, { label: string; badge: string }> = {
  oficina_principal: { label: 'Oficina', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
}

export const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200'

export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return '—'
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

export type InfoFormData = {
  nombre: string
  categoria: string
  descripcion: string
  estado: string
  ubicacion: string
}

export type EgresoFormData = {
  prestadoA: string
  fechaEgreso: string
  fechaDevolucionEstimada: string
  motivo: string
}

export type DevolucionFormData = {
  fechaDevolucion: string
}
