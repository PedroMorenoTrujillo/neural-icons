import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  signal,
} from '@angular/core';
import { NeuralIcon } from '@neural-icons/angular';
import type { NeuralIconDefinition } from '@neural-icons/core';
import { iconCheckFilled } from '@neural-icons/core/icons/check-filled';
import { iconInfo } from '@neural-icons/core/icons/info';
import { iconSearch } from '@neural-icons/core/icons/search';
import { iconX } from '@neural-icons/core/icons/x';

@Component({
  selector: 'neural-icon-hydration',
  imports: [NeuralIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="decorative"><neural-icon [icon]="search" /></section>
    <section id="semantic">
      <neural-icon [icon]="info" label="Information" />
    </section>
    <section id="filled"><neural-icon [icon]="checkFilled" /></section>
    <section id="dynamic"><neural-icon [icon]="dynamicIcon()" /></section>
    <button id="change" type="button" (click)="changeIcon()">
      Change icon
    </button>
    <output id="updates">{{ updates() }}</output>
    <output id="ready">{{ ready() }}</output>
  `,
})
export class NeuralIconHydrationFixture {
  readonly search = iconSearch;
  readonly info = iconInfo;
  readonly checkFilled = iconCheckFilled;
  readonly dynamicIcon = signal<NeuralIconDefinition>(iconSearch);
  readonly updates = signal(0);
  readonly ready = signal(false);

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }

  changeIcon(): void {
    this.dynamicIcon.set(iconX);
    this.updates.update((value) => value + 1);
  }
}
