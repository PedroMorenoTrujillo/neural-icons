import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('Neural Icons public showcase', () => {
  beforeEach(async () => {
    window.history.replaceState({}, '', '/');
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  async function render() {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  async function search(root: HTMLElement, value: string) {
    const input = root.querySelector<HTMLInputElement>('#icon-search')!;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await TestBed.inject(ApplicationRef).whenStable();
  }

  it('shows exactly 197 families and 394 grid glyphs', async () => {
    const { root } = await render();
    expect(root.querySelectorAll('.family-tile')).toHaveLength(197);
    expect(root.querySelectorAll('.tile-preview neural-icon')).toHaveLength(
      394,
    );
    expect(root.querySelector('.masthead-meta')?.textContent).toContain(
      '394 glyphs',
    );
    expect(root.querySelector('.family-tile#family-attach')).toBeNull();
    expect(root.querySelector('.family-tile#family-funnel')).toBeNull();
  });

  it('finds canonical families from approved aliases and category', async () => {
    const { root } = await render();
    await search(root, 'attach');
    expect(root.querySelectorAll('.family-tile')).toHaveLength(1);
    expect(root.querySelector('.tile-name')?.textContent).toBe('paperclip');
    await search(root, 'funnel');
    expect(root.querySelectorAll('.family-tile')).toHaveLength(1);
    expect(root.querySelector('.tile-name')?.textContent).toBe('filter');
    await search(root, 'does-not-exist');
    expect(root.querySelector('.empty-state')).not.toBeNull();
  });

  it('switches grid variants and selects a family without changing identity', async () => {
    const { fixture, root } = await render();
    const filled = [
      ...root.querySelectorAll<HTMLButtonElement>('.variant-control button'),
    ].find((button) => button.textContent?.trim() === 'Filled')!;
    filled.click();
    await fixture.whenStable();
    expect(root.querySelectorAll('.tile-preview neural-icon')).toHaveLength(
      197,
    );
    expect(
      root
        .querySelector('#family-file-text neural-icon')
        ?.getAttribute('data-neural-icon'),
    ).toBe('file-text-filled');

    root.querySelector<HTMLButtonElement>('#family-file-text')!.click();
    await fixture.whenStable();
    expect(root.querySelector('#detail-heading')?.textContent).toBe(
      'file-text',
    );
    expect(window.location.search).toContain('icon=file-text');
    expect(root.querySelector('.detail-panel')).not.toBeNull();
  });
});
