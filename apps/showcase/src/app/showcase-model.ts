import type { NeuralIconDefinition } from '@neural-icons/core';

export type Framework = 'angular' | 'react' | 'vue' | 'html';
export type Theme = 'light' | 'dark';
export type View = 'home' | 'catalog' | 'guide';

export interface IconFamily {
  readonly name: string;
  readonly category: string;
  readonly keywords: readonly string[];
  readonly outline: NeuralIconDefinition;
  readonly filled: NeuralIconDefinition;
}
