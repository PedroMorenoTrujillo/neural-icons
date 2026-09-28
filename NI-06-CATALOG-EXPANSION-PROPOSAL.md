# NI-06 — propuesta previa a la geometría

Estado: selección de conceptos; **ningún SVG nuevo se ha dibujado todavía**. Base comprobada: `main` en `a9245b0564658985b0ad55e98e16557606638606`, 197 familias y 394 glyphs. Los 394 registros productivos preexistentes se congelan.

## Criterio y fuentes

Se compararon **conceptos y cobertura**, no trazados ni siluetas, con los catálogos oficiales de [Lucide](https://lucide.dev/icons/), [Material Symbols](https://fonts.google.com/icons), [Phosphor](https://phosphoricons.com/), [Tabler](https://tabler.io/icons) y [Heroicons](https://heroicons.com/). Las categorías de comercio, media, desarrollo, dispositivos y localización tienen huecos funcionales visibles en Neural. Lucide y Tabler hacen especialmente evidentes `shopping-cart`, `credit-card`, `sliders-horizontal`, `badge-check` y los conceptos de control multimedia. Material, Phosphor y Heroicons confirman la utilidad general de los grupos, pero sus nombres y geometrías **no** son la especificación de Neural.

Inventario Neural contrastado por nombre y etiquetas: ninguno de los 53 nombres de abajo existe como familia. `attach`/`attachment` siguen siendo términos de búsqueda de `paperclip`; `funnel` sigue siendo término de `filter`. No se crearán sinónimos de `search`, `filter`, `send`, `users`, `circle-check` o `file` por sí solos. Las nuevas alternativas de búsqueda serán `tags`, no exports duplicados ni rutas de icono adicionales.

La gramática propuesta es `viewBox 0 0 24 24`, trazo de 1,75, extremos/uniones redondos, `currentColor`, contorno legible a 16 px y filled como **el mismo objeto** con masa y vacío controlados. Se revisarán las parejas a 16/20/24/32 px, claro/oscuro. No se trasladarán paths de las bibliotecas de referencia.

Se proponen únicamente dos categorías nuevas: `commerce` (7 iconos de pago/compra/logística, no equivalentes a `action`) y `media` (6 de audio/vídeo/reproducción, no equivalentes a `system`). Las demás familias entran en la taxonomía vigente. Esto implica actualizar el tipo Core, validador y rótulos de categoría en el showcase en ambos idiomas, sin alterar la semántica de las seis categorías existentes.

## Selección exacta: 53 familias

En cada fila, «cercano ≠» documenta el icono Neural más próximo y la diferencia que justifica una familia. Los alias son **palabras de búsqueda**, no entradas públicas alternativas.

| # | Familia · categoría | Sentido / hueco; cercano ≠ duplicado | Outline → filled | Alias de búsqueda; uso previsto |
|---:|---|---|---|---|
| 1 | `chevrons-left` · navigation | Salto de varias páginas o inicio; `chevron-left` es un solo paso. | Dos puntas izquierdas con ritmo común → dos cuñas sólidas. | `first`, `double left`; paginación. |
| 2 | `chevrons-right` · navigation | Salto o avance múltiple; `chevron-right` es un paso. | Pareja especular de la anterior → pareja sólida especular. | `last`, `double right`; paginación. |
| 3 | `arrow-right-left` · navigation | Intercambio bidireccional; `arrow-left`/`arrow-right` son direcciones únicas. | Dos ejes paralelos y puntas opuestas → flechas sólidas separadas. | `swap`, `exchange`; conversión, orden. |
| 4 | `sliders-horizontal` · action | Ajustes de parámetros; `settings` es configuración general, `filter` restringe resultados. | Tres rieles con mandos alternados → mandos llenos sobre los mismos rieles. | `adjust`, `controls`; preferencias. |
| 5 | `file-search` · file | Buscar dentro de un documento; `file` no tiene búsqueda y `search` carece de contexto documental. | Hoja con pliegue y lupa no invasiva → hoja sólida con lupa contrastada. | `find file`, `document search`; explorador. |
| 6 | `file-lock` · file | Documento protegido; `file` no indica acceso y `lock` no indica documento. | Hoja y pequeño candado legible → hoja sólida y hueco/candado claro. | `protected document`, `secure file`; permisos. |
| 7 | `quote` · action | Cita tipográfica; `message` representa conversación, no bloque citado. | Dos comillas tipográficas iguales → dos masas sólidas con aperturas. | `blockquote`, `quotation`; editor. |
| 8 | `scissors` · action | Cortar contenido; `crop` recorta región visual, `copy` duplica. | Aros y hojas cruzadas → aros vacíos y hojas sólidas. | `cut`, `trim`; edición. |
| 9 | `strikethrough` · action | Texto tachado; `underline` traza abajo y `eraser` elimina. | Letra estilizada atravesada en la zona media → misma letra sólida tachada. | `strike`, `text decoration`; editor. |
| 10 | `layers` · system | Capas apiladas; `files` son documentos y `stack` no existe. | Tres losanges separados → tres planos sólidos con solape distinguible. | `stack`, `z-order`; diseño. |
| 11 | `phone-call` · communication | Llamada activa; `phone` es dispositivo/acción genérica. | Auricular y ondas discretas → auricular lleno y ondas claras. | `ringing`, `call`; telefonía. |
| 12 | `phone-off` · communication | Llamada o teléfono desactivado; `phone` carece de estado. | Auricular interrumpido y barra diagonal → misma silueta llena y barra. | `hang up`, `call ended`; telefonía. |
| 13 | `headphones` · communication | Escucha privada; `volume` es salida de altavoz. | Arco y dos copas simétricas → copas sólidas, arco conservado. | `headset`, `listen`; audio/chat. |
| 14 | `mail-open` · communication | Mensaje leído/abierto; `mail` es sobre cerrado. | Solapa abierta sobre cuerpo → cavidad del sobre visible dentro de masa. | `read email`, `opened`; bandeja. |
| 15 | `megaphone` · communication | Anuncio público; `volume` es sonido, `message` comunicación individual. | Bocina cónica y asa → bocina sólida con boca diferenciada. | `announce`, `broadcast`; avisos. |
| 16 | `git-branch` · system | Bifurcación de versiones; `code` sólo indica programación. | Tres nodos y trayecto ramificado → nodos sólidos y trayecto equivalente. | `branch`, `version control`; desarrollo. |
| 17 | `git-merge` · system | Unión de ramas; `git-branch` se separa, no converge. | Dos trayectos que convergen en nodo superior → nodos sólidos, misma dirección. | `merge`, `version control`; desarrollo. |
| 18 | `git-pull-request` · system | Solicitud de integración; `git-merge` muestra resultado, no propuesta. | Dos columnas, conectores y flecha de solicitud → nodos llenos, flecha idéntica. | `pull request`, `pr`; revisión. |
| 19 | `git-commit` · system | Punto de cambio en historial; `git-branch` representa bifurcación. | Línea vertical que atraviesa un nodo centrado → nodo lleno en mismo eje. | `commit`, `revision`; historial. |
| 20 | `braces` · system | Estructura de código `{}`; `code` simboliza ángulos, no delimitadores. | Llaves simétricas con entrada y salida → llaves más pesadas sin alterar significado. | `curly brackets`, `object`; editor técnico. |
| 21 | `hash` · system | Marcador `#` para anclas/identificadores; `code` son ángulos y `tag` una etiqueta de objeto. | Dos ejes inclinados cruzados por dos barras → mismos cuatro trazos sólidos. | `number sign`, `heading anchor`; desarrollo y documentación. |
| 22 | `shopping-cart` · commerce | Cesta antes de pagar; `shopping-bag` representa compra/bolsa terminada. | Canasta abierta, asa y dos ruedas → canasta sólida, ruedas separadas. | `cart`, `basket`; e-commerce. |
| 23 | `shopping-bag` · commerce | Bolsa de compra; `shopping-cart` es carrito con ruedas. | Bolsa cerrada y asa superior → cuerpo sólido con asa/cavidad clara. | `bag`, `purchase`; tienda. |
| 24 | `credit-card` · commerce | Tarjeta física; `wallet` es contenedor y `dollar-sign` importe. | Rectángulo con banda y chip → tarjeta llena con banda contrastada. | `card`, `payment`; checkout. |
| 25 | `wallet` · commerce | Cartera o saldo; `credit-card` es una tarjeta individual. | Funda plegada con cierre → funda sólida y cierre distinguible. | `balance`, `purse`; cuenta. |
| 26 | `receipt` · commerce | Comprobante de pago; `file-text` es documento general. | Papel estrecho con borde perforado y líneas → mismo contorno lleno y líneas claras. | `invoice`, `bill`; transacciones. |
| 27 | `briefcase` · commerce | Trabajo/negocio; `archive` almacena y `folder` agrupa archivos. | Maletín con asa y cierre → cuerpo lleno, asa vacía, cierre visible. | `business`, `work`; perfil profesional. |
| 28 | `truck` · commerce | Entrega de mercancía; `route` es trazado y `car` transporte personal. | Cabina, caja y ruedas → masas cabina/caja separadas, ruedas claras. | `delivery`, `shipping`; logística. |
| 29 | `music` · media | Audio musical; `file-audio` es documento y `volume` salida. | Dos notas unidas por barra → cabezas sólidas y barra coherente. | `song`, `audio`; reproductor. |
| 30 | `film` · media | Película/clip; `video` es cámara/captura y `file-video` archivo. | Fotogramas y perforaciones → película sólida con fotograma hueco. | `movie`, `cinema`; biblioteca. |
| 31 | `record` · media | Grabar; `circle-check` es validación y `mic` micrófono. | Disco concéntrico simple → disco de grabación sólido, mismo centro. | `recording`, `capture`; controles. |
| 32 | `repeat` · media | Repetir reproducción; `rotate` gira objeto/estado, no bucle de pista. | Dos flechas en circuito horizontal → ejes/puntas más pesados, mismo ciclo. | `loop`, `replay`; reproductor. |
| 33 | `shuffle` · media | Orden aleatorio; `sort` ordena determinísticamente. | Dos rutas cruzadas con salidas separadas → rutas sólidas sin ambigüedad en el cruce. | `random`, `mix`; reproductor. |
| 34 | `captions` · media | Subtítulos; `message` es burbuja, `file-text` documento. | Caja de vídeo con dos líneas inferiores → caja llena, líneas negativas. | `subtitles`, `cc`; vídeo accesible. |
| 35 | `monitor` · system | Pantalla de escritorio; `dashboard` es distribución de interfaz. | Display, base y soporte → pantalla llena con panel interior claro. | `desktop`, `display`; dispositivos. |
| 36 | `smartphone` · system | Teléfono inteligente rectangular; `phone` es auricular de llamada. | Cuerpo vertical y pantalla → cuerpo lleno con pantalla negativa. | `mobile`, `device`; responsive. |
| 37 | `battery` · system | Carga eléctrica; `zap` es energía instantánea y `power` control. | Celda horizontal y terminal → cuerpo lleno con reserva visible. | `charge`, `battery level`; estado. |
| 38 | `battery-charging` · system | Batería cargando; `battery` no expresa proceso, `zap` carece de batería. | Misma celda con rayo centrado → masa equivalente y rayo claro. | `charging`, `power supply`; estado. |
| 39 | `power` · system | Encendido/apagado; `zap` es energía, `play` reproducción. | Arco abierto con eje vertical centrado → aro más pesado, misma apertura. | `on off`, `shutdown`; controles. |
| 40 | `sun` · system | Modo claro/día; `moon` es modo oscuro/noche. | Disco y rayos radiales regulares → disco sólido con rayos equilibrados. | `light mode`, `day`; tema. |
| 41 | `moon` · system | Modo oscuro/noche; `sun` comunica luz diurna. | Creciente mediante contorno abierto/cerrado → creciente lleno, misma orientación. | `dark mode`, `night`; tema. |
| 42 | `car` · navigation | Transporte terrestre personal; `truck` es entrega y `route` sólo camino. | Carrocería, ventanas y ruedas → cuerpo sólido, ventanas vacías. | `vehicle`, `drive`; movilidad. |
| 43 | `plane` · navigation | Viaje aéreo; `navigation` es rumbo, `send` parece avión de papel. | Silueta simétrica de aeronave → silueta sólida, mismo rumbo. | `flight`, `air travel`; viajes. |
| 44 | `ticket` · navigation | Entrada o billete; `tag` es etiqueta y `receipt` pago consumado. | Rectángulo con muescas y línea de corte → pieza llena con corte visible. | `admission`, `pass`; eventos. |
| 45 | `luggage` · navigation | Equipaje; `briefcase` es trabajo y `archive` almacenamiento. | Maleta vertical con mango y ruedas → cuerpo sólido, mango claro. | `suitcase`, `travel`; viajes. |
| 46 | `fingerprint` · system | Identificación biométrica; `key` y `password` son credenciales distintas. | Arcos papilares espaciados → arcos más pesados, no mancha sólida. | `biometric`, `touch id`; acceso. |
| 47 | `shield-alert` · status | Riesgo de seguridad; `shield-check` indica seguridad validada y `warning` es genérico. | Escudo con signo de alerta centrado → escudo sólido con alerta negativa. | `security warning`, `threat`; seguridad. |
| 48 | `ban` · status | Prohibición; `circle-x` indica error/cierre pero no acceso vetado. | Anillo con barra diagonal centrada → anillo más pesado y barra sólida. | `forbidden`, `blocked`; permisos. |
| 49 | `badge-check` · status | Certificación acreditada; `circle-check` es simple confirmación, `shield-check` seguridad. | Sello dentado con check → sello lleno con check claro. | `verified`, `certified`; identidad. |
| 50 | `target` · action | Objetivo/foco; `scan` inspecciona y `record` graba. | Anillos concéntricos y punto central → diana pesada, centros compartidos. | `goal`, `aim`; métricas. |
| 51 | `book-open` · file | Lectura/manual; `file-text` es hoja suelta y `bookmark` marca posición. | Dos páginas abiertas con lomo → páginas sólidas, lomo claro. | `documentation`, `read`; ayuda. |
| 52 | `presentation` · system | Diapositivas; `monitor` es dispositivo y `chart` visualización de datos. | Pantalla sobre trípode con contenido breve → pantalla llena con contenido claro. | `slides`, `deck`; educación. |
| 53 | `kanban` · system | Tablero de tareas en columnas; `dashboard` resume, `table` tabula datos. | Tres columnas con tarjetas escalonadas → tarjetas sólidas y columnas legibles. | `board`, `workflow`; productividad. |

## Auditoría de más de 80 candidatos

Los 53 anteriores se clasifican P0/P1: P0 = `chevrons-left`, `chevrons-right`, `arrow-right-left`, `sliders-horizontal`, `shopping-cart`, `shopping-bag`, `credit-card`, `wallet`, `receipt`, `briefcase`, `truck`, `music`, `film`, `record`, `repeat`, `shuffle`, `monitor`, `smartphone`, `battery`, `battery-charging`, `power`, `sun`, `moon`, `car`, `plane`, `fingerprint`, `shield-alert`, `ban`, `badge-check`, `target`, `book-open`; P1 = los otros 22 seleccionados. No hay iconos P2/SKIP en la selección final.

| Candidato no seleccionado | Prioridad | Motivo |
|---|---|---|
| `funnel` | SKIP | Alias aprobado de `filter`; familia duplicada. |
| `attach`, `attachment` | SKIP | Alias aprobados de `paperclip`; duplicados. |
| `search-find`, `search-query` | SKIP | Sinónimos artificiales de `search`. |
| `bag` | SKIP | Alias de `shopping-bag`. |
| `invoice` | SKIP | En P1 puede buscar `receipt`; documento fiscal específico, no silueta suficientemente distinta. |
| `desktop` | SKIP | Alias de `monitor`. |
| `mobile` | SKIP | Alias de `smartphone`. |
| `headset` | SKIP | Alias de `headphones` en este conjunto; un micro adjunto sería otro concepto futuro. |
| `loop` | SKIP | Alias de `repeat`. |
| `random` | SKIP | Alias de `shuffle`. |
| `subtitles` | SKIP | Alias de `captions`. |
| `night` | SKIP | Alias de `moon`. |
| `day` | SKIP | Alias de `sun`. |
| `suitcase` | SKIP | Alias de `luggage`. |
| `certificate` | P2 | Útil, pero la acreditación general queda cubierta por `badge-check`. |
| `store` | P2 | Fachada comercial útil, pero menos universal que compra/pago/envío. |
| `package` | P2 | Bulto logístico útil; `truck` prioriza el estado de entrega. |
| `handshake` | P2 | Acuerdo de negocio; difícil de distinguir a 16 px sin detalle extra. |
| `calculator` | P2 | Herramienta vertical específica, menos común que las 53 elegidas. |
| `graduation-cap` | P2 | Educación; menos transversal que `presentation` y `book-open`. |
| `lightbulb` | P2 | Idea; frecuente, pero la acción concreta de objetivo gana prioridad. |
| `robot` | P2 | IA/automatización; significado cambiante y demasiado dependiente de producto. |
| `cloud-sync` | P2 | Estado de nube específico; `cloud-upload`/`cloud-download` existentes. |
| `webhook` | P2 | La primera propuesta visual se confundía con una red triangular a 16 px; no hay metáfora suficientemente inequívoca en este corte. |
| `timer` | P2 | Temporizador distinto de `clock`, pero menos prioritario. |
| `wifi-low` | P2 | Estado de señal específico; `wifi`/`wifi-off` existentes. |
| `battery-low` | P2 | Estado de batería específico; `battery`/`battery-charging` priorizados. |
| `thermometer` | P2 | Sensor/clima; uso menos general. |
| `map` | P2 | Cartografía; `map-pin`, `route` y `navigation` ya cubren acciones principales. |
| `train` | P2 | Transporte especializado; `car`/`plane` cubren casos más transversales. |
| `bike` | P2 | Transporte especializado; misma prioridad inferior. |
| `palette` | P2 | Herramienta de diseño, pero requiere control cuidadoso de negativos a 16 px. |
| `ruler` | P2 | Medición de diseño; nicho. |
| `hand` | P2 | Gesto ambiguo sin dirección/posición; necesita taxonomía gestual. |
| `mouse` | P2 | Puede significar periférico o animal; ambigüedad. |
| `cloud-rain` | P2 | Clima no cubierto por este corte de producto. |

Total auditado: **87** candidatos conceptuales (53 seleccionados + 34 descartados/pospuestos). La comparación no pretende paridad numérica con ninguna biblioteca.

## Puertas de decisión

1. Generar primero las 106 definiciones nuevas sin tocar los 394 registros viejos.
2. Si `git-pull-request`, `fingerprint` o cualquier otra pareja no es claramente legible a 16 px, rediseñar **sólo** esa nueva pareja; no degradar la calidad por cumplir el número.
3. No aceptar la expansión si el root de Core empieza a retener glyphs o si un import granular retiene el catálogo.
4. No afirmar certificación visual antes de inspeccionar realmente los 106 glyphs nuevos en 16/20/24/32 px y ambos temas.
