export const NEURAL_ICON_VIEW_BOX = '0 0 24 24' as const;
export const NEURAL_ICON_STROKE_WIDTH = 1.75 as const;

export type NeuralIconCategory =
  'action' | 'communication' | 'file' | 'navigation' | 'status' | 'system';
export type NeuralIconVariant = 'outline' | 'filled';
export type NeuralIconStroke = 'none' | 'currentColor';

export interface NeuralIconDefinition {
  readonly name: string;
  readonly category: NeuralIconCategory;
  readonly tags: readonly string[];
  readonly variant: NeuralIconVariant;
  readonly stroke?: NeuralIconStroke;
  readonly viewBox: typeof NEURAL_ICON_VIEW_BOX;
  readonly paths: readonly string[];
}

type NeuralIconInput = Omit<NeuralIconDefinition, 'viewBox' | 'variant'> & {
  readonly variant?: NeuralIconVariant;
};

export function defineIcon<const T extends NeuralIconInput>(
  definition: T,
): Readonly<
  Omit<T, 'tags' | 'paths' | 'variant'> & {
    tags: Readonly<T['tags']>;
    paths: Readonly<T['paths']>;
    variant: NeuralIconVariant;
    viewBox: typeof NEURAL_ICON_VIEW_BOX;
  }
> {
  return Object.freeze({
    ...definition,
    tags: Object.freeze([...definition.tags]),
    paths: Object.freeze([...definition.paths]),
    variant: definition.variant ?? 'outline',
    viewBox: NEURAL_ICON_VIEW_BOX,
  }) as Readonly<
    Omit<T, 'tags' | 'paths' | 'variant'> & {
      tags: Readonly<T['tags']>;
      paths: Readonly<T['paths']>;
      variant: NeuralIconVariant;
      viewBox: typeof NEURAL_ICON_VIEW_BOX;
    }
  >;
}
