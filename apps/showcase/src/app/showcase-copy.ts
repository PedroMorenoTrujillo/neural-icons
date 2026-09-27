export type Locale = 'en' | 'es';

const en = {
  brandSubtitle: 'Icon library / catalog explorer',
  mainNavigation: 'Main navigation',
  icons: 'Icons',
  getStarted: 'Get started',
  families: 'families',
  glyphs: 'glyphs',
  developmentPreview: 'Development preview',
  colorTheme: 'Color theme',
  light: 'Light',
  dark: 'Dark',
  language: 'Language',
  heroTitle: 'Find your icon.',
  heroDescription:
    'Explore 197 icon families. Open one to compare outline and filled, inspect the details, and copy the code for your project.',
  exploreIcons: 'Explore icons',
  searchIcons: 'Search icons',
  searchPlaceholder: 'Name, keyword, or category',
  clear: 'Clear',
  filterByCategory: 'Filter by category',
  allIcons: 'All icons',
  matchingFilters: 'Matching your filters',
  openToCompare: 'Open an icon to compare outline and filled',
  iconFamilies: 'Icon families',
  noMatches: 'No matching icons',
  tryAnotherSearch: 'Try another name, keyword, or category.',
  clearSearch: 'Clear search',
  guideTitle: 'Install and use',
  guide: {
    html: {
      lead: 'Use the SVG files directly in plain HTML. No framework, JavaScript, or Neural UI is required.',
      status:
        'This site and @neural-icons/core@0.0.1-next.2 share the current 197-family catalog. Download SVGs here or use the Core package.',
      installTitle: 'Prepare the SVG file',
      installDescription:
        'No package is needed. Download search.svg and place it at /icons/search.svg in your site’s public files, or update the example path.',
      requirements:
        'Works in any HTML page; no framework or JavaScript is required.',
      variantNote:
        'Download search-filled.svg and update the image path for the filled variant. Set width and height on <img> to change its size.',
      a11yNote:
        'For <img>, use an empty alt for decoration or meaningful alt text for information. An informative inline SVG needs role="img" and aria-label without aria-hidden. Name icon-only buttons on the button.',
      useTitle: 'Use the SVG in HTML',
      useDescription:
        'Reference the copied file with <img>. For CSS color, insert the SVG inline instead of using <img>.',
      colorDescription:
        'Neural Icons SVGs use currentColor. An inline SVG inherits the CSS color of the icon or a parent element. Any valid CSS color works, including hex, RGB, names, and design tokens.',
      colorNote:
        'The detail-panel swatches are examples, not a fixed palette. An SVG shown with <img> does not inherit CSS color from the page; use inline SVG to style its color.',
    },
    angular: {
      lead: 'In Angular, Core supplies icon definitions and the Angular adapter renders them. Neural UI is not required.',
      status:
        'Core and Angular 0.0.1-next.2 are published on npm with the next tag. They contain the 197-family catalog shown here.',
      installTitle: 'Install for Angular',
      installDescription:
        'Install the matching Core and Angular prereleases in your Angular 22 application. Neural UI is not required.',
      requirements: 'Angular >=22 <23. Core has no framework peer dependency.',
      variantNote:
        'Import iconSearchFilled from @neural-icons/core/icons/search-filled for filled. Set [size] in pixels or CSS units.',
      a11yNote:
        'Direct definitions need no registry. For icon="search", register selected definitions with provideNeuralIcons(iconSearch). Use label for an informative icon, or name its parent button.',
      useTitle: 'Use an icon in Angular',
      useDescription:
        'Import iconSearch from its individual Core path, add NeuralIcon to your component imports, and pass the definition to [icon].',
      colorDescription:
        'In the example above, add a class to <neural-icon> and set its CSS color, or set color on a parent. NeuralIcon renders an inline SVG with currentColor; any valid CSS color works.',
      colorNote:
        'This fragment uses iconSearch from the example above. The detail-panel swatches are examples, not a fixed palette.',
    },
    react: {
      lead: 'In React, pass an individual Core icon definition to the NeuIcon component. Neural UI is not required.',
      status:
        'Core and React 0.0.1-next.2 are published on npm with the next tag. They contain the 197-family catalog shown here.',
      installTitle: 'Install for React',
      installDescription:
        'Install the matching Core and React prereleases in your React 19 application. Neural UI is not required.',
      requirements: 'React >=19 <20. Core has no framework peer dependency.',
      variantNote:
        'Import iconSearchFilled from @neural-icons/core/icons/search-filled for filled. Set size to pixels or CSS units.',
      a11yNote:
        'Use aria-label, aria-labelledby or title for an informative standalone icon. An icon-only button needs a name on the button.',
      useTitle: 'Use an icon in React',
      useDescription:
        'Import iconSearch from its individual Core path and pass it to the icon prop of NeuIcon.',
      colorDescription:
        'In the example above, add className or set color on a parent. NeuIcon renders an inline SVG with currentColor; any valid CSS color works.',
      colorNote:
        'This fragment uses iconSearch from the example above. The detail-panel swatches are examples, not a fixed palette.',
    },
    vue: {
      lead: 'In Vue, pass an individual Core icon definition to the NeuIcon component. Neural UI is not required.',
      status:
        'Core and Vue 0.0.1-next.2 are published on npm with the next tag. They contain the 197-family catalog shown here.',
      installTitle: 'Install for Vue',
      installDescription:
        'Install the matching Core and Vue prereleases in your Vue 3.5 application. Neural UI is not required.',
      requirements: 'Vue >=3.5 <3.6. Core has no framework peer dependency.',
      variantNote:
        'Import iconSearchFilled from @neural-icons/core/icons/search-filled for filled. Set :size to pixels or CSS units.',
      a11yNote:
        'Use aria-label, aria-labelledby or title for an informative standalone icon. An icon-only button needs a name on the button.',
      useTitle: 'Use an icon in Vue',
      useDescription:
        'Import iconSearch in <script setup> from its individual Core path and pass it to the icon prop of NeuIcon.',
      colorDescription:
        'In the example above, add a class or set color on a parent. NeuIcon renders an inline SVG with currentColor; any valid CSS color works.',
      colorNote:
        'This fragment uses iconSearch from the example above. The detail-panel swatches are examples, not a fixed palette.',
    },
  },
  technology: 'Technology for installation and use',
  guideFootnote:
    'Direct definitions need no registry. This explorer uses the full @neural-icons/core/catalog only because it displays every icon; normal apps can import individual icons.',
  htmlFootnote:
    'With plain HTML, the browser downloads only the SVG files you reference, not the full icon catalog.',
  downloadSvg: 'Download SVG',
  variantGuide: 'Variant and size',
  accessibilityGuide: 'Accessible use',
  guideCopy: 'Copy code',
  aboutTitle: 'About Neural Icons',
  aboutDescription:
    '197 icon families, outline and filled. MIT licensed for public and commercial use. Granular imports keep ordinary applications free of the full catalog; Neural UI is not required.',
  packageStatus:
    'Core, Angular, React, and Vue 0.0.1-next.2 are published npm prereleases. All four use the 197-family catalog shown here; the stable 1.0 release is still in preparation.',
  licenseLink: 'MIT license',
  repositoryLink: 'Repository',
  apiLink: 'Package API',
  colorTitle: 'Use any color.',
  familyDetail: 'Family detail',
  close: 'Close',
  copyName: 'Copy name',
  selectedVariant: 'Selected variant',
  outline: 'Outline',
  filled: 'Filled',
  realSizes: 'At real sizes',
  previewColor: 'Preview color',
  previewColorNote: 'Preview only · use any CSS color via currentColor',
  searchTerms: 'Search terms',
  granularImport: 'Granular import',
  svgFile: 'SVG file',
  copy: 'Copy',
  importNote: 'Core supplies the definition; the adapter renders it.',
  svgFileNote: 'Copy this file to your public assets for use with <img>.',
  usage: 'Usage',
  example: 'example',
  copySnippet: 'Copy snippet',
  accessibility: 'Accessibility',
  accessibilityNote:
    'Decorative icons are hidden from assistive technology. For meaning, Angular uses label, React/Vue use aria-label or title, and HTML uses <img alt> or inline SVG role="img" with aria-label and without aria-hidden. Name icon-only buttons on the button.',
  name: 'Name',
  import: 'Import',
  asset: 'SVG path',
  snippet: 'Snippet',
  snippetPreviewStatus: 'This example uses the published 0.0.1-next.2 prerelease catalog; earlier versions may not contain this icon.',
  action: 'Action',
  communication: 'Communication',
  file: 'File',
  navigation: 'Navigation',
  status: 'Status',
  system: 'System',
};

