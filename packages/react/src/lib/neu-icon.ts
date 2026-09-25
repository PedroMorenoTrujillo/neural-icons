import { NEURAL_ICON_STROKE_WIDTH } from '@neural-icons/core';
import type { NeuralIconDefinition } from '@neural-icons/core';
import { createElement } from 'react';
import type { ComponentPropsWithRef, ReactElement } from 'react';

type ControlledSvgProps =
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'viewBox'
  | 'fill'
  | 'stroke'
  | 'strokeWidth'
  | 'strokeLinecap'
  | 'strokeLinejoin'
  | 'fillRule'
  | 'clipRule'
  | 'xmlns'
  | 'focusable'
  | 'role'
  | 'aria-hidden';

export interface NeuIconProps extends Omit<
  ComponentPropsWithRef<'svg'>,
  ControlledSvgProps | 'title'
> {
  /** Import one definition from @neural-icons/core/icons/<name>. */
  icon: NeuralIconDefinition;
  /** Sets both dimensions unless width or height is explicitly provided. Default: 1em. */
  size?: number | string;
  /** Accessible name when aria-label and aria-labelledby are absent. */
  title?: string;
}

/** A thin, catalog-free renderer for one Core icon definition. */
export function NeuIcon({
  icon,
  size = '1em',
  width,
  height,
  title,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...svgProps
}: NeuIconProps): ReactElement {
  const label = ariaLabel?.trim() || undefined;
  const labelledBy = ariaLabelledBy?.trim() || undefined;
  const titleText =
    !label && !labelledBy ? title?.trim() || undefined : undefined;
  const hasAccessibleName = !!(label || labelledBy || titleText);
  const filled = icon.variant === 'filled';
  const canFill =
    filled &&
    icon.stroke !== 'currentColor' &&
    icon.paths.every((path) => path.trim().endsWith('z'));
  const paths =
    canFill && !icon.separatePaths ? [icon.paths.join(' ')] : icon.paths;

  return createElement(
    'svg',
    {
      ...svgProps,
      ref,
      xmlns: 'http://www.w3.org/2000/svg',
      width: width ?? size,
      height: height ?? size,
      viewBox: icon.viewBox,
      fill: canFill ? 'currentColor' : 'none',
      stroke: filled ? (icon.stroke ?? 'currentColor') : 'currentColor',
      strokeWidth: filled
        ? NEURAL_ICON_STROKE_WIDTH * 1.28
        : NEURAL_ICON_STROKE_WIDTH,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      focusable: 'false',
      role: hasAccessibleName ? 'img' : undefined,
      'aria-hidden': hasAccessibleName ? undefined : true,
      'aria-label': label,
      'aria-labelledby': labelledBy,
    },
    ...(titleText ? [createElement('title', { key: 'title' }, titleText)] : []),
    ...paths.map((path, index) =>
      createElement('path', { key: index, d: path }),
    ),
  );
}
