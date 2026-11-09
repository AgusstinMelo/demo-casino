# Club Deportivo Casino · Demo de sitio web

Propuesta de sitio web para el **Club Deportivo Casino** de Río Tercero (Córdoba), pensada para presentar a la comisión directiva.

> ⚠️ **Es una demo.** Las fotos son de ejemplo (Unsplash) y todos los datos sin confirmar aparecen marcados en pantalla como **[COMPLETAR: …]** (con un resaltado amarillo rayado) o con la etiqueta **EJEMPLO**. No hay ningún dato inventado presentado como real.

---

## 1. Cómo correrla

Requisitos: **Node 22.18 o superior** (probado con Node 24).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # compila a /dist (chequea TypeScript)
npm run preview    # sirve /dist en http://localhost:4173
npm run assets     # regenera íconos de la app e imágenes para compartir (ver 4.3)
```

## 2. Publicarla en Vercel (link público)

**Opción A, desde la web (la más simple):**
1. Subí la carpeta a un repositorio de GitHub.
2. Entrá a [vercel.com](https://vercel.com) → *Add New → Project* → elegí el repositorio.
3. Vercel detecta Vite solo. Dejá todo como está y tocá **Deploy**.

**Opción B, desde la terminal:**
```bash
npm i -g vercel
vercel          # la primera vez pregunta nombre y equipo
vercel --prod   # publica la versión final
```

Después de publicar, **actualizá la URL** en `src/content.ts` → `sitio.url` y corré `npm run build` de nuevo. Esa URL se usa en los links para compartir, los QR, el sitemap y las vistas previas de WhatsApp.

`vercel.json` ya incluye: URLs limpias (`/deportes/basquet`), redirección de la SPA, caché larga para los archivos con hash y encabezados básicos de seguridad.

---

## 3. Cómo editar el contenido

**Todo el texto del sitio está en un solo archivo: [`src/content.ts`](src/content.ts).** No hace falta tocar componentes para cambiar textos, horarios, planes, eventos, preguntas o redes.

| Qué querés cambiar | Dónde, dentro de `content.ts` |
|---|---|
| Nombre, URL, título y descripción para Google | `sitio` |
| Dirección, teléfono, email, **número de WhatsApp**, canal | `contacto` |
| Cuentas de Instagram / Facebook | `redes` |
| Título del hero y palabras que rotan | `hero` |
| Hitos de la historia | `historia.hitos` |
| Valores y "Más que un club" | `valores` |
| Disciplinas (categorías, horarios, profes, galería) | `disciplinas` |
| Historias (stories) | `historias` |
| Talleres del Centro Cultural | `cultura` |
| Planes, beneficios y "Otras formas de ayudar" | `socios` |
| Testimonios y mosaico #SoyCasino | `comunidad` |
| Agenda | `agenda.eventos` |
| Preguntas frecuentes (chat) | `faq.preguntas` |
| Mensajes prellenados de WhatsApp | `mensajesWhatsapp` |

**Número de WhatsApp:** cargalo en `contacto.whatsapp` con código de país y sin espacios (ej. `5493571XXXXXX`). Mientras esté vacío, los botones abren WhatsApp para que la persona elija el contacto. Todos los links salen de la función `waLink(mensaje)` en [`src/lib/wa.ts`](src/lib/wa.ts).

**Marcas en el texto:**
- `"[COMPLETAR: …]"` se ve resaltado: es un dato a relevar.
- `"[EJEMPLO] …"` se convierte en una etiqueta "Ejemplo".
- Cuando el dato es real, simplemente reemplazá el texto y la marca desaparece.

---

## 4. Identidad visual

### 4.1 Colores
Paleta oficial del club, en un solo archivo: [`src/styles/tokens.css`](src/styles/tokens.css).

| Rol | Color | Valor actual |
|---|---|---|
| Principal | Granate rojizo (el del escudo) | `#cc0033` |
| Principal | Blanco | `#ffffff` |
| Secundario | Amarillo ámbar | `#f2a516` |
| Secundario | Negro | `#141010` |
| Terciario | Azul marino | `#16233f` |

```css
--club-granate: #cc0033;
--club-blanco: #ffffff;
--club-ambar: #f2a516;
--club-negro: #141010;
--club-marino: #16233f;
```