const es: typeof en = {
  brandSubtitle: 'Biblioteca y catálogo de iconos',
  mainNavigation: 'Navegación principal',
  icons: 'Iconos',
  getStarted: 'Primeros pasos',
  families: 'familias',
  glyphs: 'glifos',
  developmentPreview: 'Vista previa de desarrollo',
  colorTheme: 'Tema de color',
  light: 'Claro',
  dark: 'Oscuro',
  language: 'Idioma',
  heroTitle: 'Encuentra tu icono.',
  heroDescription:
    'Explora 197 familias de iconos. Abre una para comparar contorno y relleno, ver los detalles y copiar el código para tu proyecto.',
  exploreIcons: 'Explorar iconos',
  searchIcons: 'Buscar iconos',
  searchPlaceholder: 'Nombre, palabra clave o categoría',
  clear: 'Borrar',
  filterByCategory: 'Filtrar por categoría',
  allIcons: 'Todos los iconos',
  matchingFilters: 'Resultados de los filtros',
  openToCompare: 'Abre un icono para comparar contorno y relleno',
  iconFamilies: 'Familias de iconos',
  noMatches: 'No hay iconos que coincidan',
  tryAnotherSearch: 'Prueba con otro nombre, palabra clave o categoría.',
  clearSearch: 'Borrar búsqueda',
  guideTitle: 'Instalación y uso',
  guide: {
    html: {
      lead: 'Usa los SVG directamente en HTML puro. No necesitas framework, JavaScript ni Neural UI.',
      status:
        'Esta web y @neural-icons/core@0.0.1-next.2 comparten el catálogo actual de 197 familias. Descarga los SVG aquí o usa el paquete Core.',
      installTitle: 'Preparar el archivo SVG',
      installDescription:
        'No necesitas instalar un paquete. Descarga search.svg y guárdalo como /icons/search.svg entre los archivos públicos de tu web, o adapta la ruta del ejemplo.',
      requirements:
        'Funciona en cualquier página HTML; no necesita framework ni JavaScript.',
      variantNote:
        'Descarga search-filled.svg y cambia la ruta de la imagen para usar la variante de relleno. Ajusta width y height en <img> para cambiar el tamaño.',
      a11yNote:
        'En <img>, usa alt vacío si es decorativo o un texto descriptivo si aporta información. Un SVG inline informativo necesita role="img" y aria-label, sin aria-hidden. Nombra el botón si solo contiene un icono.',
      useTitle: 'Usar el SVG en HTML',
      useDescription:
        'Muestra el archivo copiado con <img>. Si quieres cambiar el color con CSS, inserta el SVG inline en lugar de usar <img>.',
      colorDescription:
        'Los SVG de Neural Icons usan currentColor. Un SVG insertado en el HTML hereda la propiedad CSS color del icono o de un elemento padre. Sirve cualquier color CSS válido: hexadecimal, RGB, nombres o tokens de diseño.',
      colorNote:
        'Los colores del panel de detalle son ejemplos, no una paleta fija. Un SVG mostrado con <img> no hereda el color CSS de la página; usa SVG inline para cambiarlo.',
    },
    angular: {
      lead: 'En Angular, Core aporta las definiciones de los iconos y el adaptador Angular las representa. No necesitas Neural UI.',
      status:
        'Core y Angular 0.0.1-next.2 están publicados en npm con la etiqueta next. Incluyen el catálogo de 197 familias mostrado aquí.',
      installTitle: 'Instalar en Angular',
      installDescription:
        'Instala las versiones preliminares compatibles de Core y Angular en tu aplicación Angular 22. No necesitas Neural UI.',
      requirements: 'Angular >=22 <23. Core no necesita ningún framework.',
      variantNote:
        'Importa iconSearchFilled desde @neural-icons/core/icons/search-filled para relleno. [size] admite píxeles o unidades CSS.',
      a11yNote:
        'Las definiciones directas no necesitan registro. Para icon="search", registra las seleccionadas con provideNeuralIcons(iconSearch). Usa label para un icono informativo o nombra el botón que lo contiene.',
      useTitle: 'Usar un icono en Angular',
      useDescription:
        'Importa iconSearch desde su ruta individual de Core, añade NeuralIcon a imports del componente y pasa la definición a [icon].',
      colorDescription:
        'En el ejemplo anterior, añade una clase a <neural-icon> y define su color CSS, o aplícalo a un elemento padre. NeuralIcon representa un SVG inline con currentColor; sirve cualquier color CSS válido.',
      colorNote:
        'Este fragmento usa iconSearch del ejemplo anterior. Los colores del panel de detalle son ejemplos, no una paleta fija.',
    },
    react: {
      lead: 'En React, pasa una definición individual de Core al componente NeuIcon. No necesitas Neural UI.',
      status:
        'Core y React 0.0.1-next.2 están publicados en npm con la etiqueta next. Incluyen el catálogo de 197 familias mostrado aquí.',
      installTitle: 'Instalar en React',
      installDescription:
        'Instala las versiones preliminares compatibles de Core y React en tu aplicación React 19. No necesitas Neural UI.',
      requirements: 'React >=19 <20. Core no necesita ningún framework.',
      variantNote:
        'Importa iconSearchFilled desde @neural-icons/core/icons/search-filled para relleno. size admite píxeles o unidades CSS.',
      a11yNote:
        'Usa aria-label, aria-labelledby o title para un icono informativo independiente. Si un botón solo contiene un icono, nombra el botón.',
      useTitle: 'Usar un icono en React',
      useDescription:
        'Importa iconSearch desde su ruta individual de Core y pásalo a la propiedad icon de NeuIcon.',
      colorDescription:
        'En el ejemplo anterior, añade className o define color en un elemento padre. NeuIcon representa un SVG inline con currentColor; sirve cualquier color CSS válido.',
      colorNote:
        'Este fragmento usa iconSearch del ejemplo anterior. Los colores del panel de detalle son ejemplos, no una paleta fija.',
    },
    vue: {
      lead: 'En Vue, pasa una definición individual de Core al componente NeuIcon. No necesitas Neural UI.',
      status:
        'Core y Vue 0.0.1-next.2 están publicados en npm con la etiqueta next. Incluyen el catálogo de 197 familias mostrado aquí.',
      installTitle: 'Instalar en Vue',
      installDescription:
        'Instala las versiones preliminares compatibles de Core y Vue en tu aplicación Vue 3.5. No necesitas Neural UI.',
      requirements: 'Vue >=3.5 <3.6. Core no necesita ningún framework.',
      variantNote:
        'Importa iconSearchFilled desde @neural-icons/core/icons/search-filled para relleno. :size admite píxeles o unidades CSS.',
      a11yNote:
        'Usa aria-label, aria-labelledby o title para un icono informativo independiente. Si un botón solo contiene un icono, nombra el botón.',
      useTitle: 'Usar un icono en Vue',
      useDescription:
        'Importa iconSearch en <script setup> desde su ruta individual de Core y pásalo a la propiedad icon de NeuIcon.',
      colorDescription:
        'En el ejemplo anterior, añade una clase o define color en un elemento padre. NeuIcon representa un SVG inline con currentColor; sirve cualquier color CSS válido.',
      colorNote:
        'Este fragmento usa iconSearch del ejemplo anterior. Los colores del panel de detalle son ejemplos, no una paleta fija.',
    },
  },
  technology: 'Tecnología para la instalación y el uso',
  guideFootnote:
    'Las definiciones importadas directamente no necesitan registro. Este catálogo usa @neural-icons/core/catalog porque muestra todos los iconos; una aplicación normal puede importar solo los que necesita.',
  htmlFootnote:
    'Con HTML puro, el navegador descarga solo los archivos SVG que referencias, no el catálogo completo de iconos.',
  downloadSvg: 'Descargar SVG',
  variantGuide: 'Variante y tamaño',
  accessibilityGuide: 'Uso accesible',
  guideCopy: 'Copiar código',
  aboutTitle: 'Acerca de Neural Icons',
  aboutDescription:
    '197 familias, contorno y relleno. Licencia MIT para uso público y comercial. Las importaciones individuales evitan cargar el catálogo completo; no necesitas Neural UI.',
  packageStatus:
    'Core, Angular, React y Vue 0.0.1-next.2 son versiones preliminares publicadas en npm. Las cuatro usan el catálogo de 197 familias mostrado aquí; la versión estable 1.0 sigue en preparación.',
  licenseLink: 'Licencia MIT',
  repositoryLink: 'Repositorio',
  apiLink: 'API del paquete',
  colorTitle: 'Usa cualquier color.',
  familyDetail: 'Detalle de la familia',
  close: 'Cerrar',
  copyName: 'Copiar nombre',
  selectedVariant: 'Variante seleccionada',
  outline: 'Contorno',
  filled: 'Relleno',
  realSizes: 'A tamaños reales',
  previewColor: 'Color de muestra',
  previewColorNote:
    'Solo vista previa · usa cualquier color CSS con currentColor',
  searchTerms: 'Términos de búsqueda',
  granularImport: 'Importación individual',
  svgFile: 'Archivo SVG',
  copy: 'Copiar',
  importNote: 'Core aporta la definición y el adaptador la representa.',
  svgFileNote:
    'Copia este archivo a tus recursos públicos para usarlo con <img>.',
  usage: 'Uso',
  example: 'ejemplo',
  copySnippet: 'Copiar ejemplo',
  accessibility: 'Accesibilidad',
  accessibilityNote:
    'Los iconos decorativos se ocultan a las tecnologías de asistencia. Para un icono informativo, Angular usa label, React/Vue usan aria-label o title, y HTML usa <img alt> o SVG inline con role="img" y aria-label sin aria-hidden. Si un botón solo contiene un icono, nombra el botón.',
  name: 'Nombre',
  import: 'Importación',
  asset: 'Ruta SVG',
  snippet: 'Ejemplo',
  snippetPreviewStatus: 'Este ejemplo usa el catálogo preliminar 0.0.1-next.2 publicado; las versiones anteriores pueden no incluir este icono.',
  action: 'Acción',
  communication: 'Comunicación',
  file: 'Archivo',
  navigation: 'Navegación',
  status: 'Estado',
  system: 'Sistema',
};

export const showcaseCopy = { en, es };
