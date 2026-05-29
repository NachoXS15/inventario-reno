import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zhkmpsjssvxryxkqcjob.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpoa21wc2pzc3Z4cnl4a3Fjam9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzkyMTk2MCwiZXhwIjoyMDkzNDk3OTYwfQ.ZCQYoFPbSHO3n5nAIwQNpph4rFT3RPyHMPiUCKaSgVw'
)

const items = [
  // Equipamiento
  { nombre: 'Impresora HP HL-1212W',          categoria: 'Equipamiento', descripcion: 'Impresora láser inalámbrica HP HL-1212W',                         estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 2 },
  { nombre: 'Caja de micrófono',               categoria: 'Equipamiento', descripcion: 'Caja completa con micrófono y accesorios',                        estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },

  // Cocina
  { nombre: 'Vasos',                           categoria: 'Cocina',       descripcion: 'Vasos de vidrio para uso diario',                                  estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 30 },
  { nombre: 'Copas',                           categoria: 'Cocina',       descripcion: 'Copas de vidrio',                                                   estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 12 },
  { nombre: 'Tazas de desayuno',               categoria: 'Cocina',       descripcion: 'Tazas para desayuno',                                              estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 34 },
  { nombre: 'Platos de desayuno',              categoria: 'Cocina',       descripcion: 'Platos pequeños para desayuno',                                    estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 27 },
  { nombre: 'Platos de vidrio',                categoria: 'Cocina',       descripcion: 'Platos de vidrio para uso diario',                                 estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 30 },
  { nombre: 'Cucharitas de té',                categoria: 'Cocina',       descripcion: 'Cucharitas chicas de té',                                          estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 36 },
  { nombre: 'Tenedores',                       categoria: 'Cocina',       descripcion: 'Tenedores de metal',                                               estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 28 },
  { nombre: 'Servilleteros',                   categoria: 'Cocina',       descripcion: 'Servilleteros de mesa',                                            estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 5 },
  { nombre: 'Jarra eléctrica',                 categoria: 'Cocina',       descripcion: 'Jarra eléctrica para agua caliente',                               estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },

  // Limpieza
  { nombre: 'Escobillón',                      categoria: 'Limpieza',     descripcion: 'Escobillón para limpieza general',                                 estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Lampazo blanco',                  categoria: 'Limpieza',     descripcion: 'Lampazo blanco para pisos',                                        estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Mopas planas',                    categoria: 'Limpieza',     descripcion: 'Mopas planas para pisos',                                          estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 4 },
  { nombre: 'Mopa de algodón',                 categoria: 'Limpieza',     descripcion: 'Mopa de algodón para pisos',                                       estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },

  // Jardín
  { nombre: 'Máquina de cortar césped',        categoria: 'Jardín',       descripcion: 'Cortadora de césped a motor',                                      estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Pala',                            categoria: 'Jardín',       descripcion: 'Pala para trabajo de jardín',                                      estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Carretilla',                      categoria: 'Jardín',       descripcion: 'Carretilla para transporte de materiales',                         estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Aro de básquet',                  categoria: 'Jardín',       descripcion: 'Aro de básquet para el patio',                                     estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },

  // Herramientas
  { nombre: 'Soplete',                         categoria: 'Herramientas', descripcion: 'Soplete de gas para trabajos de plomería',                         estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Fretachos',                       categoria: 'Herramientas', descripcion: 'Fretachos para trabajos de albañilería',                           estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 3 },

  // Eléctrico
  { nombre: 'Gabinetes eléctricos plásticos',  categoria: 'Eléctrico',    descripcion: 'Gabinetes plásticos para instalaciones eléctricas',                estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 3 },
  { nombre: 'Tomacorrientes dobles',           categoria: 'Eléctrico',    descripcion: 'Tomacorrientes dobles para instalación',                           estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 10 },
  { nombre: 'Módulos de tomacorriente',        categoria: 'Eléctrico',    descripcion: 'Módulos de tomacorriente para tablero',                            estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 3 },
  { nombre: 'Portalámparas',                   categoria: 'Eléctrico',    descripcion: 'Portalámparas para instalación de luminarias',                     estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 2 },
  { nombre: 'Conector macho tripolar',         categoria: 'Eléctrico',    descripcion: 'Conector macho tripolar para conexiones eléctricas',               estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Cajas capsuladas exteriores',     categoria: 'Eléctrico',    descripcion: 'Cajas capsuladas para instalaciones eléctricas exterior estanco',  estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 5 },
  { nombre: 'Tablero de embutir',              categoria: 'Eléctrico',    descripcion: 'Tablero eléctrico para embutir en pared',                          estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Caja de embutir',                 categoria: 'Eléctrico',    descripcion: 'Caja de embutir para instalaciones eléctricas',                    estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Conectores de PVC',               categoria: 'Eléctrico',    descripcion: 'Conectores de PVC para cañerías eléctricas',                      estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 11 },
  { nombre: 'Caja para medidor trifásico',     categoria: 'Eléctrico',    descripcion: 'Caja para instalación de medidor trifásico',                       estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Guías de cables',                 categoria: 'Eléctrico',    descripcion: 'Guías para conducción de cables eléctricos',                       estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: 5 },

  // Seguridad
  { nombre: 'Protector máscara facial',        categoria: 'Seguridad',    descripcion: 'Protector facial para trabajos de riesgo',                         estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },

  // Salud
  { nombre: 'Medidor de presión arterial',     categoria: 'Salud',        descripcion: 'Tensiómetro digital para medir presión arterial',                  estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
  { nombre: 'Oxímetro de pulso',               categoria: 'Salud',        descripcion: 'Oxímetro para medir saturación de oxígeno y pulso cardiaco',       estado: 'disponible', ubicacion: 'oficina_principal', prestado: false, team: 'mantenimiento', cantidad_total: null },
]

const { data, error } = await supabase.from('items').insert(items).select('id, nombre')

if (error) {
  console.error('Error al insertar:', error.message)
  process.exit(1)
}

console.log(`Insertados ${data.length} ítems correctamente:`)
data.forEach(i => console.log(`  ✓ ${i.nombre}`))