Cómo se usan: el **granate** en superficies de marca y botones (con una versión más viva, `--color-secundario`, para los llamados a la acción), el **ámbar** para destacados, el **negro** en secciones oscuras (Centro Cultural, videos, footer) y el **azul marino** en la sección de la pileta, el modo oscuro y algunos detalles.

👉 Son tonos aproximados. Si el club tiene los códigos exactos (del escudo o de la indumentaria), reemplazá esos cinco valores y corré `npm run assets` para regenerar íconos e imágenes para compartir.

### 4.2 Tipografía
Todo el sitio usa **Montserrat** (variable, autoalojada, no depende de Google Fonts):
- Títulos en Montserrat Black (900), en mayúsculas y con el espaciado ajustado.
- Texto en Montserrat regular y medium.
- Centro Cultural en Montserrat itálica liviana, para darle una identidad más artística.

Se define en `tokens.css` (`--font-display`, `--font-body`, `--font-expresiva`). Hay fuentes de respaldo con medidas ajustadas, así el texto no salta mientras carga la tipografía.

### 4.3 Escudo
El escudo oficial (rojo con banda diagonal blanca y "C.D.C") está **redibujado en vector**, así se ve nítido en cualquier tamaño:
- [`public/escudo.svg`](public/escudo.svg): favicon, íconos de la app e imágenes para compartir.
- [`src/components/Escudo.tsx`](src/components/Escudo.tsx): header, footer (con efecto 3D) y chat.

El rojo del escudo (`#cc0033`) está en `tokens.css` como `--club-rojo` y es el color de los botones principales. Si el club tiene el escudo original en vector (SVG, AI o PDF), conviene reemplazar el dibujo por ese archivo y correr `npm run assets`.

### 4.4 Fotos
Hoy son fotos libres de Unsplash, con un tratamiento uniforme (duotono suave con los colores del club y grano).
- Para usar fotos reales del club, optimizalas con:
  ```bash
  npm run fotos -- ruta/a/la-foto.jpg nombre
  ```
  Eso genera versiones AVIF y WebP en varios tamaños dentro de `public/fotos/` e imprime la línea lista para pegar en `content.ts` (con `anchos`). Con `posicion: '70% 50%'` elegís qué parte de la foto se prioriza al recortar en el celular.
- La portada ya usa una foto real: la entrada del club (`/fotos/sede.jpg`), sin el filtro de color de las fotos de ejemplo.
- **Siempre con autorización** de las personas que aparecen, y especialmente de madres, padres o tutores cuando aparecen menores.
- Escribí un `alt` que describa la foto: lo usan los lectores de pantalla.

### 4.5 Historias (stories)
En `historias` cada grupo (Básquet, Fútbol, …) tiene una portada y una lista de historias:
```ts
{ id: 'b3', tipo: 'imagen', src: '/fotos/basquet-1.jpg', alt: '…', texto: '¡Ganamos!', cta: { label: 'Ver básquet', href: '/deportes/basquet' } }
```
Para un video: `tipo: 'video'`, `src: '/videos/clip.mp4'`, `poster: '/fotos/poster.jpg'`.

## 5. Datos pendientes para relevar con el club

Todo lo pendiente aparece en pantalla resaltado como **[COMPLETAR]**. Ya están cargados como reales: fundación (10/02/1944) y primer presidente, la pista de mosaicos de 1951, el cambio de nombre de 1956, la Liga Nacional, el resurgimiento y la bandera en la pileta (2021), el presidente actual y las vocalías, la dirección, las instalaciones, la escuela de verano y el Centro de Desarrollo del Tenis.

**Sitio y contacto**
- [ ] Dominio definitivo (`sitio.url`)
- [ ] Teléfono, email y horario de secretaría
- [ ] Número de WhatsApp del club y link del canal

**Historia**
- [ ] Temporadas en la Liga Nacional y nombres de jugadores destacados
- [ ] Años en que el club estuvo sin actividad
- [ ] Quién firma la cita de cierre (o quitarla)
- [ ] Fotos históricas (Fábrica, pista de mosaicos, Liga Nacional, la bandera en la pileta)

**Predio**
- [ ] Salones y otras instalaciones (no hay datos documentados de salón, gimnasio ni quincho)
- [ ] Gimnasio: equipamiento, días y horarios, valores, si está incluido en la cuota, y fotos reales (hoy las historias usan fotos de ejemplo)

