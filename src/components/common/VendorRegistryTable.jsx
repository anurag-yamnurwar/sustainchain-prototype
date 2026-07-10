import { usePortal } from '../../hooks/usePortal';
import { usePortalActions } from '../../hooks/usePortalActions';
import { exportAllVendorsToExcel } from '../../utils/erpExport';

const STATUS_COLORS = {
  'Registered': 'bg-stone-100 text-stone-500',
  'Registration Committed': 'bg-stone-100 text-stone-500',
  'Application Fee Paid': 'bg-blue-50 text-blue-600',
  'Risk Tier Assigned': 'bg-blue-50 text-blue-600',
  'Questionnaire Submitted': 'bg-amber-50 text-amber-600',
  'Additional Info Requested': 'bg-amber-50 text-amber-700',
  'Additional Info Submitted': 'bg-amber-50 text-amber-600',
  'Questionnaire Accepted': 'bg-blue-50 text-blue-600',
  'ESG Scoring Complete': 'bg-blue-50 text-blue-600',
  'Pending Final Registration Fee': 'bg-amber-50 text-amber-700',
  'Rejected - Insufficient ESG Rating': 'bg-red-50 text-red-600',
  'Manual Rejection Staged': 'bg-red-50 text-red-600',
  'Approved Vendor': 'bg-emerald-50 text-emerald-700',
  'Approved Vendor (Admin Override)': 'bg-emerald-50 text-emerald-700',
};

export default function VendorRegistryTable({ onOpenVendor }) {
  const { state } = usePortal();
  const { switchVendor, adminForceApprove, deleteVendor } = usePortalActions();
  const vendors = state.vendors;

  const approvedCount = vendors.filter((v) => v.status.startsWith('Approved')).length;
  const rejectedCount = vendors.filter((v) => v.status.includes('Rejected')).length;
  const inProgressCount = vendors.length - approvedCount - rejectedCount;

  const handleOpen = (index) => {
    switchVendor(index);
    onOpenVendor?.();
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Vendors" value={vendors.length} />
        <StatCard label="Approved" value={approvedCount} accent="emerald" />
        <StatCard label="In Progress" value={inProgressCount} accent="amber" />
        <StatCard label="Rejected" value={rejectedCount} accent="red" />
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => exportAllVendorsToExcel(vendors)}
          disabled={vendors.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition disabled:opacity-40"
        >
          <span>📊</span> Export All to Excel
        </button>
      </div>

      {vendors.length === 0 ? (
        <p className="text-center text-sm text-stone-400 py-12 bg-stone-50 rounded-2xl border border-stone-200">
          No vendors registered yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-[10px] font-black uppercase tracking-widest text-stone-400">
              <tr>
                <th className="text-left px-4 py-3">Vendor</th>
                <th className="text-left px-4 py-3">Classification</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">ESG Score</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {vendors.map((v, i) => (
                <tr key={v.id} className="bg-white hover:bg-stone-50/60 transition">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-800">{v.name}</p>
                    <p className="text-[10px] text-stone-400 font-mono">{v.id} · {v.applicationId}</p>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-500">{v.tier?.label ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-lg ${STATUS_COLORS[v.status] ?? 'bg-stone-100 text-stone-500'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-600">
                    {v.scores?.overallAvg ? `${v.scores.overallAvg.toFixed(2)} / 4.0` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpen(i)} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-800">
                        Open
                      </button>
                      {!v.status.startsWith('Approved') && (
                        <button onClick={() => adminForceApprove(i)} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-700">
                          Force Approve
                        </button>
                      )}
                      <button
                        onClick={() => window.confirm(`Delete vendor "${v.name}"? This cannot be undone.`) && deleteVendor(i)}
                        className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  const accentClasses = {
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-50 text-amber-700 border border-amber-100',
    red: 'bg-red-50 text-red-600 border border-red-100',
  };
  return (
    <div className={`rounded-2xl p-5 text-center ${accent ? accentClasses[accent] : 'bg-white border border-stone-200'}`}>
      <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${accent === 'emerald' ? 'text-emerald-100' : 'text-stone-400'}`}>{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}
