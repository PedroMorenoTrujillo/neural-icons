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
};
export const categories = [
  ...new Set(families.map((family) => family.category)),
].sort();

export const glyphTotal = neuralIcons.length;