**Pileta y escuela de verano**
- [ ] Edades y horarios de la escuela de verano (chicos y adultos mayores)
- [ ] Horario y valor de la pileta libre
- [ ] Fechas de la temporada y vigencia del acuerdo con la Municipalidad

**Deportes**
- [ ] Fútbol: categorías activas (infantiles, inferiores, femenino, primera) y logros
- [ ] Básquet: categorías formativas y competencias
- [ ] Arquería: modalidad, lugar de práctica, equipamiento, categorías, profes y si tiene cuenta de Instagram propia
- [ ] Handball: confirmar si sigue activo, categorías y torneos
- [ ] Tenis: edades y horarios de social, formativo y competencia
- [ ] Días, horarios y profes de cada categoría (con su consentimiento)

**Centro Cultural**
- [ ] Talleres que se dan, edades y horarios
- [ ] Nombre del artista de la bandera de la pileta
- [ ] Fechas de muestras y eventos

**Socios**
- [ ] Planes reales, valores y periodicidad
- [ ] Qué incluye la cuota y condiciones de la pileta para socios

**Comunidad, agenda y sponsors**
- [ ] Testimonios reales con nombre y foto autorizados
- [ ] Fechas reales de partidos, torneos (por ejemplo, el Campeonato de Tiros Libres) y eventos
- [ ] Logos de sponsors y comercios amigos

**Preguntas frecuentes**
- [ ] Edades mínimas por disciplina, valor de la cuota, clases de prueba y apto médico

---

## 6. Tendencias aplicadas (para la comisión directiva)

Explicado en simple: qué es cada recurso y **para qué le sirve al club**.

| Recurso | Qué es | Para qué sirve |
|---|---|---|
| **Tipografía cinética** | Los títulos entran palabra por palabra. En el inicio, una palabra va cambiando: deporte, cultura, comunidad, familia. | Llama la atención en los primeros segundos y dice en una línea todo lo que es el club. |
| **Historias (stories)** | Círculos como los de Instagram, que abren historias a pantalla completa. | Es el formato que la gente ya usa todos los días. Sirve para novedades rápidas de cada disciplina. |
| **Scroll storytelling** | La historia avanza a medida que bajás: 1944 junto a la Fábrica, la pista de mosaicos, el cambio de nombre, la Liga Nacional, el silencio (en blanco y negro), el resurgir de 2021 (vuelve el color) y hoy. | Emociona, cuenta más de 80 años en un minuto y conecta a los más grandes con los más chicos. |
| **Bento grids** | Mosaicos de tarjetas de distintos tamaños. | Ordenan mucha información (valores, instalaciones) de forma linda y fácil de leer. |
| **View Transitions** | Al pasar de una disciplina a otra, la página cambia con una transición suave. | Navegar se siente como una app y no como una página web vieja. |
| **#SoyCasino** | Mosaico de fotos de la comunidad e invitación a compartir. | Socios y familias se vuelven parte de la comunicación. |
| **WhatsApp como canal principal** | Botón siempre visible y mensajes ya escritos según la sección. | Es el canal que usa todo el barrio. Menos fricción: un toque y ya consultaron. |
| **Preguntas en formato chat** | Tocás una pregunta y la respuesta aparece "escribiéndose". | Resuelve dudas sin llamar a secretaría. Si no alcanza, pasa a WhatsApp. |
| **Formulario de socio en 3 pasos** | Plan → datos → confirmación, con confeti al final. | Asociarse es fácil y se siente como un festejo. Llega como mensaje de WhatsApp listo. |
| **Agenda con calendario, QR y compartir** | Cada evento se agrega al calendario del celu, se comparte o se imprime con su código QR. | Más gente en la cancha. El QR sirve para carteles en comercios y escuelas. |
| **App instalable (PWA)** | El sitio se instala en el celu con el ícono del escudo, como una app. | "La app del club" sin pagar tiendas ni desarrollos aparte. Funciona aunque haya mala señal. |
| **Modo claro / oscuro** | Respeta la configuración del celular y se puede cambiar. | Más cómodo de leer, sobre todo de noche. |
| **Microinteracciones** | Botones que siguen al mouse, cursor que cambia sobre las fotos, respuesta visual al tocar. | Pequeños detalles que transmiten un club cuidado y profesional. |
| **Vidrio, grano y gradientes** | Efecto vidrio en el menú, textura de foto analógica y fondos con los colores del club en movimiento lento. | Le da una identidad propia y cálida, que no parece una plantilla. |
| **Escudo 3D** | El escudo del pie de página se inclina con el mouse o al mover el celu. | Un detalle de orgullo, liviano (sin librerías 3D pesadas). |
| **Vista previa al compartir** | Cada página tiene su imagen y su título para WhatsApp y Facebook. | Cuando alguien comparte "Básquet" por WhatsApp, se ve la foto y el nombre, no un link pelado. |
| **Rápida y accesible** | Carga diferida, imágenes modernas y navegación completa con teclado y lector de pantalla. Si el celular pide menos movimiento, el sitio lo respeta. | Funciona en celulares modestos y con datos limitados, y la puede usar todo el mundo. |

