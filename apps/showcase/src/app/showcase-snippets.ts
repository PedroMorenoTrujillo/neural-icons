import type { NeuralIconDefinition } from '@neural-icons/core';
import type { Framework } from './showcase-model';

export function exportName(name: string): string {
  return `icon${name.replace(/(^|-)([a-z0-9])/g, (_, _separator, letter: string) => letter.toUpperCase())}`;
}

export function usageSnippet(
  framework: Framework,
  icon: NeuralIconDefinition,
): string {
  const symbol = exportName(icon.name);
  const imported = `import { ${symbol} } from '@neural-icons/core/icons/${icon.name}';`;
  switch (framework) {
    case 'angular':
      return `import { Component } from '@angular/core';\n${imported}\nimport { NeuralIcon } from '@neural-icons/angular';\n\n@Component({\n  selector: 'app-icon-example',\n  imports: [NeuralIcon],\n  template: '<neural-icon [icon]="${symbol}" [size]="24" />',\n})\nexport class IconExample {\n  readonly ${symbol} = ${symbol};\n}`;
    case 'react':
      return `${imported}\nimport { NeuIcon } from '@neural-icons/react';\n\nexport function IconExample() {\n  return <NeuIcon icon={${symbol}} size={24} />;\n}`;
    case 'vue':
      return `<script setup lang="ts">\n${imported}\nimport { NeuIcon } from '@neural-icons/vue';\n</script>\n\n<template>\n  <NeuIcon :icon="${symbol}" :size="24" />\n</template>`;
    case 'html':
      return inlineSvgSnippet(icon);
  }
}

export function inlineSvgSnippet(icon: NeuralIconDefinition): string {
  const filled = icon.variant === 'filled';
  const canFill =
    filled &&
    icon.stroke !== 'currentColor' &&
    icon.paths.every((path) => path.trim().endsWith('z'));
  const paths =
    canFill && !icon.separatePaths
      ? [`  <path d="${icon.paths.join(' ')}" />`]
      : icon.paths.map((path) => `  <path d="${path}" />`);
  const stroke = filled ? (icon.stroke ?? 'currentColor') : 'currentColor';
  return `<svg
  class="brand-icon"
  xmlns="http://www.w3.org/2000/svg"
  width="24" height="24" viewBox="${icon.viewBox}"
  fill="${canFill ? 'currentColor' : 'none'}" stroke="${stroke}"
  stroke-width="${filled ? '2.24' : '1.75'}" stroke-linecap="round" stroke-linejoin="round"
  fill-rule="evenodd" clip-rule="evenodd" aria-hidden="true"
>\n${paths.join('\n')}\n</svg>\n\n<style>\n  .brand-icon { color: #8b5cf6; }\n</style>`;
}

export function imageSnippet(
  icon: NeuralIconDefinition,
  label: string,
): string {
  return `<img src="/icons/${icon.name}.svg" alt="${label}" width="24" height="24">`;
}
