import { useState } from 'react';
import { loadAdminConfig, saveAdminConfig } from '../../utils/adminConfig';
import { getOutbox, sendConsolidatedDigestNow, clearOutbox } from '../../utils/notifications';
import { tierOptions } from '../../data/tierOptions';
import { usePortalActions } from '../../hooks/usePortalActions';
import VendorRegistryTable from '../common/VendorRegistryTable';
import Footer from '../layout/Footer';

export default function AdminView() {
  const { launchPortal } = usePortalActions();
  const [config, setConfig] = useState(loadAdminConfig());
  const [outbox, setOutbox] = useState(getOutbox());
  const [newRecipient, setNewRecipient] = useState('');
  const [newTierName, setNewTierName] = useState('');
  const [expandedMsg, setExpandedMsg] = useState(null);

  const persist = (next) => {
    setConfig(next);
    saveAdminConfig(next);
  };

  const addRecipient = () => {
    const email = newRecipient.trim();
    if (!email || config.recipients.includes(email)) return;
    persist({ ...config, recipients: [...config.recipients, email] });
    setNewRecipient('');
  };

  const removeRecipient = (email) => persist({ ...config, recipients: config.recipients.filter((r) => r !== email) });

  const addCustomTier = () => {
    const label = newTierName.trim();
    if (!label) return;
    const key = label.toLowerCase().replace(/\s+/g, '_');
    persist({
      ...config,
      customTiers: [
        ...config.customTiers,
        { key, label, tier: label, badge: label[0]?.toUpperCase() ?? '?', description: 'Custom classification added by system admin.' },
      ],
    });
    setNewTierName('');
  };

  const removeCustomTier = (key) => persist({ ...config, customTiers: config.customTiers.filter((t) => t.key !== key) });

  const runDigest = () => {
    const count = sendConsolidatedDigestNow();
    setOutbox(getOutbox());
    if (count === 0) alert('No queued notifications to consolidate.');
  };

  const handleClearOutbox = () => {
    clearOutbox();
    setOutbox([]);
  };

  return (
    <div id="view-admin" className="app-view active pt-28 md:pt-32">
      <header className="px-6 max-w-3xl mx-auto text-center mb-14">
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-slate-200">
          System Admin
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-4">
          Admin Settings
        </h1>
        <p className="text-base text-slate-500 font-medium leading-relaxed">
          Notification routing, classification list, and the notification outbox — all configurable, none hardcoded.
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-6 pb-20 space-y-10">

        {/* Full vendor registry - view, export, and override any vendor */}
        <section className="bg-stone-50 border border-stone-200 rounded-3xl p-8">
          <h2 className="text-lg font-black text-slate-900 mb-1">Vendor Registry</h2>
          <p className="text-xs text-slate-500 font-medium mb-5">
            Every vendor that has registered, at any stage. Export the full registry, jump into any vendor's
            flow, force-approve a vendor that can't go through the normal process (e.g. a utility board), or
            remove a record entirely.
          </p>
          <VendorRegistryTable onOpenVendor={launchPortal} />
        </section>

        {/* Notification recipients + frequency */}
        <section className="bg-stone-50 border border-stone-200 rounded-3xl p-8">
          <h2 className="text-lg font-black text-slate-900 mb-1">Notification Recipients</h2>
          <p className="text-xs text-slate-500 font-medium mb-5">
            Who gets emailed when a vendor registers, submits a questionnaire, pays, or is approved.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {config.recipients.map((r) => (
              <span key={r} className="inline-flex items-center gap-2 bg-white border border-stone-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600">
                {r}
                <button onClick={() => removeRecipient(r)} className="text-stone-400 hover:text-red-500">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="email"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
              placeholder="add-recipient@company.com"
              className="flex-1 px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500"
            />
            <button onClick={addRecipient} className="px-5 py-3 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wide hover:bg-slate-900 transition">
              Add
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-stone-200">
            <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Frequency</p>
            <div className="flex gap-3 mb-4">
              {['immediate', 'consolidated'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => persist({ ...config, frequencyMode: mode })}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wide border transition ${
                    config.frequencyMode === mode ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-400 border-stone-200'
                  }`}
                >
                  {mode === 'immediate' ? '1 Email Per Submission' : 'Consolidated Digest'}
                </button>
              ))}
            </div>
            {config.frequencyMode === 'consolidated' && (
              <div className="flex items-center gap-3">
                <select
                  value={config.consolidatedInterval}
                  onChange={(e) => persist({ ...config, consolidatedInterval: e.target.value })}
                  className="px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
                <button onClick={runDigest} className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700">
                  Send Digest Now (Test)
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Classifications */}
        <section className="bg-stone-50 border border-stone-200 rounded-3xl p-8">
          <h2 className="text-lg font-black text-slate-900 mb-1">Vendor Classifications</h2>
          <p className="text-xs text-slate-500 font-medium mb-5">
            Classification varies by industry — add more beyond the three defaults.
          </p>
          <div className="space-y-2 mb-5">
            {tierOptions.map((t) => (
              <div key={t.key} className="flex items-center justify-between px-4 py-3 bg-white border border-stone-200 rounded-xl">
                <span className="text-sm font-bold text-slate-700">{t.label}</span>
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Default</span>
              </div>
            ))}
            {config.customTiers.map((t) => (
              <div key={t.key} className="flex items-center justify-between px-4 py-3 bg-white border border-emerald-200 rounded-xl">
                <span className="text-sm font-bold text-slate-700">{t.label}</span>
                <button onClick={() => removeCustomTier(t.key)} className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-600">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTierName}
              onChange={(e) => setNewTierName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomTier()}
              placeholder="e.g. Preferred Supplier"
              className="flex-1 px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500"
            />
            <button onClick={addCustomTier} className="px-5 py-3 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wide hover:bg-slate-900 transition">
              Add Classification
            </button>
          </div>
          <p className="text-[10px] text-stone-400 font-medium mt-3">
            New classifications default to informational scoring (no pass/fail gate) until thresholds are configured.
          </p>
        </section>

        {/* Outbox */}
        <section className="bg-stone-50 border border-stone-200 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-black text-slate-900">Notification Outbox</h2>
            <button onClick={handleClearOutbox} className="text-[10px] font-black text-stone-400 hover:text-red-500 uppercase tracking-widest">
              Clear
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium mb-5">
            Drafted from the templates in src/data/emailTemplates.js. No real mail server is connected — this is where you'd verify content before wiring one up.
          </p>
          {outbox.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-8">No notifications yet — trigger one by registering a vendor.</p>
          ) : (
            <div className="space-y-2">
              {outbox.map((msg) => (
                <div key={msg.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{msg.subject}</p>
                      <p className="text-[10px] text-stone-400">{msg.time} · {msg.recipients.join(', ')}</p>
                    </div>
                    <span
                      className={`shrink-0 ml-3 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                        msg.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </button>
                  {expandedMsg === msg.id && (
                    <pre className="px-4 pb-4 text-xs text-slate-600 whitespace-pre-wrap font-sans border-t border-stone-100 pt-3">{msg.body}</pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