---

## 7. Rendimiento, accesibilidad y SEO (estado actual)

Medido con Lighthouse 12 (móvil, throttling simulado) sobre `npm run preview`:

| Categoría | Resultado |
|---|---|
| Accesibilidad | **100** |
| Buenas prácticas | **100** |
| SEO | **100** |
| Rendimiento | **~85–88** (CLS 0, TBT ~150–250 ms, LCP de laboratorio ~3.3 s) |

Lo que ya está hecho:
- Header y hero **prerenderizados en el HTML**, para que se pinten antes de que cargue JavaScript.
- Fuentes autoalojadas y precargadas, con *fallback* de métricas ajustadas, así el texto no salta al cargar (CLS 0).
- Secciones de más abajo, historias, videos, mapa, QR y confeti se descargan **recién cuando hacen falta**.
- Imágenes con `srcset`, AVIF/WebP, dimensiones fijas, *blur-up* y `fetchpriority="high"` en la foto principal.
- Videos con póster, `preload="none"` y sin carga con ahorro de datos o conexión lenta.
- `prefers-reduced-motion`: sin parallax, marquee, scroll suave, autoplay ni transiciones.
- Un solo H1 por página, `lang="es-AR"`, Open Graph por página, JSON-LD `SportsClub` y `Event`, `sitemap.xml`, `robots.txt` y manifest.

**Para llegar a 90+ en rendimiento móvil** el próximo paso es generar **todo** el HTML en el build (SSG con hidratación), por ejemplo con el modo *framework* de React Router o migrando a Astro. Así el navegador no depende de React para pintar el contenido principal. Es un cambio de infraestructura, no de diseño.

---

## 8. Próximos pasos posibles

1. **Panel de carga (CMS)** para que el club suba noticias, agenda, historias y fotos sin tocar código (Sanity, Decap CMS o similar).
2. **Inscripción y pago de cuotas online** (Mercado Pago), con débito automático.
3. **Carnet digital de socio con QR**, para validar en la puerta, en la cantina o en comercios amigos.
4. **Notificaciones push** de partidos, cambios de horario y eventos (la base PWA ya está).
5. **Galería alimentada desde Instagram** (requiere la API oficial de Meta y un pequeño backend).
6. Fotos y videos reales del club, con autorizaciones firmadas.
7. Dominio propio (ej. `clubcasino.com.ar`) y analítica respetuosa de la privacidad.

---

## 9. Estructura del proyecto

```
src/
  content.ts          ← TODO el contenido
  styles/tokens.css   ← colores y tipografías
  styles/index.css    ← estilos globales, animaciones y tendencias
  styles/fonts.css    ← fuentes autoalojadas
  components/         ← piezas reutilizables (Escudo, botones, modales, etc.)
  sections/           ← cada sección de la home
  pages/              ← Home, página de disciplina y 404
  lib/                ← WhatsApp, compartir, calendario, SEO, scroll, PWA
  prerender.tsx       ← prerender del primer pantallazo
public/
  escudo.svg          ← escudo (placeholder)
  icons/, og/         ← generados con `npm run assets`
scripts/generate-assets.mjs
vite.config.ts        ← build, PWA, sitemap, páginas para compartir y prerender
vercel.json
```

Stack: Vite · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lenis · lucide-react · vite-plugin-pwa.
