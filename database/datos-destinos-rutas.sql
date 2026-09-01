-- =====================================================================
--  DATOS DEL MÓDULO TURÍSTICO  ·  Diego
--
--  Esto NO es el esquema: el esquema lo maneja Victoria. Aquí solo va
--  el contenido de mi módulo (destinos y rutas), que es lo que hace que
--  las pantallas de Destinos y Rutas muestren algo.
--
--  El script de Victoria siembra Niveles, Categorías y Departamentos,
--  pero no trae ningún destino ni ninguna ruta.
--
--  Se puede correr varias veces sin duplicar nada.
-- =====================================================================


-- =====================================================================
--  PARTE 1 (OPCIONAL) — PEDIRLE ESTO A VICTORIA
--
--  El prototipo de Figma muestra en cada tarjeta: los puntos (+150 ⭐),
--  la calificación (⭐ 4.8) y las etiquetas (surf, atardecer). Y en cada
--  ruta: la duración (⏱ 2 días) y los puntos (⭐ +500).
--
--  Ninguna de esas columnas existe todavía. La app YA FUNCIONA sin
--  ellas: simplemente no pinta esos elementos. Si Victoria corre estas
--  seis líneas, la interfaz los empieza a mostrar sola, sin tocar una
--  sola línea de código.
--
--  Son aditivas y no rompen nada de lo que ella hizo.
-- =====================================================================

-- alter table Destinos add column if not exists puntos       INT NOT NULL DEFAULT 100;
-- alter table Destinos add column if not exists calificacion NUMERIC(2,1) NOT NULL DEFAULT 4.5;
-- alter table Destinos add column if not exists etiquetas    TEXT[] NOT NULL DEFAULT '{}';
-- alter table Rutas    add column if not exists duracion_dias NUMERIC(3,1) NOT NULL DEFAULT 1;
-- alter table Rutas    add column if not exists puntos        INT NOT NULL DEFAULT 200;


-- =====================================================================
--  PARTE 2 — LOS 10 DESTINOS DEL PROTOTIPO
--  Coordenadas reales. Las categorías y departamentos se buscan por
--  nombre, tal como los insertó Victoria en su script.
-- =====================================================================

insert into Destinos
    (nombre, descripcion, latitud, longitud, direccion, id_departamento, id_categoria)
select v.nombre, v.descripcion, v.lat, v.lon, v.direccion, d.id_departamento, c.id_categoria
from (values
  ('Playa El Tunco',
   'Famosa playa de arena negra con olas perfectas para el surf y un vibrante ambiente bohemio.',
   13.49370000, -89.38390000, 'Tamanique, La Libertad', 'La Libertad', 'Playas'),

  ('Volcán Santa Ana',
   'El volcán más alto de El Salvador, con una impresionante laguna cratérica color turquesa.',
   13.85310000, -89.63030000, 'Parque Nacional Los Volcanes, Santa Ana', 'Santa Ana', 'Volcanes'),

  ('Suchitoto',
   'Pintoresco pueblo colonial a orillas del Lago Suchitlán, famoso por su arte y su cultura.',
   13.93690000, -89.02720000, 'Suchitoto, Cuscatlán', 'Cuscatlán', 'Pueblos'),

  ('Joya de Cerén',
   'La Pompeya de América: una aldea maya preservada bajo ceniza volcánica. Patrimonio de la Humanidad.',
   13.82810000, -89.35830000, 'San Juan Opico, La Libertad', 'La Libertad', 'Sitios históricos'),

  ('Parque Nacional El Imposible',
   'La mayor reserva de bosque tropical del país, con cascadas y una biodiversidad enorme.',
   13.83330000, -89.95000000, 'San Francisco Menéndez, Ahuachapán', 'Ahuachapán', 'Parques naturales'),

  ('Ruta de Las Flores',
   'Recorrido entre pueblos coloridos, cafetales y flores silvestres del occidente del país.',
   13.84140000, -89.74580000, 'Juayúa, Sonsonate', 'Ahuachapán', 'Pueblos'),

  ('Playa Costa del Sol',
   'Amplia playa de arena clara y aguas tranquilas, ideal para ir en familia.',
   13.32360000, -88.90780000, 'San Luis La Herradura, La Paz', 'La Paz', 'Playas'),

  ('Volcán Izalco',
   'Conocido como el Faro del Pacífico. Ascenso exigente sobre roca volcánica.',
   13.81360000, -89.63310000, 'Izalco, Sonsonate', 'Sonsonate', 'Volcanes'),

  ('La Palma',
   'Pueblo de montaña, cuna del arte naif salvadoreño, con murales de colores en cada pared.',
   14.31690000, -89.17190000, 'La Palma, Chalatenango', 'Chalatenango', 'Pueblos'),

  ('Lago de Coatepeque',
   'Lago volcánico de aguas azul intenso, perfecto para kayak y para nadar.',
   13.86860000, -89.55330000, 'El Congo, Santa Ana', 'Santa Ana', 'Parques naturales')
) as v(nombre, descripcion, lat, lon, direccion, depto, cat)
join Departamentos d on d.nombre = v.depto
join Categorias    c on c.nombre = v.cat
where not exists (select 1 from Destinos x where x.nombre = v.nombre);


