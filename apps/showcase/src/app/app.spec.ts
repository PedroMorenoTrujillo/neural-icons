import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('renders outline cards with a slot for each variant', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Neural Icons');
    expect(compiled.querySelectorAll('article.card')).toHaveLength(199);
    expect(compiled.querySelectorAll('.variant')).toHaveLength(398);
    expect(compiled.querySelectorAll('.filled-stage')).toHaveLength(199);
    expect(compiled.querySelectorAll('.unavailable-stage')).toHaveLength(0);
  });
});
