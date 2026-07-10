// Simulated notification dispatch. A real backend would actually send
// mail here; this environment can't (no mail server credentials, and
// nothing should send real email from a client-side prototype). Instead,
// every notification is drafted from src/data/emailTemplates.js and
// logged to a persisted Outbox so the configurable-recipients and
// configurable-frequency behavior described in the spec is genuinely
// visible and testable in a demo.

import { emailTemplates, renderTemplate } from '../data/emailTemplates';
import { loadAdminConfig } from './adminConfig';

const OUTBOX_KEY = 'sustainchain.outbox.v1';

function loadOutbox() {
  try {
    const raw = window.localStorage.getItem(OUTBOX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOutbox(entries) {
  try {
    window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(entries));
  } catch {
    /* no-op */
  }
}

/**
 * Drafts and "sends" (logs) a notification for a given template + data.
 * Respects the admin's configured recipients and frequency mode.
 */
export function sendNotification(templateKey, data) {
  const template = emailTemplates[templateKey];
  if (!template) return;

  const config = loadAdminConfig();
  const subject = renderTemplate(template.subject, data);
  const body = renderTemplate(template.body, data);
  const outbox = loadOutbox();

  outbox.unshift({
    id: `MSG-${Date.now().toString(36).toUpperCase()}`,
    templateKey,
    subject,
    body,
    recipients: config.recipients,
    status: config.frequencyMode === 'immediate' ? 'Sent' : 'Queued for Digest',
    queuedInterval: config.frequencyMode === 'consolidated' ? config.consolidatedInterval : null,
    time: new Date().toLocaleString(),
  });

  saveOutbox(outbox.slice(0, 200)); // cap so it doesn't grow unbounded in a demo session
}

export function getOutbox() {
  return loadOutbox();
}

/** Bundles all currently-queued digest entries into a single consolidated send — simulates the batch job the admin's frequency setting describes. */
export function sendConsolidatedDigestNow() {
  const outbox = loadOutbox();
  const queued = outbox.filter((m) => m.status === 'Queued for Digest');
  if (!queued.length) return 0;

  const rest = outbox.filter((m) => m.status !== 'Queued for Digest');
  const digest = {
    id: `MSG-${Date.now().toString(36).toUpperCase()}`,
    templateKey: 'consolidatedDigest',
    subject: `Consolidated Notification Digest (${queued.length} update${queued.length > 1 ? 's' : ''})`,
    body: queued.map((m) => `• ${m.subject}`).join('\n'),
    recipients: queued[0]?.recipients ?? [],
    status: 'Sent',
    queuedInterval: null,
    time: new Date().toLocaleString(),
  };
  saveOutbox([digest, ...rest]);
  return queued.length;
}

export function clearOutbox() {
  saveOutbox([]);
}
