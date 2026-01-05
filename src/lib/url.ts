const FALLBACK_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXTAUTH_URL ||
  'http://localhost:3000';

function getRuntimeOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return FALLBACK_APP_URL;
}

export function resolveAppUrl(target?: string | null, fallback: string = '/'): URL {
  const base = getRuntimeOrigin();
  const candidate = target && target.trim().length > 0 ? target : fallback;

  try {
    return new URL(candidate, base);
  } catch {
    return new URL(fallback, base);
  }
}

export function getInternalHref(target: string): string {
  const resolved = resolveAppUrl(target);
  const baseOrigin = new URL(getRuntimeOrigin()).origin;
  if (resolved.origin !== baseOrigin) {
    return resolved.toString();
  }

  return `${resolved.pathname}${resolved.search}${resolved.hash}`;
}

export function getAppOrigin(): string {
  return new URL(getRuntimeOrigin()).origin;
}
