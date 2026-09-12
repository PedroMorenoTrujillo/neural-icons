export const NEURAL_ICON_VIEW_BOX = '0 0 24 24' as const;
export const NEURAL_ICON_STROKE_WIDTH = 1.75 as const;

export type NeuralIconCategory =
  'action' | 'communication' | 'file' | 'navigation' | 'status' | 'system';
export type NeuralIconVariant = 'outline' | 'filled';

export interface NeuralIconDefinition {
  readonly name: string;
  readonly category: NeuralIconCategory;
  readonly tags: readonly string[];
  readonly variant: NeuralIconVariant;
  readonly viewBox: typeof NEURAL_ICON_VIEW_BOX;
  readonly paths: readonly string[];
}

export function defineIcon<
  const T extends Omit<NeuralIconDefinition, 'viewBox' | 'variant'>,
>(
  definition: T,
): Readonly<
  Omit<T, 'tags' | 'paths'> & {
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
    variant: 'outline' as const,
    viewBox: NEURAL_ICON_VIEW_BOX,
  }) as Readonly<
    Omit<T, 'tags' | 'paths'> & {
      tags: Readonly<T['tags']>;
      paths: Readonly<T['paths']>;
      variant: NeuralIconVariant;
      viewBox: typeof NEURAL_ICON_VIEW_BOX;
    }
  >;
}
