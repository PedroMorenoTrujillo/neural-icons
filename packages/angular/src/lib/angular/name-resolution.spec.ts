import { Component, signal } from '@angular/core';
import type { Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { iconCheckFilled } from '@neural-icons/core/icons/check-filled';
import { iconDownload } from '@neural-icons/core/icons/download';
import { iconSave } from '@neural-icons/core/icons/save';
import { NeuralIcon } from './angular';
import { provideAllNeuralIcons } from './provide-all-neural-icons';
import { provideNeuralIcons } from './provide-neural-icons';

async function createIcon(providers: Provider[] = []) {
  await TestBed.configureTestingModule({
    imports: [NeuralIcon],
    providers,
  }).compileComponents();
  return TestBed.createComponent(NeuralIcon);
}

describe('NeuralIcon name resolution', () => {
  it('renders a direct definition without registration', async () => {
    const fixture = await createIcon();
    fixture.componentRef.setInput('icon', iconSave);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('svg path')?.getAttribute('d'),
    ).toBe(iconSave.paths[0]);
  });

  it('resolves a registered string name synchronously', async () => {
    const fixture = await createIcon(provideNeuralIcons(iconSave));
    fixture.componentRef.setInput('icon', 'save');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-neural-icon')).toBe('save');
    expect(
      fixture.nativeElement.querySelector('svg path')?.getAttribute('d'),
    ).toBe(iconSave.paths[0]);
  });

  it('composes provider calls and switches between registered names', async () => {
    const fixture = await createIcon([
      provideNeuralIcons(iconSave),
      provideNeuralIcons(iconDownload),
    ]);
    fixture.componentRef.setInput('icon', 'save');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('svg path')?.getAttribute('d'),
    ).toBe(iconSave.paths[0]);

    fixture.componentRef.setInput('icon', 'download');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('svg path')?.getAttribute('d'),
    ).toBe(iconDownload.paths[0]);
    expect(fixture.nativeElement.querySelectorAll('svg')).toHaveLength(1);
  });

  it('uses the last same-name provider, including harmless duplicates', async () => {
    const replacement = { ...iconSave, paths: ['M4 4h16v16H4z'] };
    const fixture = await createIcon([
      provideNeuralIcons(iconSave, iconSave),
      provideNeuralIcons(replacement),
    ]);
    fixture.componentRef.setInput('icon', 'save');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('svg path')?.getAttribute('d'),
    ).toBe(replacement.paths[0]);
  });

  it('renders no geometry for an unregistered name and warns once in dev mode', async () => {
    const warning = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    try {
      const fixture = await createIcon();
      fixture.componentRef.setInput('icon', 'save');
      fixture.componentRef.setInput('label', 'Save');
      fixture.detectChanges();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('svg')).toBeNull();
      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning.mock.calls[0]?.[0]).toContain('"save" is not registered');
    } finally {
      warning.mockRestore();
    }
  });

  it('preserves outline, filled, and accessibility behavior for names', async () => {
    const fixture = await createIcon(
      provideNeuralIcons(iconSave, iconCheckFilled),
    );
    fixture.componentRef.setInput('icon', 'save');
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.hasAttribute('aria-label')).toBe(false);

    fixture.componentRef.setInput('icon', 'check-filled');
    fixture.componentRef.setInput('label', 'Done');
    fixture.detectChanges();
    const filled = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(filled.getAttribute('fill')).toBe('currentColor');
    expect(filled.getAttribute('role')).toBe('img');
    expect(filled.getAttribute('aria-label')).toBe('Done');
  });

  it('offers an explicit complete-catalog provider', async () => {
    const fixture = await createIcon(provideAllNeuralIcons());
    fixture.componentRef.setInput('icon', 'save');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('svg path')?.getAttribute('d'),
    ).toBe(iconSave.paths[0]);
  });
});

@Component({
  selector: 'neural-name-host',
  imports: [NeuralIcon],
  template: '<neural-icon [icon]="name()" />',
})
class NameHost {
  readonly name = signal<'save' | 'download'>('save');
}

describe('NeuralIcon template name input', () => {
  it('accepts a reactive name through the one icon input', async () => {
    await TestBed.configureTestingModule({
      imports: [NameHost],
      providers: [provideNeuralIcons(iconSave, iconDownload)],
    }).compileComponents();
    const fixture: ComponentFixture<NameHost> =
      TestBed.createComponent(NameHost);
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('neural-icon')
        ?.getAttribute('data-neural-icon'),
    ).toBe('save');
    fixture.componentInstance.name.set('download');
    fixture.detectChanges();
    expect(
      fixture.nativeElement
        .querySelector('neural-icon')
        ?.getAttribute('data-neural-icon'),
    ).toBe('download');
  });
});
