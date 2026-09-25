import { NEURAL_ICON_STROKE_WIDTH } from '@neural-icons/core';
import type { NeuralIconDefinition } from '@neural-icons/core';
import { defineComponent, h } from 'vue';
import type { PropType } from 'vue';

export interface NeuIconProps {
  readonly icon: NeuralIconDefinition;
  /** Sets both dimensions unless width or height is explicitly supplied. Default: 1em. */
  readonly size?: string | number;
  /** Accessible name when aria-label and aria-labelledby are absent. */
  readonly title?: string;
}

const CONTROLLED_ATTRS = new Set([
  'viewBox',
  'viewbox',
  'fill',
  'stroke',
  'stroke-width',
  'strokeWidth',
  'stroke-linecap',
  'strokeLinecap',
  'stroke-linejoin',
  'strokeLinejoin',
  'fill-rule',
  'fillRule',
  'clip-rule',
  'clipRule',
  'xmlns',
  'focusable',
  'role',
  'aria-hidden',
  'innerHTML',
  'outerHTML',
  'textContent',
]);

/** A thin Vue renderer for one granular Core definition. */
export const NeuIcon = defineComponent({
  name: 'NeuIcon',
  inheritAttrs: false,
  props: {
    icon: { type: Object as PropType<NeuralIconDefinition>, required: true },
    size: {
      type: [String, Number] as PropType<string | number>,
      default: '1em',
    },
    title: String,
  },
  setup(props, { attrs }) {
    return () => {
      const icon = props.icon;
      const label =
        typeof attrs['aria-label'] === 'string'
          ? attrs['aria-label'].trim() || undefined
          : undefined;
      const labelledBy =
        typeof attrs['aria-labelledby'] === 'string'
          ? attrs['aria-labelledby'].trim() || undefined
          : undefined;
      const titleText =
        !label && !labelledBy ? props.title?.trim() || undefined : undefined;
      const hasAccessibleName = !!(label || labelledBy || titleText);
      const filled = icon.variant === 'filled';
      const canFill =
        filled &&
        icon.stroke !== 'currentColor' &&
        icon.paths.every((path) => path.trim().endsWith('z'));
      const paths =
        canFill && !icon.separatePaths ? [icon.paths.join(' ')] : icon.paths;
      const safeAttrs: Record<string, unknown> = {};
      for (const [name, value] of Object.entries(attrs)) {
        if (!CONTROLLED_ATTRS.has(name)) safeAttrs[name] = value;
      }

      return h(
        'svg',
        {
          ...safeAttrs,
          xmlns: 'http://www.w3.org/2000/svg',
          width: attrs['width'] ?? props.size,
          height: attrs['height'] ?? props.size,
          viewBox: icon.viewBox,
          fill: canFill ? 'currentColor' : 'none',
          stroke: filled ? (icon.stroke ?? 'currentColor') : 'currentColor',
          'stroke-width': filled
            ? NEURAL_ICON_STROKE_WIDTH * 1.28
            : NEURAL_ICON_STROKE_WIDTH,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'fill-rule': 'evenodd',
          'clip-rule': 'evenodd',
          focusable: 'false',
          role: hasAccessibleName ? 'img' : undefined,
          'aria-hidden': hasAccessibleName ? undefined : 'true',
          'aria-label': label,
          'aria-labelledby': labelledBy,
        },
        [
          ...(titleText ? [h('title', titleText)] : []),
          ...paths.map((path) => h('path', { d: path })),
        ],
      );
    };
  },
});
