/**
 * ============================================================================
 *  CONTENIDO DEL SITIO — Club Deportivo Casino (Río Tercero, Córdoba)
 * ============================================================================
 *  Todo el texto, los datos y las imágenes del sitio salen de este archivo.
 *
 *  REGLAS:
 *  - Lo que figura como "[COMPLETAR: ...]" es un dato que hay que relevar con
 *    el club. En pantalla se muestra resaltado para que nadie lo tome como real.
 *  - Lo marcado con `ejemplo: true` o "[EJEMPLO]" es contenido de muestra
 *    (testimonios, historias, agenda) para que la demo se vea viva.
 *  - Las fotos son de Unsplash (libres). Para usar fotos reales del club, poné
 *    el archivo en /public/fotos/ y reemplazá la URL por "/fotos/archivo.jpg"
 *    (siempre con autorización de las personas que aparecen).
 *
 *  Este archivo no importa nada: lo usan tanto la app como el build (sitemap,
 *  páginas para compartir por WhatsApp, imágenes Open Graph).
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
 * Tipos
 * ------------------------------------------------------------------------- */
export type Foto = {
  /** URL de Unsplash (images.unsplash.com/photo-...) o ruta local (/fotos/...) */
  src: string
  alt: string
  /** Fotos propias: anchos generados con `npm run fotos` (archivo-640.avif, archivo-640.webp, ...) */
  anchos?: number[]
  /** Encuadre al recortar (CSS object-position), ej. '70% 50%' */
  posicion?: string
}

export type Red = {
  id: string
  nombre: string
  usuario: string
  url: string
  tipo: 'instagram' | 'facebook'
  foto: Foto
  /** Usuario en la red, sin @ (para cargar la foto de perfil en vivo con unavatar.io) */
  usuarioRed?: string
  /** Foto de perfil guardada en el proyecto (respaldo): '/redes/<id>.jpg'. Generar con scripts/avatares-redes.mjs */
  avatar?: string
}

/**
 * Cargar las fotos de perfil en vivo desde unavatar.io.
 * Hoy unavatar cobra por Instagram y Facebook (plan pro): sin plan responde
 * 403 y se usa el respaldo local. Activar solo si el club contrata el plan.
 */
export const AVATAR_EN_VIVO = false

export type Horario = { dias: string; hora: string; categoria: string }

export type Disciplina = {
  slug: string
  nombre: string
  bajada: string
  descripcion: string[]
  /** Datos concretos y confirmados de la disciplina (se muestran como destacados) */
  destacados?: string[]
  foto: Foto
  galeria: Foto[]
  categorias: { nombre: string; edades: string }[]
  horarios: Horario[]
  profesores: { nombre: string; rol: string }[]
  instagram: string
  usuarioInstagram: string
  seo: { titulo: string; descripcion: string }
}

export type Historia = {
  id: string
  tipo: 'imagen' | 'video'
  src: string
  /** Póster para videos */
  poster?: string
  alt: string
  texto: string
  cta?: { label: string; href: string }
  /** true si la historia viene de Instagram (en vivo), no del contenido de la demo */
  enVivo?: boolean
}

export type GrupoHistorias = {
  id: string
  nombre: string
  portada: Foto
  historias: Historia[]
  /** Usuario de Instagram (sin @) del que se traen las historias en vivo. Sin cuenta, el grupo es fijo. */
  cuenta?: string
}

export type Reel = {
  id: string
  titulo: string
  disciplina: string
  poster: Foto
  /** URL de un video vertical 9:16 (mp4/webm). Si está vacío se usa el póster animado. */
  video?: string
  /** Subtítulos WebVTT opcionales */
  subtitulos?: string
  /** Texto que se muestra sobre el video y sirve como alternativa accesible */
  descripcion: string
}

export type Evento = {
  id: string
  titulo: string
  disciplina: string
  tipo: 'partido' | 'torneo' | 'cultural' | 'social'
  /** ISO 8601 con zona horaria de Argentina */
  inicio: string
  fin: string
  lugar: string
  descripcion: string
  ejemplo: boolean
}

export type Plan = {
  id: string
  nombre: string
  para: string
  precio: string
  destacado?: boolean
  incluye: string[]
}

/* ----------------------------------------------------------------------------
 * Fotos (Unsplash, de ejemplo)
 * ------------------------------------------------------------------------- */
const u = (id: string) => `https://images.unsplash.com/photo-${id}`

