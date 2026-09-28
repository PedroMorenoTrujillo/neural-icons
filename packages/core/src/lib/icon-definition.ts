export const NEURAL_ICON_VIEW_BOX = '0 0 24 24' as const;
export const NEURAL_ICON_STROKE_WIDTH = 1.75 as const;

export type NeuralIconCategory =
  | 'action'
  | 'commerce'
  | 'communication'
  | 'file'
  | 'media'
  | 'navigation'
  | 'status'
  | 'system';
export type NeuralIconVariant = 'outline' | 'filled';
export type NeuralIconStroke = 'none' | 'currentColor';

export interface NeuralIconDefinition {
  readonly name: string;
  readonly family: string;
  readonly category: NeuralIconCategory;
  readonly tags: readonly string[];
  readonly variant: NeuralIconVariant;
  readonly stroke?: NeuralIconStroke;
  readonly separatePaths?: boolean;
  readonly viewBox: typeof NEURAL_ICON_VIEW_BOX;
  readonly paths: readonly string[];
}

type NeuralIconInput = Omit<
  NeuralIconDefinition,
  'family' | 'viewBox' | 'variant'
> & {
  readonly variant?: NeuralIconVariant;
};

type IconFamily<T extends NeuralIconInput> = T['variant'] extends 'filled'
  ? T['name'] extends `${infer Family}-filled`
    ? Family
    : T['name']
  : T['name'];

export function defineIcon<const T extends NeuralIconInput>(
  definition: T,
): Readonly<
  Omit<T, 'tags' | 'paths' | 'variant'> & {
    family: IconFamily<T>;
    tags: Readonly<T['tags']>;
    paths: Readonly<T['paths']>;
    variant: NeuralIconVariant;
    viewBox: typeof NEURAL_ICON_VIEW_BOX;
  }
> {
  return Object.freeze({
    ...definition,
    family: (definition.variant === 'filled' &&
    definition.name.endsWith('-filled')
      ? definition.name.slice(0, -'-filled'.length)
      : definition.name) as IconFamily<T>,
    tags: Object.freeze([...definition.tags]),
    paths: Object.freeze([...definition.paths]),
    variant: definition.variant ?? 'outline',
    viewBox: NEURAL_ICON_VIEW_BOX,
  }) as Readonly<
    Omit<T, 'tags' | 'paths' | 'variant'> & {
      family: IconFamily<T>;
      tags: Readonly<T['tags']>;
      paths: Readonly<T['paths']>;
      variant: NeuralIconVariant;
      viewBox: typeof NEURAL_ICON_VIEW_BOX;
    }
  >;
}
