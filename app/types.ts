export type Team = 'comunicacion' | 'mantenimiento' | 'admin'

export interface EgresoRecord {
  prestadoA: string
  fechaEgreso: string
  fechaDevolucionEstimada: string
  motivo: string
  fechaDevolucion?: string
  cantidad?: number
}

export interface Item {
  id: string
  nombre: string
  categoria: string
  descripcion: string
  estado: string
  ubicacion: string
  prestado: boolean
  cantidadTotal?: number
  historialEgresos: EgresoRecord[]
}

export interface Contact {
  id: string
  nombre: string
  telefono: string
  categoria: string
}