export const FOTOS = {
  /* --- Fotos propias del club (optimizadas con `npm run fotos`) --- */
  cancha: { src: '/fotos/futbol.jpg', alt: 'Arco y cancha de fútbol del club, con el césped recién marcado', anchos: [640, 720] },
  basquetCasino: { src: '/fotos/basquet.jpg', alt: 'Aro de básquet del club con la red tejida, visto desde abajo', anchos: [585] },
  handballCasino: { src: '/fotos/handball.jpg', alt: 'Equipo de handball del club en el banco, junto al arco, en la cancha de parqué', anchos: [640, 960, 1280, 1295] },
  ligaNacional: { src: '/fotos/basquet-liga-nacional.jpg', alt: 'Partido de básquet de época con la tribuna llena', anchos: [640, 960, 1280, 1392] },
  tenisCanchas: { src: '/fotos/tenis.jpg', alt: 'Canchas de tenis de polvo de ladrillo del club', anchos: [640, 789] },
  arqueroClub: { src: '/fotos/arqueria.jpg', alt: 'Arquero tensando el arco y apuntando a una diana', anchos: [640, 960, 1080] },
  piletaBandera: { src: '/fotos/pileta.jpg', alt: 'Vista aérea de la pileta olímpica pintada con una gran bandera argentina', anchos: [640, 960, 1254] },
  culturaEspacio: { src: '/fotos/cultura.jpg', alt: 'Muestra de arte en un gran galpón, con siluetas pintadas en el piso', anchos: [480] },
  basquetEquipoLiga: { src: '/fotos/basquet-equipo-liga.jpg', alt: 'Equipo de básquet del club con camisetas rojas, posando en la cancha frente a la tribuna llena', anchos: [604] },
  predioSilencio: { src: '/fotos/predio-silencio.jpg', alt: 'Predio del club en obra, con bloques apilados y el pasto crecido junto a la cancha, en blanco y negro', anchos: [640, 960] },
  sedeHistorica: { src: '/fotos/sede-historica.jpg', alt: 'Fotografía antigua en sepia del edificio de la sede, con su fachada de columnas y una moto estacionada en la vereda', anchos: [640, 960, 1080] },
  futbol1947: { src: '/fotos/futbol-1947.jpg', alt: 'Equipo de fútbol del Club Fábrica Militar Río Tercero posando en la cancha, año 1947', anchos: [540] },
  culturaPortada: { src: '/fotos/cultura-portada.jpg', alt: 'Charla abierta en el Centro Cultural, con público sentado entre murales y obras de gran formato', anchos: [640, 960, 1080] },
  culturaMusica: { src: '/fotos/cultura-musica.jpg', alt: 'Guitarrista tocando en vivo bajo luces de colores', anchos: [640, 720] },
  culturaMuestra: { src: '/fotos/cultura-muestra.jpg', alt: 'Público recorriendo una muestra de noche, con huellas pintadas en el piso', anchos: [640, 648] },
  culturaGallos: { src: '/fotos/cultura-gallos.jpg', alt: 'Mural de un gallo y una gallina sobre un corazón rosa', anchos: [640, 960, 1080] },
  culturaOnFire: { src: '/fotos/cultura-on-fire.jpg', alt: 'Graffiti de una caja de fósforos con la frase “On fire”', anchos: [640, 960, 1080] },

  /* --- Fotos de ejemplo (Unsplash) --- */
  parquetObra: { src: '/fotos/parquet-obra.jpg', alt: 'Colocación del nuevo piso de parqué en el estadio cubierto del club, con las tablas a medio instalar bajo el techo de arcos metálicos', anchos: [640, 960, 1122], posicion: '50% 62%' },
  gimnasio: { src: '/fotos/gimnasio.jpg', alt: 'Sala de entrenamiento funcional del club, con racks, discos y socios haciendo ejercicios sobre el piso de goma', anchos: [640, 960, 1280, 1586] },
  pesas: { src: u('1517836357463-d25dfeac3438'), alt: 'Persona levantando una barra con pesas' },
  aro: { src: u('1546519638-68e109498ffc'), alt: 'Pelota de básquet entrando en el aro' },
  pelotaBasquetCalle: { src: u('1519861531473-9200262188bf'), alt: 'Pelota de básquet apoyada en una cancha al aire libre' },
  volcada: { src: u('1608245449230-4ac19066d2d0'), alt: 'Jugador de básquet saltando hacia el aro' },
  basquetBN: { src: u('1505666287802-931dc83948e9'), alt: 'Partido de básquet en un gimnasio, en blanco y negro' },
  pelotaCancha: { src: u('1521412644187-c49fa049e84d'), alt: 'Pelota de básquet sobre las líneas de la cancha' },
  estadioCubierto: { src: u('1504450758481-7338eba7524a'), alt: 'Estadio cubierto con tribunas llenas' },
  futbolChicos: { src: u('1526232761682-d26e03ac148e'), alt: 'Chicos de fútbol infantil reunidos con su entrenador' },
  pelotasFutbol: { src: u('1551958219-acbc608c6377'), alt: 'Pelotas de fútbol sobre el césped' },
  futbolPatada: { src: u('1560272564-c83b66b1ad12'), alt: 'Jugador pateando la pelota en una cancha de fútbol' },
  futbolDuelo: { src: u('1543326727-cf6c39e8f84c'), alt: 'Dos jugadores disputando la pelota' },
  futbolNoche: { src: u('1431324155629-1a6deb1dec8d'), alt: 'Cancha de fútbol de noche, iluminada por un reflector' },
  futbolJugada: { src: u('1517466787929-bc90951d0974'), alt: 'Jugador juvenil de fútbol en plena jugada' },
  estadio: { src: u('1459865264687-595d652de67e'), alt: 'Cancha de fútbol con tribunas' },
  entrenamiento: { src: u('1607962837359-5e7e89f86776'), alt: 'Deportistas entrenando al aire libre' },
  tenisReves: { src: u('1622279457486-62dcc4a431d6'), alt: 'Tenista devolviendo la pelota' },
  tenisPolvo: { src: u('1554068865-24cecd4e34b8'), alt: 'Cancha de polvo de ladrillo vista desde arriba' },
  tenisRaqueta: { src: u('1542144582-1ba00456b5e3'), alt: 'Raqueta y pelota de tenis sobre la cancha' },
  tenisRed: { src: u('1530915365347-e35b749a0381'), alt: 'Pelota de tenis junto a la red' },
  tenisChica: { src: u('1595435934249-5df7ed86e1c0'), alt: 'Jugadora de tenis descansando en la cancha' },
  arqueros: { src: u('1776847651698-0bba33925cbf'), alt: 'Arqueros en línea apuntando con sus arcos' },
  arcoTensado: { src: u('1500679215756-b09636d3786e'), alt: 'Arquero tensando un arco recurvo en el césped' },
  diana: { src: u('1485802240079-a8245c843b95'), alt: 'Flechas clavadas en el centro de una diana' },
  arquera: { src: u('1654714685970-06386068b3f2'), alt: 'Arquera con su arco junto a una diana al aire libre' },
  pileta: { src: u('1519315901367-f34ff9154487'), alt: 'Nadador en un andarivel de pileta' },
  piletaAndarivel: { src: u('1560090995-01632a28895b'), alt: 'Varios nadadores en una pileta olímpica' },
  clavado: { src: u('1600965962361-9035dbfd1c50'), alt: 'Persona tirándose de cabeza a la pileta' },
  mariposa: { src: u('1530549387789-4c1017266635'), alt: 'Nadador en estilo mariposa' },
  tunel: { src: u('1577223625816-7546f13df25d'), alt: 'Túnel de salida a la cancha' },
  hinchada: { src: u('1501386761578-eac5c94b800a'), alt: 'Público alentando en la tribuna' },
  abrazo: { src: u('1511632765486-a01980e01a18'), alt: 'Grupo de amigos abrazados mirando el atardecer' },
  amigos: { src: u('1529156069898-49953e39b3ac'), alt: 'Grupo de personas sentadas juntas al aire libre' },
  voluntario: { src: u('1559027615-cd4628902d4a'), alt: 'Voluntario con remera de voluntariado en un evento' },
  chicosSonrisa: { src: u('1488521787991-ed7bbaae773c'), alt: 'Chicos sonriendo a la cámara' },
  fiesta: { src: u('1527529482837-4698179dc6ce'), alt: 'Encuentro de amigos con luces cálidas' },
  musica: { src: u('1514320291840-2e0a9bf2a9ae'), alt: 'Sala de ensayo con batería y micrófono' },
  microfono: { src: u('1507676184212-d03ab07a01bf'), alt: 'Micrófono en un escenario con luces' },
  pinceles: { src: u('1460661419201-fd4cecdf8a8b'), alt: 'Pinceles con pintura de colores' },
  teatro: { src: '/fotos/teatro.jpg', alt: 'Instalación escénica en el galpón cultural: un gran telón con una figura de tela oscura y roja, y siluetas de perros corriendo entre la niebla', anchos: [640, 960, 1080] },
  escenario: { src: u('1492684223066-81342ee5ff30'), alt: 'Escenario con luces y público' },
  retrato2: { src: u('1507003211169-0a1dd7228f2d'), alt: 'Retrato de un hombre sonriente' },
  retrato3: { src: u('1494790108377-be9c29b29330'), alt: 'Retrato de una mujer sonriente' },
  retrato4: { src: u('1472099645785-5658abf4ff4e'), alt: 'Retrato de un hombre mayor con anteojos' },
  retrato6: { src: u('1534528741775-53994a69daeb'), alt: 'Retrato de una mujer' },
} satisfies Record<string, Foto>

/* ----------------------------------------------------------------------------
 * Sitio, SEO y datos institucionales
 * ------------------------------------------------------------------------- */
const FUNDACION = 1944
const anios = new Date().getFullYear() - FUNDACION

