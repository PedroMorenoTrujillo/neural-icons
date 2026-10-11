import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_POLICY_VERSION, IconsAnalyticsService } from './analytics.service';

const key = 'neural-icons-analytics-consent';
function setup(hostname = 'icons.neuralui.org', stored?: string, platform = 'browser') {
  const storage = new Map(stored ? [[key, stored]] : []);
  const events = new Subject<unknown>();
  const remove = vi.fn();
  const cookies: string[] = [];
  const win = {
    location: { hostname, origin: `https://${hostname}`, pathname: '/es/', reload: vi.fn() },
    localStorage: { getItem: vi.fn((k: string) => storage.get(k) ?? null), setItem: vi.fn((k: string, v: string) => storage.set(k, v)), removeItem: vi.fn((k: string) => storage.delete(k)) },
    dataLayer: [] as unknown[][],
  };
  const doc = {
    defaultView: win, title: 'Neural UI', referrer: 'https://example.org/docs?email=private#secret',
    createElement: vi.fn(() => ({ id: '', src: '', async: false, remove })),
    head: { appendChild: vi.fn() }, getElementById: vi.fn(() => ({ remove })),
    get cookie() { return '_ga=legacy; _ga_N1HFRNYZ0C=session; theme=light'; },
    set cookie(value: string) { cookies.push(value); },
  };
  TestBed.configureTestingModule({ providers: [
    { provide: DOCUMENT, useValue: doc }, { provide: PLATFORM_ID, useValue: platform },
    { provide: Router, useValue: { events, url: '/es/' } },
  ] });
  return { service: TestBed.inject(IconsAnalyticsService), win, doc, events, storage, remove, cookies };
}
const consent = (choice: string, age = 0, version = CONSENT_POLICY_VERSION) => JSON.stringify({ version, choice, decidedAt: new Date(Date.now() - age).toISOString() });

describe('Production analytics privacy contract', () => {
  afterEach(() => { TestBed.resetTestingModule(); vi.restoreAllMocks(); });

  it.each(['localhost', 'preview.pages.dev', 'neural-ui-showcase.vercel.app'])('never loads Google on %s', hostname => {
    const { service, doc } = setup(hostname);
    service.start(); service.accept();
    expect(service.enabled()).toBe(false);
    expect(doc.head.appendChild).not.toHaveBeenCalled();
  });
  it('does not access tracking on the server', () => {
    const { service, doc } = setup('icons.neuralui.org', undefined, 'server');
    service.start(); service.accept();
    expect(service.enabled()).toBe(false);
    expect(doc.head.appendChild).not.toHaveBeenCalled();
  });
  it('blocks Google until an explicit opt-in and persists rejection without a reload', () => {
    const { service, doc, storage, win } = setup();
    service.start();
    expect(service.consent()).toBe('pending');
    expect(doc.head.appendChild).not.toHaveBeenCalled();
    service.reject();
    expect(JSON.parse(storage.get(key)!)).toMatchObject({ choice: 'denied', version: CONSENT_POLICY_VERSION });
    expect(win.location.reload).not.toHaveBeenCalled();
    expect(doc.head.appendChild).not.toHaveBeenCalled();
  });
  it('loads once, disables advertising, scopes cookies, and sanitizes URLs and referrers', () => {
    const { service, doc, win, events, storage } = setup();
    service.start(); service.accept(); service.accept();
    expect(doc.head.appendChild).toHaveBeenCalledTimes(1);
    expect(doc.createElement.mock.results[0].value.src).toContain('id=G-N1HFRNYZ0C');
    expect(JSON.parse(storage.get(key)!)).toMatchObject({ choice: 'granted', version: CONSENT_POLICY_VERSION });
    const config = win.dataLayer.find(x => x[0] === 'config')?.[2];
    expect(config).toMatchObject({ cookie_domain: 'icons.neuralui.org', cookie_update: false, cookie_expires: 31536000, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_referrer: 'https://example.org/docs' });
    events.next(new NavigationEnd(1, '/es/?email=private#secret', '/es/?email=private#secret'));
    const views = win.dataLayer.filter(x => x[0] === 'event' && x[1] === 'page_view');
    expect(views).toHaveLength(1);
    expect(views[0]?.[2]).toMatchObject({ page_location: 'https://icons.neuralui.org/es/', page_path: '/es/', page_referrer: 'https://example.org/docs' });
    expect(JSON.stringify(win.dataLayer)).not.toContain('private');
    expect(JSON.stringify(win.dataLayer)).not.toContain('secret');
  });
  it.each(['granted', 'denied'])('restores a valid %s choice', choice => {
    const { service, doc } = setup('icons.neuralui.org', consent(choice));
    service.start();
    expect(service.consent()).toBe(choice);
    expect(doc.head.appendChild).toHaveBeenCalledTimes(choice === 'granted' ? 1 : 0);
  });
  it.each(['granted', 'null', '{bad', consent('granted', 366 * 86400000), consent('granted', -86400000), consent('granted', 0, 'old-policy'), consent('unknown')])('rejects invalid or stale consent: %s', value => {
    const { service, doc, storage } = setup('icons.neuralui.org', value);
    service.start();
    expect(service.consent()).toBe('pending');
    expect(storage.has(key)).toBe(false);
    expect(doc.head.appendChild).not.toHaveBeenCalled();
  });
  it('fully stops tracking on withdrawal and deletes host and legacy parent-domain cookies', () => {
    const { service, win, events, remove, cookies } = setup();
    service.start(); service.accept(); service.openSettings(); service.reject();
    expect(remove).toHaveBeenCalledOnce();
    expect(win.location.reload).toHaveBeenCalledOnce();
    expect(cookies.some(x => x.includes('domain=.neuralui.org'))).toBe(true);
    expect(cookies.some(x => x.includes('domain=.icons.neuralui.org'))).toBe(true);
    expect(cookies.every(x => !x.startsWith('theme='))).toBe(true);
    events.next(new NavigationEnd(2, '/private', '/private'));
    expect(win.dataLayer).toEqual([]);
  });
  it('remains usable when local storage is blocked', () => {
    const { service, win, doc } = setup();
    win.localStorage.getItem.mockImplementation(() => { throw new Error('blocked'); });
    win.localStorage.setItem.mockImplementation(() => { throw new Error('blocked'); });
    expect(() => { service.start(); service.accept(); service.reject(); }).not.toThrow();
    expect(doc.head.appendChild).toHaveBeenCalledOnce();
  });
});

