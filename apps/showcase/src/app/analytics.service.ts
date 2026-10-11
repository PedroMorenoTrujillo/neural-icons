import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  DestroyRef,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, Subscription } from "rxjs";

type AnalyticsConsent = "pending" | "granted" | "denied";

interface AnalyticsWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

export const MEASUREMENT_ID = "G-N1HFRNYZ0C";
const STORAGE_KEY = "neural-icons-analytics-consent";
// Change this value whenever purposes, providers, or the privacy/cookie policy change.
export const CONSENT_POLICY_VERSION = "2026-10-11-ga4-icons";
const CONSENT_LIFETIME_MS = 365 * 24 * 60 * 60 * 1000;
interface StoredConsent {
  version: string;
  choice: Exclude<AnalyticsConsent, "pending">;
  decidedAt: string;
}
// This separate property and consent choice apply only to the Icons website.
const PRODUCTION_HOSTS = new Set(["icons.neuralui.org"]);

@Injectable({ providedIn: "root" })
export class IconsAnalyticsService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly router = inject(Router, { optional: true });
  private navigationSubscription?: Subscription;
  private consentInitialized = false;
  private trackingInitialized = false;
  private lastTrackedPath: string | undefined;

  readonly enabled = signal(false);
  readonly consent = signal<AnalyticsConsent>("pending");

  constructor() {
    this.destroyRef.onDestroy(() => this.navigationSubscription?.unsubscribe());
  }

  start(): void {
    const win = this.window;
    if (!win || !PRODUCTION_HOSTS.has(win.location.hostname)) return;

    this.enabled.set(true);
    this.prepareConsentMode(win);
    const storedConsent = this.readConsent(win);
    // A departing Google tag can rewrite its session cookie during reload.
    // Clean any residual identifiers before starting a non-consenting page.
    if (storedConsent !== "granted") this.clearAnalyticsCookies();
    if (storedConsent === "granted") {
      this.consent.set("granted");
      this.enableTracking(win);
    } else if (storedConsent === "denied") {
      this.consent.set("denied");
    }
  }

  accept(): void {
    const win = this.window;
    if (!win || !this.enabled()) return;
    this.consent.set("granted");
    this.saveConsent(win, "granted");
    this.enableTracking(win);
  }

  reject(): void {
    const win = this.window;
    if (!win || !this.enabled()) return;
    this.consent.set("denied");
    this.saveConsent(win, "denied");
    // A loaded Google tag cannot be reliably unloaded. A reload stops its
    // listeners and prevents further requests after a withdrawal.
    const wasTracking = this.trackingInitialized;
    this.navigationSubscription?.unsubscribe();
    this.document.getElementById("google-analytics")?.remove();
    win.dataLayer = [];
    win.gtag = () => undefined;
    this.clearAnalyticsCookies();
    if (wasTracking) win.location.reload();
  }

  trackCurrentPage(): void {
    const win = this.window;
    if (win) this.trackPageView(win, win.location.pathname);
  }

  openSettings(): void {
    if (this.enabled()) this.consent.set("pending");
  }

  private get window(): AnalyticsWindow | null {
    return this.isBrowser
      ? (this.document.defaultView as AnalyticsWindow | null)
      : null;
  }

  private get deniedConsent(): Record<string, "denied"> {
    return {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    };
  }

  private prepareConsentMode(win: AnalyticsWindow): void {
    if (this.consentInitialized) return;
    this.consentInitialized = true;
    this.callGtag(win, "consent", "default", this.deniedConsent);
  }

  private enableTracking(win: AnalyticsWindow): void {
    this.callGtag(win, "consent", "update", {
      ...this.deniedConsent,
      analytics_storage: "granted",
    });
    if (this.trackingInitialized) {
      this.trackPageView(win, win.location.pathname);
      return;
    }
    this.trackingInitialized = true;

    const script = this.document.createElement("script");
    script.id = "google-analytics";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    this.document.head.appendChild(script);

    this.callGtag(win, "js", new Date());
    this.callGtag(win, "config", MEASUREMENT_ID, {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      cookie_domain: "icons.neuralui.org",
      cookie_expires: 365 * 24 * 60 * 60,
      cookie_update: false,
      send_page_view: false,
      page_location: `${win.location.origin}${win.location.pathname}`,
      page_referrer: this.safeReferrer(),
    });
    this.trackPageView(win, win.location.pathname);
    this.navigationSubscription = this.router?.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => this.trackPageView(win, event.urlAfterRedirects));
  }

  private trackPageView(win: AnalyticsWindow, path: string): void {
    if (this.consent() !== "granted") return;
    // Demo routes can contain user-entered state in query parameters. Keep it
    // out of Analytics even after consent.
    const pathname = path.split(/[?#]/)[0] || "/";
    if (pathname === this.lastTrackedPath) return;
    this.lastTrackedPath = pathname;
    this.callGtag(win, "event", "page_view", {
      page_location: `${win.location.origin}${pathname}`,
      page_path: pathname,
      page_title: this.document.title,
      page_referrer: this.safeReferrer(),
    });
  }

  private safeReferrer(): string {
    try {
      const referrer = new URL(this.document.referrer);
      return `${referrer.origin}${referrer.pathname}`;
    } catch {
      return "";
    }
  }

  private callGtag(win: AnalyticsWindow, ...args: unknown[]): void {
    win.dataLayer ??= [];
    // Google consumes Arguments commands, not ordinary array messages.
    win.gtag ??= function () {
      // eslint-disable-next-line prefer-rest-params -- Google's command queue requires an Arguments object.
      win.dataLayer?.push(arguments);
    };
    win.gtag(...args);
  }

  private readConsent(win: AnalyticsWindow): AnalyticsConsent | null {
    try {
      const value = win.localStorage.getItem(STORAGE_KEY);
      if (!value) return null;
      const record = JSON.parse(value) as Partial<StoredConsent>;
      const decidedAt = Date.parse(record.decidedAt ?? "");
      const age = Date.now() - decidedAt;
      if (
        record.version !== CONSENT_POLICY_VERSION ||
        (record.choice !== "granted" && record.choice !== "denied") ||
        !Number.isFinite(decidedAt) ||
        age < 0 ||
        age >= CONSENT_LIFETIME_MS
      ) {
        win.localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return record.choice;
    } catch {
      try { win.localStorage.removeItem(STORAGE_KEY); } catch { /* unavailable */ }
      return null;
    }
  }

  private saveConsent(
    win: AnalyticsWindow,
    consent: Exclude<AnalyticsConsent, "pending">,
  ): void {
    try {
      const record: StoredConsent = {
        version: CONSENT_POLICY_VERSION,
        choice: consent,
        decidedAt: new Date().toISOString(),
      };
      win.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Consent remains valid for the current page when storage is unavailable.
    }
  }

  private clearAnalyticsCookies(): void {
    const hostname = this.window?.location.hostname ?? "";
    const parts = hostname.split(".");
    const domains = ["", ...parts.slice(0, -1).map((_, index) =>
      `; domain=.${parts.slice(index).join(".")}`,
    )];
    for (const cookie of this.document.cookie.split(";")) {
      const name = cookie.split("=")[0]?.trim();
      if (name === "_gid" || name?.startsWith("_ga")) {
        for (const domain of domains) {
          this.document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
        }
      }
    }
  }
}