export const sitio = {
  /** [COMPLETAR: dominio definitivo] — se usa para links al compartir, QR, sitemap y Open Graph */
  url: 'https://club-deportivo-casino.vercel.app',
  nombre: 'Club Deportivo Casino',
  nombreCorto: 'Casino',
  /** Nombre oficial entre 1956 y su vuelta al nombre popular (ayuda a que lo encuentren en Google) */
  nombreHistorico: 'Club Fábrica Militar Río Tercero',
  fundacion: '1944-02-10',
  ciudad: 'Río Tercero',
  provincia: 'Córdoba',
  barrio: 'Barrio El Libertador',
  lema: 'Una pasión que no se detiene',
  hashtag: '#SoyCasino',
  bannerDemo: 'Demo de propuesta — contenido e imágenes de ejemplo',
  seo: {
    titulo: 'Club Deportivo Casino · Río Tercero — Deporte, cultura y comunidad desde 1944',
    descripcion:
      'Fútbol, básquet, handball, tenis, arquería, pileta olímpica y Centro Cultural en Río Tercero. El club nacido junto a la Fábrica Militar en 1944 (ex Club Fábrica Militar Río Tercero). Sumate.',
    imagen: '/og/home.png',
  },
}

export const contacto = {
  direccion: 'Av. General Savio 1476, Barrio El Libertador, Río Tercero, Córdoba',
  /** Texto para el mapa embebido */
  consultaMapa: 'Av. General Savio 1476, Río Tercero, Córdoba, Argentina',
  telefono: '[COMPLETAR: teléfono]',
  email: '[COMPLETAR: email del club]',
  secretaria: '[COMPLETAR: días y horario de secretaría]',
  /**
   * [COMPLETAR: número de WhatsApp con código de país, sin + ni espacios. Ej: 5493571XXXXXX]
   * Mientras esté vacío, los botones abren WhatsApp para elegir el contacto.
   */
  whatsapp: '',
  /** [COMPLETAR: link del canal o comunidad de WhatsApp] */
  canalWhatsapp: '',
}

export const comision = {
  titulo: 'Comisión directiva',
  presidente: 'Fabián Melo',
  texto: 'Una comisión de dirigentes jóvenes que crecieron en el club, con vocalías de deportes, obras, mantenimiento, cultura y concesiones y servicios.',
  vocalias: ['Deportes', 'Obras', 'Mantenimiento', 'Cultura', 'Concesiones y servicios'],
}

export const redes: Red[] = [
  { id: 'club', nombre: 'Club Deportivo Casino', usuario: '@clubdeportivocasino', url: 'https://www.instagram.com/clubdeportivocasino/', tipo: 'instagram', usuarioRed: 'clubdeportivocasino', foto: FOTOS.abrazo, avatar: '/redes/club.jpg' },
  { id: 'cultura', nombre: 'Centro Cultural Casino', usuario: '@centroculturalcasino', url: 'https://www.instagram.com/centroculturalcasino/', tipo: 'instagram', usuarioRed: 'centroculturalcasino', foto: FOTOS.culturaEspacio, avatar: '/redes/cultura.jpg' },
  { id: 'basquet', nombre: 'Casino Básquet', usuario: '@casinobasquet', url: 'https://www.instagram.com/casinobasquet/', tipo: 'instagram', usuarioRed: 'casinobasquet', foto: FOTOS.basquetCasino, avatar: '/redes/basquet.jpg' },
  { id: 'futbol', nombre: 'Casino Fútbol', usuario: '@casinofutbolok', url: 'https://www.instagram.com/casinofutbolok/', tipo: 'instagram', usuarioRed: 'casinofutbolok', foto: FOTOS.cancha, avatar: '/redes/futbol.jpg' },
  { id: 'handball', nombre: 'Handball Casino', usuario: '@handballdeportivocasino', url: 'https://www.instagram.com/handballdeportivocasino/', tipo: 'instagram', usuarioRed: 'handballdeportivocasino', foto: FOTOS.handballCasino, avatar: '/redes/handball.jpg' },
  { id: 'tenis', nombre: 'Centro de Desarrollo del Tenis', usuario: '@cdesarrollotenis.rio3', url: 'https://www.instagram.com/cdesarrollotenis.rio3/', tipo: 'instagram', usuarioRed: 'cdesarrollotenis.rio3', foto: FOTOS.tenisCanchas, avatar: '/redes/tenis.jpg' },
  { id: 'arqueria', nombre: 'Arqueros Río III', usuario: '@arqueros_rio3', url: 'https://www.instagram.com/arqueros_rio3/', tipo: 'instagram', usuarioRed: 'arqueros_rio3', foto: FOTOS.arqueroClub, avatar: '/redes/arqueria.jpg' },
  { id: 'gimnasio', nombre: 'Aethlos Training', usuario: '@aethlos_training', url: 'https://www.instagram.com/aethlos_training/', tipo: 'instagram', usuarioRed: 'aethlos_training', foto: FOTOS.gimnasio, avatar: '/redes/gimnasio.jpg' },
]

/* ----------------------------------------------------------------------------
 * Navegación
 * ------------------------------------------------------------------------- */
export const navegacion = [
  { id: 'historia', label: 'Club' },
  { id: 'valores', label: 'Valores' },
  { id: 'predio', label: 'Predio' },
  { id: 'cultura', label: 'Cultura' },
  { id: 'socios', label: 'Socios' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'contacto', label: 'Contacto' },
]

/* ----------------------------------------------------------------------------
 * Hero
 * ------------------------------------------------------------------------- */
export const hero = {
  titulo: 'Una pasión que no se detiene',
  prefijoRotativo: 'Acá hay',
  palabrasRotativas: ['deporte', 'cultura', 'valores', 'comunidad', 'familia', 'educación','historia'],
  subtitulo: `Desde 1944, historia viva de Río Tercero. Más de ${Math.floor(anios / 10) * 10} años de deporte, cultura y comunidad en el corazón de Río Tercero.`,
  badge: 'Desde el 10 de febrero de 1944',
  /** Foto real del club */
  foto: {
    src: '/fotos/sede.jpg',
    alt: 'Entrada del Club Deportivo Casino: arco de piedra con el nombre del club, palmeras y la sede al fondo',
    anchos: [640, 960, 1280, 1691],
    posicion: '74% 50%',
  },
  ctaPrincipal: 'Hacete socio',
}

export const marquee = ['1944', 'Fútbol', 'Básquet', 'Handball', 'Tenis', 'Arquería', 'Pileta', 'Centro Cultural']

/* ----------------------------------------------------------------------------
 * Nuestra historia (scroll storytelling)
 * ------------------------------------------------------------------------- */
