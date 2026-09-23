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
      paths: ['M4 4h16v16H4z'],
    });
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('fill')).toBe('currentColor');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
  });

  it('renders closed Filled contours as one compound path', () => {
    fixture.componentRef.setInput('icon', {
      ...iconSearch,
      name: 'compound-filled',
      variant: 'filled',
      paths: ['M3 3h18v18H3z', 'M8 8h8v8H8z'],
    });
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    const paths = svg.querySelectorAll('path');
    expect(paths).toHaveLength(1);
    expect(paths[0]?.getAttribute('d')).toBe('M3 3h18v18H3z M8 8h8v8H8z');
  });

  it('keeps independent Filled layers as separate paths', () => {
    fixture.componentRef.setInput('icon', {
      ...iconSearch,
      name: 'layered-filled',
      variant: 'filled',
      separatePaths: true,
      paths: ['M3 3h18v18H3z', 'M8 8h8v8H8z'],
    });
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('svg path');
    expect(paths).toHaveLength(2);
    expect(paths[0]?.getAttribute('d')).toBe('M3 3h18v18H3z');
    expect(paths[1]?.getAttribute('d')).toBe('M8 8h8v8H8z');
  });

  it('keeps an intentionally stroked Filled glyph unfilled even with a closed path', () => {
    fixture.componentRef.setInput('icon', {
      ...iconSearch,
      name: 'stroked-filled',
      variant: 'filled',
      stroke: 'currentColor',
      paths: ['M4 4h16v16H4z'],
    });
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
  });
});
