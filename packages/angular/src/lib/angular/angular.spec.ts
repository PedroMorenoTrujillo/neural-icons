import { ComponentFixture, TestBed } from '@angular/core/testing';
import { iconSearch } from '@neural-icons/core/icons/search';
import { NeuralIcon } from './angular';

describe('NeuralIcon', () => {
  let fixture: ComponentFixture<NeuralIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeuralIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(NeuralIcon);
    fixture.componentRef.setInput('icon', iconSearch);
    fixture.detectChanges();
  });

  it('renders deterministic SVG geometry without DOM APIs', () => {
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.querySelectorAll('path')).toHaveLength(iconSearch.paths.length);
    expect(svg.querySelector('path')?.getAttribute('d')).toBe(
      iconSearch.paths[0],
    );
  });

  it('is decorative by default', () => {
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.hasAttribute('role')).toBe(false);
  });

  it('becomes an accessible image when a label is supplied', () => {
    fixture.componentRef.setInput('label', 'Search');
    fixture.componentRef.setInput('size', 20);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Search');
    expect(svg.hasAttribute('aria-hidden')).toBe(false);
    expect(svg.getAttribute('width')).toBe('20px');
  });

  it('returns to decorative mode when the accessible label is blank', () => {
    fixture.componentRef.setInput('label', 'Search');
    fixture.detectChanges();
    fixture.componentRef.setInput('label', '   ');
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.hasAttribute('aria-label')).toBe(false);
    expect(svg.hasAttribute('role')).toBe(false);
  });

  it('renders filled variants with a fill and without a stroke', () => {
    fixture.componentRef.setInput('icon', {
      ...iconSearch,
      name: 'search-filled',
      variant: 'filled',
    });
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('fill')).toBe('currentColor');
    expect(svg.getAttribute('stroke')).toBe('none');
  });
});