export const historia = {
  kicker: 'Nuestra historia',
  titulo: 'Nació con la Fábrica. Lo sostiene su gente.',
  hitos: [
    {
      id: 'fundacion',
      anio: '10 de febrero de 1944',
      anioCorto: '1944',
      titulo: 'Nace el Casino',
      texto:
        'Junto a la Fábrica Militar y su barrio de más de 300 viviendas nació el club, con el contador Kichenvilder como primer presidente. En 1951 ya tenía una pista para básquet y baile con piso de mosaicos.',
      foto: FOTOS.futbol1947,
      estado: 'sepia',
    },
    {
      id: 'nombre',
      anio: '27 de enero de 1956',
      anioCorto: '1956',
      titulo: 'Le cambiaron el nombre. El barrio, no.',
      texto: 'Pasó a llamarse oficialmente "Club Fábrica Militar Río Tercero", pero los vecinos lo siguieron llamando Casino. Y el nombre popular volvió a imponerse.',
      foto: FOTOS.sedeHistorica,
      estado: 'sepia',
    },
    {
      id: 'liga',
      anio: 'Liga Nacional de Básquet',
      anioCorto: 'La Liga',
      titulo: 'En los comienzos de la Liga Nacional',
      texto: 'Jugó sus primeros años en la segunda división de la Liga Nacional y por sus canchas pasaron grandes jugadores. [COMPLETAR: temporadas y nombres]',
      foto: FOTOS.basquetEquipoLiga,
      estado: 'sepia',
    },
    {
      id: 'silencio',
      anio: '[COMPLETAR: años sin actividad]',
      anioCorto: 'El silencio',
      titulo: 'Un largo silencio',
      texto: 'Llegó un largo período sin actividad. Pero el cariño nunca se fue del barrio.',
      foto: FOTOS.predioSilencio,
      estado: 'bn',
    },
    {
      id: 'resurgir',
      anio: '2021 · Hoy',
      anioCorto: '2021',
      titulo: 'El club resurge',
      texto:
        'Dirigentes jóvenes que crecieron en el club lo volvieron a poner de pie, y la pileta se pintó con una gran bandera argentina. Hoy, un club abierto a toda la ciudad.',
      foto: FOTOS.piletaBandera,
      estado: 'color',
    },
  ],
  cita: {
    texto: 'Lo nombraron de otra manera, pero el barrio siempre le dijo Casino. Ese cariño es el que lo volvió a poner de pie.',
    autor: '[COMPLETAR: nombre de quien firma la cita, o quitarla]',
    ejemplo: true,
  },
}

/* ----------------------------------------------------------------------------
 * Valores y función social
 * ------------------------------------------------------------------------- */
export const valores = {
  kicker: 'Valores',
  titulo: 'Grandes por lo que hacemos. Humildes por cómo lo hacemos.',
  lista: [
    { id: 'humildad', titulo: 'Humildad', texto: 'Nadie es más que nadie. Acá se barre, se pinta y se juega igual.', icono: 'Sprout' },
    { id: 'pertenencia', titulo: 'Pertenencia', texto: 'Le cambiaron el nombre y el barrio le siguió diciendo Casino. Eso es pertenencia.', icono: 'House' },
    { id: 'cooperacion', titulo: 'Cooperación', texto: 'El club volvió porque cada uno puso lo que tenía.', icono: 'HeartHandshake' },
    { id: 'inclusion', titulo: 'Inclusión', texto: 'Torneos abiertos donde la condición física no es un límite.', icono: 'Users' },
    { id: 'respeto', titulo: 'Respeto', texto: 'Por el rival, por el árbitro, por el profe y por el barrio.', icono: 'Handshake' },
    { id: 'formacion', titulo: 'Formación', texto: 'Formamos deportistas, pero sobre todo buenas personas.', icono: 'GraduationCap' },
  ],
  social: {
    titulo: 'Un club abierto',
    bajada: 'Casino es mucho más que un club de competencia: es un espacio comunitario abierto a toda la ciudad.',
    items: [
      { titulo: 'Escuela de verano', texto: 'Gracias a un acuerdo con la Municipalidad, cada verano la pileta recibe a chicos y a adultos mayores. La Municipalidad hace las obras y el club se ocupa del predio y del agua.' },
      { titulo: 'Pileta para todos', texto: 'Por las tardes de verano, la pileta queda abierta para uso recreativo libre, con un costo mínimo de inscripción.' },
      { titulo: 'Deporte sin límites', texto: 'Torneos abiertos como el Campeonato de Tiros Libres, pensado para que cualquier persona pueda participar.' },
      { titulo: 'Deporte y cultura', texto: 'Un Centro Cultural y arte en el club: en 2021 la pileta se pintó con una gran bandera argentina, obra de un artista local.' },
      { titulo: 'Un predio para la ciudad', texto: 'Cancha de fútbol, básquet con piso de parqué, seis canchas de tenis y una pileta olímpica: espacios que el club sigue sumando para Río Tercero.' },
    ],
  },
}

/* ----------------------------------------------------------------------------
 * El predio (instalaciones confirmadas)
 * ------------------------------------------------------------------------- */
export const predio = {
  kicker: 'Predio',
  titulo: 'Un predio a la altura de su historia',
  bajada: 'En Av. General Savio 1476, barrio El Libertador. [COMPLETAR: salones y otras instalaciones]',
  instalaciones: [
    {
      id: 'futbol',
      nombre: 'Cancha principal y sintéticos',
      dato: 'Fútbol',
      detalle: 'La cancha donde juega el equipo del club, con capacidad para unos 1.500 espectadores, y canchas de fútbol sintético para alquilar. [COMPLETAR: cantidad de canchas sintéticas (fútbol 5 / 7) y horarios]',
      foto: FOTOS.cancha,
      cta: { label: 'Alquilar cancha', mensaje: 'alquilerSintetico' },
    },
    { id: 'basquet', nombre: 'Desde 2024', dato: 'Parquet', detalle: 'Piso de parqué, heredera de la pista de mosaicos de 1951.', foto: FOTOS.parquetObra },
    { id: 'tenis', nombre: 'de tenis', dato: '6 canchas', detalle: 'Las únicas de la ciudad habilitadas para torneos del Circuito Profesional y del Circuito Argentino de Menores.', foto: FOTOS.tenisCanchas },
    {
      id: 'gimnasio',
      nombre: 'Gimnasio',
      dato: 'Gym',
      detalle: 'Sala de musculación y entrenamiento funcional abierta a socios. [COMPLETAR: equipamiento, horarios y cuota]',
      foto: FOTOS.gimnasio,
      cta: { label: 'Consultar', mensaje: 'gimnasio' },
    },
  ] as Instalacion[],
}

type Instalacion = { id: string; nombre: string; dato: string; detalle: string; foto: Foto; cta?: { label: string; mensaje: 'alquilerSintetico' | 'gimnasio' } }

/* ----------------------------------------------------------------------------
 * Pileta y escuela de verano
 * ------------------------------------------------------------------------- */
export const pileta = {
  kicker: 'Verano en Casino',
  titulo: 'La pileta',
  bajada:
    'Una pileta de 50 × 20 metros, con trampolines. Cada verano, funcionan acá las escuelas de verano.',
  foto: FOTOS.piletaBandera,
  turnos: [
    { id: 'chicos', titulo: 'Escuela de verano · Chicos', dias: 'Lunes, miércoles y viernes', detalle: '[COMPLETAR: edades y horario]', icono: 'Baby' },
    { id: 'mayores', titulo: 'Escuela de verano · Adultos mayores', dias: 'Martes y jueves', detalle: '[COMPLETAR: horario]', icono: 'HeartHandshake' },
    { id: 'libre', titulo: 'Pileta libre', dias: 'Por las tardes', detalle: 'Uso recreativo libre con un costo mínimo de inscripción. [COMPLETAR: valor y horario]', icono: 'Sun' },
  ],
  dato: 'En la edición 2022-23, la Escuela de Verano Municipal llegó a recibir unos 250 chicos por pileta en cada etapa.',
  temporada: '[COMPLETAR: confirmar fechas de la temporada y vigencia del acuerdo con la Municipalidad]',
}

/* ----------------------------------------------------------------------------
 * Deportes
 * ------------------------------------------------------------------------- */
