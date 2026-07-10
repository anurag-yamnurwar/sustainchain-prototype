// Local persistence for the portal's vendor registry.
//
// Why this exists: without it, every vendor a reviewer registers vanishes
// on refresh, which makes the whole app feel like a mockup instead of
// software. This is a deliberately small, swappable layer — when a real
// backend exists, `loadVendors`/`saveVendors` are the only two functions
// that need to change to call an API instead of localStorage.

const STORAGE_KEY = 'sustainchain.vendors.v1';

/** Reads the persisted vendor registry. Returns a safe empty default on any failure. */
export function loadVendorRegistry() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { vendors: [], activeVendorIndex: null };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.vendors)) return { vendors: [], activeVendorIndex: null };
    return {
      vendors: parsed.vendors,
      activeVendorIndex: typeof parsed.activeVendorIndex === 'number' ? parsed.activeVendorIndex : null,
    };
  } catch {
    // Corrupt data, private-browsing mode, or storage disabled — fail soft.
    return { vendors: [], activeVendorIndex: null };
  }
}

/** Persists the vendor registry. Silently no-ops if storage isn't available. */
export function saveVendorRegistry(vendors, activeVendorIndex) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ vendors, activeVendorIndex }));
  } catch {
    // Quota exceeded or storage disabled — the session still works,
    // it just won't survive a refresh. Not worth surfacing to the user.
  }
}

export function clearVendorRegistry() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}
