// System-admin configuration — who gets notified, how often, and any
// custom vendor classifications beyond the three defaults. Per the spec:
// "who will get notification should be a configurable item, it should not
// be hardcoded... system admin can configure this."
//
// Backed by localStorage for now (see src/utils/storage.js for the same
// pattern used for vendors). Swappable for a real settings API later.

const CONFIG_KEY = 'sustainchain.adminConfig.v1';

const DEFAULT_CONFIG = {
  recipients: ['procurement@perpetualsolutions.example'],
  frequencyMode: 'immediate', // 'immediate' | 'consolidated'
  consolidatedInterval: 'daily', // 'hourly' | 'daily' | 'weekly'
  customTiers: [], // [{ key, label, tier, description }]
};

export function loadAdminConfig() {
  try {
    const raw = window.localStorage.getItem(CONFIG_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveAdminConfig(config) {
  try {
    window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
    /* no-op */
  }
}
