import { neuralIcons } from '@neural-icons/core/catalog';
import type { IconFamily } from './showcase-model';

const filledByFamily = new Map(
  neuralIcons
    .filter((icon) => icon.variant === 'filled')
    .map((icon) => [icon.family, icon]),
);

export const families: readonly IconFamily[] = neuralIcons
  .filter((icon) => icon.variant === 'outline')
  .map((outline) => {
    const filled = filledByFamily.get(outline.family);
    if (!filled) throw new Error(`Missing filled variant: ${outline.family}`);
    return {
      name: outline.family,
      category: outline.category,
      keywords: [...new Set([...outline.tags, ...filled.tags])],
      outline,
      filled,
    };
  });

export const familyByName = new Map(
  families.map((family) => [family.name, family]),
);
export const spanishSearchTerms: Readonly<Record<string, readonly string[]>> = {
  'arrow-left': ['flecha izquierda'],
  'arrow-right': ['flecha derecha'],
  'eye-off': ['ojo oculto', 'ocultar'],
  file: ['archivo', 'documento'],
  filter: ['filtro', 'filtrar'],
  home: ['casa', 'inicio'],
  mail: ['correo'],
  mention: ['mencion', 'arroba'],
  paperclip: ['adjuntar', 'clip', 'archivo adjunto'],
  search: ['buscar', 'busqueda', 'lupa'],
  user: ['usuario'],
  'arrow-right-left': ['intercambiar', 'cambiar dirección'],
  'badge-check': ['verificado', 'certificado'],
  ban: ['prohibido', 'bloqueado'],
  battery: ['batería', 'carga'],
  'battery-charging': ['batería cargando', 'cargando'],
  'book-open': ['libro abierto', 'documentación'],
  braces: ['llaves', 'código'],
  briefcase: ['maletín', 'trabajo'],
  captions: ['subtítulos', 'transcripción'],
  car: ['coche', 'automóvil'],
  'chevrons-left': ['doble izquierda', 'ir al principio'],
  'chevrons-right': ['doble derecha', 'ir al final'],
  'credit-card': ['tarjeta', 'pago'],
  'file-lock': ['archivo protegido', 'documento bloqueado'],
  'file-search': ['buscar archivo', 'buscar documento'],
  film: ['película', 'cine'],
  fingerprint: ['huella', 'biometría'],
  'git-branch': ['rama', 'control de versiones'],
  'git-commit': ['confirmación de código', 'versión'],
  'git-merge': ['fusionar ramas', 'mezclar código'],
  'git-pull-request': ['solicitud de cambios', 'revisión de código'],
  hash: ['almohadilla', 'numeral'],
  headphones: ['auriculares', 'escuchar'],
  kanban: ['tablero', 'tareas'],
  layers: ['capas', 'superposición'],
  luggage: ['equipaje', 'maleta'],
  'mail-open': ['correo abierto', 'leído'],
  megaphone: ['megáfono', 'anuncio'],
  monitor: ['pantalla', 'ordenador'],
  moon: ['luna', 'modo oscuro'],
  music: ['música', 'canción'],
  'phone-call': ['llamada', 'teléfono sonando'],
  'phone-off': ['llamada terminada', 'teléfono apagado'],
  plane: ['avión', 'vuelo'],
  power: ['encender', 'apagar'],
  presentation: ['presentación', 'diapositivas'],
  quote: ['cita', 'citar'],
  receipt: ['recibo', 'factura'],
  record: ['grabar', 'grabación'],
  repeat: ['repetir', 'bucle'],
  scissors: ['tijeras', 'cortar'],
  'shield-alert': ['alerta de seguridad', 'riesgo'],
  'shopping-bag': ['bolsa de compra', 'tienda'],
  'shopping-cart': ['carrito', 'comprar'],
  shuffle: ['aleatorio', 'mezclar'],
  'sliders-horizontal': ['ajustes', 'controles'],
  smartphone: ['móvil', 'teléfono inteligente'],
  strikethrough: ['tachar', 'texto tachado'],
  sun: ['sol', 'modo claro'],
  target: ['objetivo', 'diana'],
  ticket: ['entrada', 'billete'],
  truck: ['camión', 'envío'],
  wallet: ['cartera', 'saldo'],
};
export const categories = [
  ...new Set(families.map((family) => family.category)),
].sort();

export const glyphTotal = neuralIcons.length;
