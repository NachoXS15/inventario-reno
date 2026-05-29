-- Agregar columna cantidad_total (nullable para no afectar registros existentes)
ALTER TABLE items ADD COLUMN IF NOT EXISTS cantidad_total integer;

-- Seed: Inventario de Mantenimiento
INSERT INTO items (nombre, categoria, descripcion, estado, ubicacion, prestado, team, cantidad_total) VALUES
  -- Equipamiento
  ('Impresora HP HL-1212W',          'Equipamiento', 'Impresora láser inalámbrica HP HL-1212W',                         'disponible', 'oficina_principal', false, 'mantenimiento', 2),
  ('Caja de micrófono',              'Equipamiento', 'Caja completa con micrófono y accesorios',                        'disponible', 'oficina_principal', false, 'mantenimiento', null),

  -- Cocina
  ('Vasos',                          'Cocina',       'Vasos de vidrio para uso diario',                                 'disponible', 'oficina_principal', false, 'mantenimiento', 30),
  ('Copas',                          'Cocina',       'Copas de vidrio',                                                 'disponible', 'oficina_principal', false, 'mantenimiento', 12),
  ('Tazas de desayuno',              'Cocina',       'Tazas para desayuno',                                             'disponible', 'oficina_principal', false, 'mantenimiento', 34),
  ('Platos de desayuno',             'Cocina',       'Platos pequeños para desayuno',                                   'disponible', 'oficina_principal', false, 'mantenimiento', 27),
  ('Platos de vidrio',               'Cocina',       'Platos de vidrio para uso diario',                                'disponible', 'oficina_principal', false, 'mantenimiento', 30),
  ('Cucharitas de té',               'Cocina',       'Cucharitas chicas de té',                                         'disponible', 'oficina_principal', false, 'mantenimiento', 36),
  ('Tenedores',                      'Cocina',       'Tenedores de metal',                                              'disponible', 'oficina_principal', false, 'mantenimiento', 28),
  ('Servilleteros',                  'Cocina',       'Servilleteros de mesa',                                           'disponible', 'oficina_principal', false, 'mantenimiento', 5),
  ('Jarra eléctrica',                'Cocina',       'Jarra eléctrica para agua caliente',                              'disponible', 'oficina_principal', false, 'mantenimiento', null),

  -- Limpieza
  ('Escobillón',                     'Limpieza',     'Escobillón para limpieza general',                                'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Lampazo blanco',                 'Limpieza',     'Lampazo blanco para pisos',                                       'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Mopas planas',                   'Limpieza',     'Mopas planas para pisos',                                         'disponible', 'oficina_principal', false, 'mantenimiento', 4),
  ('Mopa de algodón',                'Limpieza',     'Mopa de algodón para pisos',                                      'disponible', 'oficina_principal', false, 'mantenimiento', null),

  -- Jardín
  ('Máquina de cortar césped',       'Jardín',       'Cortadora de césped a motor',                                     'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Pala',                           'Jardín',       'Pala para trabajo de jardín',                                     'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Carretilla',                     'Jardín',       'Carretilla para transporte de materiales',                        'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Aro de básquet',                 'Jardín',       'Aro de básquet para el patio',                                    'disponible', 'oficina_principal', false, 'mantenimiento', null),

  -- Herramientas
  ('Soplete',                        'Herramientas', 'Soplete de gas para trabajos de plomería o soldadura',            'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Fretachos',                      'Herramientas', 'Fretachos para trabajos de albañilería',                          'disponible', 'oficina_principal', false, 'mantenimiento', 3),

  -- Eléctrico
  ('Gabinetes eléctricos plásticos', 'Eléctrico',    'Gabinetes plásticos para instalaciones eléctricas',               'disponible', 'oficina_principal', false, 'mantenimiento', 3),
  ('Tomacorrientes dobles',          'Eléctrico',    'Tomacorrientes dobles para instalación',                          'disponible', 'oficina_principal', false, 'mantenimiento', 10),
  ('Módulos de tomacorriente',       'Eléctrico',    'Módulos de tomacorriente para tablero',                           'disponible', 'oficina_principal', false, 'mantenimiento', 3),
  ('Portalámparas',                  'Eléctrico',    'Portalámparas para instalación de luminarias',                    'disponible', 'oficina_principal', false, 'mantenimiento', 2),
  ('Conector macho tripolar',        'Eléctrico',    'Conector macho tripolar para conexiones eléctricas',              'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Cajas capsuladas exteriores',    'Eléctrico',    'Cajas capsuladas exterior estanco para instalaciones eléctricas', 'disponible', 'oficina_principal', false, 'mantenimiento', 5),
  ('Tablero de embutir',             'Eléctrico',    'Tablero eléctrico para embutir en pared',                         'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Caja de embutir',                'Eléctrico',    'Caja de embutir para instalaciones eléctricas',                   'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Conectores de PVC',              'Eléctrico',    'Conectores de PVC para cañerías eléctricas',                      'disponible', 'oficina_principal', false, 'mantenimiento', 11),
  ('Caja para medidor trifásico',    'Eléctrico',    'Caja para instalación de medidor trifásico',                      'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Guías de cables',                'Eléctrico',    'Guías para conducción de cables eléctricos',                      'disponible', 'oficina_principal', false, 'mantenimiento', 5),

  -- Seguridad
  ('Protector máscara facial',       'Seguridad',    'Protector facial para trabajos de riesgo',                        'disponible', 'oficina_principal', false, 'mantenimiento', null),

  -- Salud
  ('Medidor de presión arterial',    'Salud',        'Tensiómetro digital para medir presión arterial',                 'disponible', 'oficina_principal', false, 'mantenimiento', null),
  ('Oxímetro de pulso',              'Salud',        'Oxímetro para medir saturación de oxígeno y pulso cardiaco',      'disponible', 'oficina_principal', false, 'mantenimiento', null);
