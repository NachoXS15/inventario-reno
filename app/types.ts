export interface EgresoRecord {
  prestadoA: string
  fechaEgreso: string
  fechaDevolucionEstimada: string
  motivo: string
  fechaDevolucion?: string
}

export interface Item {
  id: string
  nombre: string
  categoria: string
  descripcion: string
  estado: string
  ubicacion: string
  prestado: boolean
  historialEgresos: EgresoRecord[]
}
