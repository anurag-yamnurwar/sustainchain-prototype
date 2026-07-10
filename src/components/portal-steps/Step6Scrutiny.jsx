import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';

export default function Step6Scrutiny() {
  const { declineApplication, executeRiskBasedApproval } = usePortalActions();
  const vendor = useActiveVendor();

  return (
    <section className="text-center py-20 animate-fade">
      <div className="max-w-3xl mx-auto p-16 bg-stone-50 border border-stone-200 rounded-[6rem] shadow-inner relative overflow-hidden">
        <div className="text-8xl mb-12">{'\u{1F4CB}'}</div>
        <h3 className="text-4xl font-black mb-6 tracking-tight">Enterprise Scrutiny</h3>
        <p className="text-slate-500 mb-8 text-lg font-medium leading-relaxed px-10">
          System has verified Identity, Payment, ESG Scores, and Auditor Logs. Human Scrutiny is required before the final registration fee and Approved Vendor status.
        </p>

        {vendor?.scores?.overallAvg !== undefined && (
          <div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-10 font-black text-sm ${
              vendor.scores.informationalOnly
                ? 'bg-blue-50 text-blue-700'
                : vendor.scores.passed
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600'
            }`}
          >
            ESG Score: {vendor.scores.overallAvg?.toFixed?.(2) ?? vendor.scores.overallAvg} / 4.0 —{' '}
            {vendor.scores.informationalOnly ? 'Informational' : vendor.scores.passed ? 'Threshold Met' : 'Below Threshold'}
          </div>
        )}
        <div className="grid grid-cols-2 gap-10 px-10">
          <button
            onClick={declineApplication}
            className="p-8 border-2 border-stone-200 rounded-[2.5rem] font-black text-stone-400 uppercase tracking-widest hover:bg-white transition"
          >
            Decline Application
          </button>
          <button
            onClick={executeRiskBasedApproval}
            className="p-8 bg-emerald-600 text-white rounded-[2.5rem] font-black text-2xl shadow-xl hover:bg-emerald-700 transition transform hover:scale-[1.03]"
          >
            Approve &rarr; Final Payment
          </button>
        </div>

        <div className="mt-16 border-t border-stone-200 pt-10 text-left">
          <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Vendor Lifecycle History</h5>
          <ul className="space-y-3">
            {vendor?.history
              .slice()
              .reverse()
              .map((h, i) => (
                <li key={i} className="flex justify-between items-center text-[10px] bg-white border border-stone-200 px-5 py-2 rounded-xl font-bold">
                  <span className="text-slate-800 uppercase tracking-tighter">{h.status}</span>
                  <span className="text-stone-400">{h.time}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