-- =====================================================================
--  PARTE 3 — LAS 4 RUTAS Y SUS PARADAS
--  dificultad usa los valores del esquema de Victoria: baja / media / alta
-- =====================================================================

insert into Rutas (nombre, descripcion, dificultad)
select v.nombre, v.descripcion, v.dificultad
from (values
  ('Ruta del Café y las Flores',
   'Recorre los pueblos mágicos del occidente entre cafetales y flores silvestres.', 'baja'),
  ('Aventura Volcánica',
   'Conquista los volcanes más imponentes del país con vistas panorámicas épicas.', 'alta'),
  ('Costera del Pacífico',
   'Surf, atardeceres y arena negra a lo largo de la hermosa costa salvadoreña.', 'baja'),
  ('Historia y Cultura Maya',
   'Descubre las raíces prehispánicas y coloniales de El Salvador.', 'baja')
) as v(nombre, descripcion, dificultad)
where not exists (select 1 from Rutas r where r.nombre = v.nombre);

insert into Ruta_Destino (id_ruta, id_destino, orden)
select r.id_ruta, d.id_destino, v.orden
from (values
  ('Ruta del Café y las Flores', 'Ruta de Las Flores', 1),
  ('Ruta del Café y las Flores', 'La Palma',           2),
  ('Aventura Volcánica',         'Volcán Santa Ana',   1),
  ('Aventura Volcánica',         'Volcán Izalco',      2),
  ('Aventura Volcánica',         'Lago de Coatepeque', 3),
  ('Costera del Pacífico',       'Playa El Tunco',     1),
  ('Costera del Pacífico',       'Playa Costa del Sol',2),
  ('Historia y Cultura Maya',    'Joya de Cerén',      1),
  ('Historia y Cultura Maya',    'Suchitoto',          2)
) as v(ruta, destino, orden)
join Rutas    r on r.nombre = v.ruta
join Destinos d on d.nombre = v.destino
on conflict (id_ruta, id_destino) do nothing;


-- =====================================================================
--  PARTE 4 — FOTOS
--  La tabla Multimedia ya existe en el esquema de Victoria, así que las
--  imágenes no necesitan ningún cambio de estructura. La app toma la
--  primera fila con tipo='foto' de cada destino.
--
--  Reemplazá estas URLs por las fotos que quieras usar.
-- =====================================================================

insert into Multimedia (tipo, url, id_destino)
select 'foto', v.url, d.id_destino
from (values
  ('Playa El Tunco',               'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'),
  ('Volcán Santa Ana',             'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b'),
  ('Suchitoto',                    'https://images.unsplash.com/photo-1518638150340-f706e86654de'),
  ('Joya de Cerén',                'https://images.unsplash.com/photo-1552832230-c0197dd311b5'),
  ('Parque Nacional El Imposible', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e'),
  ('Ruta de Las Flores',           'https://images.unsplash.com/photo-1490750967868-88aa4486c946'),
  ('Playa Costa del Sol',          'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6'),
  ('Volcán Izalco',                'https://images.unsplash.com/photo-1519681393784-d120267933ba'),
  ('La Palma',                     'https://images.unsplash.com/photo-1533105079780-92b9be482077'),
  ('Lago de Coatepeque',           'https://images.unsplash.com/photo-1439066615861-d1af74d74000')
) as v(destino, url)
join Destinos d on d.nombre = v.destino
where not exists (
    select 1 from Multimedia m where m.id_destino = d.id_destino and m.tipo = 'foto'
);


-- =====================================================================
--  COMPROBACIÓN
-- =====================================================================
select 'destinos'   as tabla, count(*) as filas from Destinos
union all select 'rutas',    count(*) from Rutas
union all select 'paradas',  count(*) from Ruta_Destino
union all select 'fotos',    count(*) from Multimedia;
-- Esperado: 10, 4, 9, 10