export const disciplinas: Disciplina[] = [
  {
    slug: 'futbol',
    nombre: 'Fútbol',
    bajada: 'La pelota que reúne al barrio. Compitiendo en la Liga Regional Riotercerense.',
    descripcion: [
      'El fútbol de Casino participa en la Liga Regional Riotercerense y juega de local en una cancha de 100 × 76 metros con lugar para unos 1.500 espectadores.',
      '[COMPLETAR: categorías activas, modalidad (infantiles, inferiores, femenino, primera) y logros]',
    ],
    destacados: ['Liga Regional Riotercerense', 'Cancha de 100 × 76 m', '~1.500 espectadores'],
    foto: FOTOS.cancha,
    galeria: [FOTOS.futbolChicos, FOTOS.futbolPatada, FOTOS.pelotasFutbol, FOTOS.futbolDuelo],
    categorias: [
      { nombre: 'Infantiles', edades: '[COMPLETAR: edades]' },
      { nombre: 'Inferiores', edades: '[COMPLETAR: edades]' },
      { nombre: 'Primera', edades: '[COMPLETAR: edades]' },
      { nombre: '[COMPLETAR: otras categorías]', edades: '[COMPLETAR: edades]' },
    ],
    horarios: [
      { categoria: 'Infantiles', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' },
      { categoria: 'Inferiores', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' },
      { categoria: 'Primera', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' },
    ],
    profesores: [{ nombre: '[COMPLETAR: nombre]', rol: 'Coordinación de fútbol' }],
    instagram: 'https://www.instagram.com/casinofutbolok/',
    usuarioInstagram: '@casinofutbolok',
    seo: {
      titulo: 'Fútbol · Club Deportivo Casino — Río Tercero',
      descripcion: 'Fútbol en la Liga Regional Riotercerense en el Club Deportivo Casino de Río Tercero. Cancha de 100 × 76 m. Vení a probar.',
    },
  },
  {
    slug: 'basquet',
    nombre: 'Básquet',
    bajada: 'El deporte que hizo grande al club. Hoy, básquet formativo.',
    descripcion: [
      'Casino fue una de las instituciones de los comienzos de la Liga Nacional de Básquet, donde jugó en la segunda división, y por sus canchas pasaron grandes jugadores.',
      'Hoy el foco está en el básquet formativo, en una cancha con piso de parqué, heredera de aquella pista de mosaicos de 1951. [COMPLETAR: categorías, competencias y objetivos]',
    ],
    destacados: ['Básquet formativo', 'Piso de parqué', 'Historia en la Liga Nacional'],
    foto: FOTOS.basquetCasino,
    galeria: [FOTOS.ligaNacional, FOTOS.volcada, FOTOS.pelotaCancha, FOTOS.estadioCubierto],
    categorias: [
      { nombre: 'Escuelita / Mini', edades: '[COMPLETAR: edades]' },
      { nombre: 'Formativas', edades: '[COMPLETAR: edades]' },
      { nombre: '[COMPLETAR: otras categorías]', edades: '[COMPLETAR: edades]' },
    ],
    horarios: [
      { categoria: 'Escuelita / Mini', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' },
      { categoria: 'Formativas', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' },
    ],
    profesores: [{ nombre: '[COMPLETAR: nombre]', rol: 'Coordinación de básquet' }],
    instagram: 'https://www.instagram.com/casinobasquet/',
    usuarioInstagram: '@casinobasquet',
    seo: {
      titulo: 'Básquet · Club Deportivo Casino — Río Tercero',
      descripcion: 'Básquet formativo en el Club Deportivo Casino de Río Tercero, club de los comienzos de la Liga Nacional. Vení a probar.',
    },
  },
  {
    slug: 'handball',
    nombre: 'Handball',
    bajada: 'Velocidad, equipo y garra.',
    descripcion: ['El handball de Casino junta a chicos y chicas que encontraron en este deporte un equipo. [COMPLETAR: categorías, torneos y estado actual de la disciplina]'],
    foto: FOTOS.handballCasino,
    galeria: [FOTOS.entrenamiento, FOTOS.hinchada, FOTOS.tunel, FOTOS.amigos],
    categorias: [
      { nombre: 'Mini handball', edades: '[COMPLETAR: edades]' },
      { nombre: 'Menores / Juveniles', edades: '[COMPLETAR: edades]' },
      { nombre: 'Mayores', edades: '[COMPLETAR: edades]' },
    ],
    horarios: [{ categoria: '[COMPLETAR: categoría]', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' }],
    profesores: [{ nombre: '[COMPLETAR: nombre]', rol: 'Coordinación de handball' }],
    instagram: 'https://www.instagram.com/handballdeportivocasino/',
    usuarioInstagram: '@handballdeportivocasino',
    seo: {
      titulo: 'Handball · Club Deportivo Casino — Río Tercero',
      descripcion: 'Handball en el Club Deportivo Casino de Río Tercero. Vení a probar.',
    },
  },
  {
    slug: 'tenis',
    nombre: 'Tenis',
    bajada: 'Centro de Desarrollo del Tenis: social, formativo y de competencia.',
    descripcion: [
      'Junto al Complejo Río Tenis, el club impulsa un Centro de Desarrollo del Tenis dirigido por Marcelo e Ignacio Calderón y respaldado por la comisión directiva.',
      'El proyecto busca potenciar el tenis social, el formativo y la competencia. Su primera etapa prevé reacondicionar las seis canchas del predio, las únicas de la ciudad habilitadas para torneos del Circuito Profesional y del Circuito Argentino de Menores.',
    ],
    destacados: ['6 canchas', 'Circuito Profesional', 'Circuito Argentino de Menores', 'Con el Complejo Río Tenis'],
    foto: FOTOS.tenisCanchas,
    galeria: [FOTOS.tenisReves, FOTOS.tenisRaqueta, FOTOS.tenisRed, FOTOS.tenisChica],
    categorias: [
      { nombre: 'Tenis social', edades: '[COMPLETAR: edades]' },
      { nombre: 'Tenis formativo', edades: '[COMPLETAR: edades]' },
      { nombre: 'Competencia', edades: '[COMPLETAR: edades]' },
    ],
    horarios: [
      { categoria: 'Social', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' },
      { categoria: 'Formativo', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' },
      { categoria: 'Competencia', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' },
    ],
    profesores: [
      { nombre: 'Marcelo Calderón', rol: 'Dirección del Centro de Desarrollo del Tenis' },
      { nombre: 'Ignacio Calderón', rol: 'Dirección del Centro de Desarrollo del Tenis' },
    ],
    instagram: 'https://www.instagram.com/cdesarrollotenis.rio3/',
    usuarioInstagram: '@cdesarrollotenis.rio3',
    seo: {
      titulo: 'Tenis · Centro de Desarrollo del Tenis — Club Deportivo Casino',
      descripcion: 'Tenis social, formativo y de competencia en las 6 canchas del Club Deportivo Casino, junto al Complejo Río Tenis. Río Tercero.',
    },
  },
  {
    slug: 'arqueria',
    nombre: 'Arquería',
    bajada: 'Concentración, técnica y puntería. Un deporte para todas las edades.',
    descripcion: [
      'La arquería es un deporte de precisión que se puede empezar a cualquier edad y que entrena la concentración y la paciencia.',
      '[COMPLETAR: modalidad (recurvo, compuesto, tradicional), dónde se practica dentro del predio, equipamiento que presta el club y competencias]',
    ],
    foto: FOTOS.arqueroClub,
    galeria: [FOTOS.arqueros, FOTOS.diana, FOTOS.arcoTensado, FOTOS.arquera],
    categorias: [
      { nombre: 'Escuela / Iniciación', edades: '[COMPLETAR: edades]' },
      { nombre: 'Competencia', edades: '[COMPLETAR: edades]' },
    ],
    horarios: [
      { categoria: 'Escuela / Iniciación', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' },
      { categoria: 'Competencia', dias: '[COMPLETAR: días]', hora: '[COMPLETAR: horario]' },
    ],
    profesores: [{ nombre: '[COMPLETAR: nombre]', rol: 'Instructor/a de arquería' }],
    instagram: 'https://www.instagram.com/arqueros_rio3/',
    usuarioInstagram: '@arqueros_rio3',
    seo: {
      titulo: 'Arquería · Club Deportivo Casino — Río Tercero',
      descripcion: 'Arquería en el Club Deportivo Casino de Río Tercero: escuela de iniciación y competencia. Vení a probar.',
    },
  },
]

/* ----------------------------------------------------------------------------
 * Historias (stories)
 * ------------------------------------------------------------------------- */
export const historias: GrupoHistorias[] = [
  {
    id: 'futbol',
    cuenta: 'casinofutbolok',
    nombre: 'Fútbol',
    portada: FOTOS.cancha,
    historias: [
      { id: 'f1', tipo: 'imagen', src: FOTOS.futbolChicos.src, alt: FOTOS.futbolChicos.alt, texto: '[EJEMPLO] Fecha de la Liga Regional: ¡vení a alentar de local!' },
      { id: 'f2', tipo: 'imagen', src: FOTOS.cancha.src, alt: FOTOS.cancha.alt, texto: 'Una cancha de 100 × 76 metros con lugar para 1.500 personas.', cta: { label: 'Ver fútbol', href: '/deportes/futbol' } },
    ],
  },
  {
    id: 'basquet',
    cuenta: 'casinobasquet',
    nombre: 'Básquet',
    portada: FOTOS.basquetCasino,
    historias: [
      { id: 'b1', tipo: 'imagen', src: FOTOS.ligaNacional.src, alt: FOTOS.ligaNacional.alt, texto: 'Fuimos parte de los comienzos de la Liga Nacional de Básquet.' },
      { id: 'b2', tipo: 'imagen', src: FOTOS.basquetCasino.src, alt: FOTOS.basquetCasino.alt, texto: '[EJEMPLO] Básquet formativo: inscripciones abiertas.', cta: { label: 'Ver básquet', href: '/deportes/basquet' } },
    ],
  },
  {
    id: 'handball',
    cuenta: 'handballdeportivocasino',
    nombre: 'Handball',
    portada: FOTOS.handballCasino,
    historias: [
      { id: 'hb1', tipo: 'imagen', src: FOTOS.entrenamiento.src, alt: FOTOS.entrenamiento.alt, texto: '[EJEMPLO] Entrenamiento de handball: velocidad, equipo y garra.' },
      { id: 'hb2', tipo: 'imagen', src: FOTOS.handballCasino.src, alt: FOTOS.handballCasino.alt, texto: '[EJEMPLO] ¿Querés probar? Te esperamos en la próxima práctica.', cta: { label: 'Ver handball', href: '/deportes/handball' } },
    ],
  },
  {
    id: 'pileta',
    cuenta: 'clubdeportivocasino',
    nombre: 'Pileta',
    portada: FOTOS.piletaBandera,
    historias: [
      { id: 'p1', tipo: 'imagen', src: FOTOS.piletaBandera.src, alt: FOTOS.piletaBandera.alt, texto: 'Pileta olímpica de 50 × 20 metros, con trampolines.' },
      { id: 'p2', tipo: 'imagen', src: FOTOS.piletaAndarivel.src, alt: FOTOS.piletaAndarivel.alt, texto: 'Escuela de verano municipal: chicos lunes, miércoles y viernes; adultos mayores martes y jueves.', cta: { label: 'Ver la pileta', href: '/#pileta' } },
    ],
  },
  {
    id: 'gimnasio',
    cuenta: 'aethlos_training',
    nombre: 'Gimnasio',
    portada: FOTOS.gimnasio,
    historias: [
      { id: 'g1', tipo: 'imagen', src: FOTOS.gimnasio.src, alt: FOTOS.gimnasio.alt, texto: 'Gimnasio del club. [COMPLETAR: equipamiento, días y horarios]' },
      { id: 'g2', tipo: 'imagen', src: FOTOS.pesas.src, alt: FOTOS.pesas.alt, texto: '[EJEMPLO] Entrená en el club. [COMPLETAR: valores y si está incluido en la cuota de socio]' },
    ],
  },
  {
    id: 'tenis',
    cuenta: 'cdesarrollotenis.rio3',
    nombre: 'Tenis',
    portada: FOTOS.tenisCanchas,
    historias: [
      { id: 't1', tipo: 'imagen', src: FOTOS.tenisCanchas.src, alt: FOTOS.tenisCanchas.alt, texto: 'Seis canchas: las únicas de la ciudad habilitadas para circuitos profesionales y de menores.' },
      { id: 't2', tipo: 'imagen', src: FOTOS.tenisReves.src, alt: FOTOS.tenisReves.alt, texto: 'Centro de Desarrollo del Tenis: social, formativo y competencia.', cta: { label: 'Ver tenis', href: '/deportes/tenis' } },
    ],
  },
  {
    id: 'arqueria',
    cuenta: 'arqueros_rio3',
    nombre: 'Arquería',
    portada: FOTOS.arqueroClub,
    historias: [
      { id: 'a1', tipo: 'imagen', src: FOTOS.arqueroClub.src, alt: FOTOS.arqueroClub.alt, texto: 'Arquería en el Casino: concentración, técnica y puntería.' },
      { id: 'a2', tipo: 'imagen', src: FOTOS.diana.src, alt: FOTOS.diana.alt, texto: '[EJEMPLO] Clase de iniciación abierta. ¿Le apuntás?', cta: { label: 'Ver arquería', href: '/deportes/arqueria' } },
    ],
  },
  {
    id: 'cultura',
    cuenta: 'centroculturalcasino',
    nombre: 'Cultura',
    portada: FOTOS.culturaEspacio,
    historias: [
      { id: 'c1', tipo: 'imagen', src: FOTOS.piletaBandera.src, alt: FOTOS.piletaBandera.alt, texto: 'En 2021 la pileta se pintó con una gran bandera argentina, obra de un artista local.' },
      { id: 'c2', tipo: 'imagen', src: FOTOS.musica.src, alt: FOTOS.musica.alt, texto: '[EJEMPLO] Nuevos talleres en el Centro Cultural.', cta: { label: 'Ver Centro Cultural', href: '/#cultura' } },
    ],
  },
  {
    id: 'historia',
    nombre: 'Desde 1944',
    portada: FOTOS.ligaNacional,
    historias: [
      { id: 'h1', tipo: 'imagen', src: FOTOS.futbol1947.src, alt: FOTOS.futbol1947.alt, texto: '10 de febrero de 1944: nace el club, junto a la Fábrica Militar.' },
      { id: 'h2', tipo: 'imagen', src: FOTOS.sedeHistorica.src, alt: FOTOS.sedeHistorica.alt, texto: 'En 1956 lo rebautizaron "Club Fábrica Militar Río Tercero". El barrio le siguió diciendo Casino.', cta: { label: 'Conocé la historia', href: '/#historia' } },
    ],
  },
]

/* ----------------------------------------------------------------------------
 * Centro Cultural Casino
 * ------------------------------------------------------------------------- */
export const cultura = {
  kicker: 'Centro Cultural Casino',
  titulo: 'También se juega con el arte',
  bajada:
    'Casino es grande porque no es solo deporte. El Centro Cultural y una vocalía de cultura en la comisión directiva llevan el arte al mismo lugar donde late el barrio.',
  instagram: 'https://www.instagram.com/centroculturalcasino/',
  usuarioInstagram: '@centroculturalcasino',
  foto: FOTOS.culturaPortada,
  talleres: [
    { id: 'musica', nombre: 'Música', detalle: '[COMPLETAR: taller, edades y horario]', foto: FOTOS.culturaMusica, icono: 'Music' },
    { id: 'danza', nombre: 'Exposiciones', detalle: '[COMPLETAR: taller, edades y horario]', foto: FOTOS.culturaMuestra, icono: 'Eye' },
    { id: 'teatro', nombre: 'Obras', detalle: '[COMPLETAR: taller, edades y horario]', foto: FOTOS.teatro, icono: 'Drama' },
    { id: 'arte', nombre: 'Arte y plástica', detalle: '[COMPLETAR: taller, edades y horario]', foto: FOTOS.culturaOnFire, icono: 'Palette' },
  ],
  muestras: [
    { titulo: '[EJEMPLO] Muestra anual de talleres', fecha: '[COMPLETAR: fecha]' },
    { titulo: '[EJEMPLO] Peña del club', fecha: '[COMPLETAR: fecha]' },
  ],
  cita: '“El club es grande porque no es solo deporte.”',
}

/* ----------------------------------------------------------------------------
 * Hacete socio
 * ------------------------------------------------------------------------- */
export const socios = {
  kicker: 'Hacete socio',
  titulo: 'Ser socio es ser parte',
  bajada: 'Tu cuota sostiene las canchas, la pileta y todas las actividades del club.',
  beneficios: [
    { titulo: 'Acceso a las actividades', texto: '[COMPLETAR: qué actividades incluye la cuota]', icono: 'Trophy' },
    { titulo: 'Pileta en verano', texto: '[COMPLETAR: condiciones para socios]', icono: 'Waves' },
    { titulo: 'Voz y voto en el club', texto: 'Participá de las asambleas y decidí el rumbo del club.', icono: 'Vote' },
    { titulo: 'Eventos del club', texto: 'Prioridad y precios especiales en eventos. [COMPLETAR: confirmar]', icono: 'PartyPopper' },
  ],
  planes: [
    { id: 'individual', nombre: 'Individual', para: 'Mayores de 18', precio: '[COMPLETAR: $]', incluye: ['actividades', 'pileta', 'voto', 'eventos'] },
    { id: 'familiar', nombre: 'Familiar', para: 'Grupo familiar conviviente', precio: '[COMPLETAR: $]', destacado: true, incluye: ['actividades', 'pileta', 'voto', 'eventos', 'familia'] },
    { id: 'menor', nombre: 'Menor', para: '[COMPLETAR: edades]', precio: '[COMPLETAR: $]', incluye: ['actividades', 'pileta', 'eventos'] },
  ] satisfies Plan[],
  /** Filas del comparador de planes */
  comparador: [
    { id: 'actividades', label: 'Acceso a actividades' },
    { id: 'pileta', label: 'Pileta en temporada' },
    { id: 'voto', label: 'Voz y voto en asambleas' },
    { id: 'eventos', label: 'Prioridad en eventos' },
    { id: 'familia', label: 'Incluye a todo el grupo familiar' },
  ],
  planesNota: 'Planes y beneficios a confirmar con la comisión.',
  periodicidad: '[COMPLETAR: mensual / bimestral / anual]',
  ayudar: {
    titulo: 'Otras formas de ayudar',
    bajada: 'Si no podés asociarte, igual podés ser parte. Todo suma.',
    items: [
      { id: 'voluntariado', titulo: 'Voluntariado', texto: 'Mantenimiento del predio, obras, eventos o acompañar a los chicos.', icono: 'HandHeart' },
      { id: 'cantina', titulo: 'Concesiones y eventos', texto: 'Dá una mano en la cantina, en una peña o en el torneo del fin de semana.', icono: 'CookingPot' },
      { id: 'materiales', titulo: 'Donar materiales', texto: 'Pelotas, redes, conos, pintura, ropa deportiva en buen estado.', icono: 'Package' },
      { id: 'sponsors', titulo: 'Sponsors y comercios', texto: 'Tu marca en la camiseta, en la cancha y en el corazón del barrio.', icono: 'Store' },
    ],
  },
}

/* ----------------------------------------------------------------------------
 * Comunidad #SoyCasino — SECCIÓN OCULTA por ahora (no se muestra en la home).
 * Para volver a mostrarla: sumar <Community /> en src/pages/Home.tsx.
 * ------------------------------------------------------------------------- */
export const comunidad = {
  kicker: 'Comunidad',
  titulo: '#SoyCasino',
  bajada: 'Subí tu foto en el club con el hashtag #SoyCasino y etiquetá a @clubdeportivocasino. Las mejores aparecen acá.',
  urlHashtag: 'https://www.instagram.com/explore/tags/soycasino/',
  testimonios: [
    { id: 't1', cita: 'Mi viejo entró a la Fábrica y se hizo socio del Casino. Yo aprendí a nadar en esa pileta. Hoy llevo a mis nietos.', nombre: '[EJEMPLO] Don Héctor', rol: 'Socio de toda la vida', foto: FOTOS.retrato4, ejemplo: true },
    { id: 't2', cita: 'Crecimos en estas canchas. Verlas sin actividad dolía. Volver a ponerlas en marcha fue lo más lindo que hicimos.', nombre: '[EJEMPLO] Martín', rol: 'Dirigente', foto: FOTOS.retrato2, ejemplo: true },
    { id: 't3', cita: 'Mi hijo encontró en el club un segundo hogar. Llega a casa cansado y feliz, que es lo único que pido.', nombre: '[EJEMPLO] Laura', rol: 'Mamá de un jugador de fútbol infantil', foto: FOTOS.retrato3, ejemplo: true },
    { id: 't4', cita: 'En el Casino no me enseñaron solo a jugar. Me enseñaron a ser compañera.', nombre: '[EJEMPLO] Sofía', rol: 'Jugadora de handball', foto: FOTOS.retrato6, ejemplo: true },
  ],
  mosaico: [FOTOS.cancha, FOTOS.piletaBandera, FOTOS.basquetCasino, FOTOS.futbolChicos, FOTOS.hinchada, FOTOS.diana, FOTOS.abrazo, FOTOS.tenisChica, FOTOS.chicosSonrisa, FOTOS.pinceles, FOTOS.futbolDuelo],
}

/* ----------------------------------------------------------------------------
 * Agenda (EJEMPLO — reemplazar por fechas reales)
 * ------------------------------------------------------------------------- */
export const agenda = {
  kicker: 'Agenda',
  titulo: 'Lo que se viene',
  bajada: 'Partidos, torneos y eventos. Agendalos, compartilos y vení a alentar.',
  eventos: [
    { id: 'futbol-liga', titulo: '[EJEMPLO] Casino vs. rival a confirmar · Liga Regional Riotercerense', disciplina: 'futbol', tipo: 'partido', inicio: '2026-11-22T16:00:00-03:00', fin: '2026-11-22T18:00:00-03:00', lugar: 'Cancha de fútbol del club', descripcion: 'Primera de fútbol, de local. Vení con la familia.', ejemplo: true },
    { id: 'tiros-libres', titulo: '[EJEMPLO] Campeonato abierto de Tiros Libres', disciplina: 'basquet', tipo: 'torneo', inicio: '2026-11-28T18:00:00-03:00', fin: '2026-11-28T21:00:00-03:00', lugar: 'Cancha de básquet (parqué)', descripcion: 'Abierto a todos: la condición física no es un límite.', ejemplo: true },
    { id: 'tenis-torneo', titulo: '[EJEMPLO] Torneo de tenis de menores', disciplina: 'tenis', tipo: 'torneo', inicio: '2026-12-05T09:00:00-03:00', fin: '2026-12-05T19:00:00-03:00', lugar: 'Canchas de tenis', descripcion: 'Centro de Desarrollo del Tenis.', ejemplo: true },
    { id: 'arqueria-jornada', titulo: '[EJEMPLO] Jornada abierta de arquería', disciplina: 'arqueria', tipo: 'social', inicio: '2026-12-06T17:00:00-03:00', fin: '2026-12-06T20:00:00-03:00', lugar: 'Club Deportivo Casino', descripcion: 'Probá tirar con arco: equipos a disposición y profes para guiarte.', ejemplo: true },
    { id: 'verano', titulo: '[EJEMPLO] Arranca la escuela de verano en la pileta', disciplina: 'pileta', tipo: 'social', inicio: '2027-01-05T09:00:00-03:00', fin: '2027-01-05T12:00:00-03:00', lugar: 'Pileta olímpica', descripcion: 'Escuela de verano municipal. [COMPLETAR: fechas de la temporada]', ejemplo: true },
    { id: 'aniversario', titulo: '[EJEMPLO] Aniversario del club', disciplina: 'club', tipo: 'cultural', inicio: '2027-02-10T20:00:00-03:00', fin: '2027-02-10T23:59:00-03:00', lugar: 'Club Deportivo Casino', descripcion: '10 de febrero: un año más desde 1944.', ejemplo: true },
  ] satisfies Evento[],
  filtros: [
    { id: 'todos', label: 'Todo' },
    { id: 'futbol', label: 'Fútbol' },
    { id: 'basquet', label: 'Básquet' },
    { id: 'tenis', label: 'Tenis' },
    { id: 'handball', label: 'Handball' },
    { id: 'arqueria', label: 'Arquería' },
    { id: 'pileta', label: 'Pileta' },
    { id: 'club', label: 'Club' },
  ],
}

/* ----------------------------------------------------------------------------
 * Preguntas frecuentes (formato chat)
 * ------------------------------------------------------------------------- */
export const faq = {
  kicker: 'Preguntas frecuentes',
  titulo: 'Preguntanos lo que quieras',
  bajada: 'Tocá una pregunta y te respondemos al toque.',
  saludo: '¡Hola! 👋 Somos Casino. ¿En qué te podemos ayudar?',
  preguntas: [
    { id: 'donde', pregunta: '¿Dónde queda el club?', respuesta: 'Estamos en Av. General Savio 1476, barrio El Libertador, Río Tercero. Arriba tenés el mapa.' },
    { id: 'edad', pregunta: '¿Desde qué edad pueden empezar?', respuesta: 'Depende de la disciplina. [COMPLETAR: edades mínimas confirmadas por disciplina]. Escribinos y te contamos qué hay para su edad 😉' },
    { id: 'pileta', pregunta: '¿Hay pileta en verano?', respuesta: 'Sí: una pileta olímpica de 50 × 20 metros. En verano funciona la escuela de verano (chicos lunes, miércoles y viernes; adultos mayores martes y jueves) y por las tardes hay pileta libre con un costo mínimo de inscripción. [COMPLETAR: fechas y valores de la temporada]' },
    { id: 'probar', pregunta: '¿Puedo ir a probar?', respuesta: '¡Claro! Escribinos por WhatsApp y te decimos día y horario para una clase de prueba. [COMPLETAR: confirmar política de clases de prueba]' },
    { id: 'ayudar', pregunta: '¿Cómo puedo ayudar?', respuesta: 'Asociándote, sumándote como voluntario, dando una mano en eventos, donando materiales o sumando tu comercio como sponsor. ¡Toda ayuda suma!' },
  ],
  whatsapp: 'Hablar con alguien por WhatsApp',
}

/* ----------------------------------------------------------------------------
 * Newsletter / avisos
 * ------------------------------------------------------------------------- */
export const novedades = {
  titulo: 'Enterate de todo',
  bajada: 'Recibí la agenda y las novedades del club. Sin spam, prometido.',
  canalTitulo: 'Sumate al canal de WhatsApp',
  canalTexto: 'Avisos de partidos, eventos y la temporada de pileta directo a tu celu.',
}

/* ----------------------------------------------------------------------------
 * Sponsors y comercios amigos
 * ------------------------------------------------------------------------- */
export const sponsors = {
  kicker: 'Sponsors y comercios amigos',
  titulo: 'Los que bancan',
  bajada: 'Comercios y empresas de Río Tercero que hacen posible el club. [COMPLETAR: logos reales]',
  lista: ['Tu marca', 'Comercio amigo', 'Sponsor oficial', 'Tu logo acá', 'Empresa local', 'Almacén del barrio', 'Ferretería', 'Panadería'],
  cta: 'Sumá tu marca al club',
}

/* ----------------------------------------------------------------------------
 * Mensajes prellenados de WhatsApp
 * ------------------------------------------------------------------------- */
export const mensajesWhatsapp = {
  general: '¡Hola Casino! Quería hacer una consulta.',
  socio: '¡Hola! Quiero hacerme socio/a del Club Deportivo Casino.',
  probar: (disciplina: string) => `¡Hola! Quiero ir a probar ${disciplina} en el Casino. ¿Qué días y horarios hay?`,
  actividad: (actividad: string, edad: string) => `¡Hola! Quería consultar por "${actividad}" para ${edad}. ¿Me pasan info?`,
  cultura: '¡Hola! Quería info sobre el Centro Cultural Casino.',
  pileta: '¡Hola! Quería info sobre la pileta y la escuela de verano.',
  alquilerSintetico: '¡Hola! Quería alquilar una cancha de fútbol sintético. ¿Qué horarios tienen disponibles?',
  gimnasio: '¡Hola! Quería info sobre el gimnasio del club: horarios y cuota.',
  ayudar: (forma: string) => `¡Hola! Me gustaría colaborar con el club: ${forma}.`,
  sponsor: '¡Hola! Tengo un comercio/empresa y me gustaría sumarme como sponsor del club.',
  disciplinaNueva: '¡Hola! Me gustaría proponer una disciplina nueva en el club.',
}

export const footer = {
  lema: 'Desde 1944. Acá crecimos.',
  copyright: `© ${new Date().getFullYear()} Club Deportivo Casino · Río Tercero, Córdoba`,
}
