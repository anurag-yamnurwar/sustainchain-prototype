import { usePortal } from '../../hooks/usePortal';
import { usePortalActions } from '../../hooks/usePortalActions';

export default function VendorSwitcher() {
  const { state } = usePortal();
  const { switchVendor } = usePortalActions();

  return (
    <div className="relative group">
      <select
        value={state.activeVendorIndex ?? ''}
        onChange={(e) => switchVendor(parseInt(e.target.value, 10))}
        className="bg-white border border-stone-200 pl-10 pr-10 py-3 rounded-2xl text-[11px] font-black text-slate-800 uppercase tracking-widest shadow-sm outline-none cursor-pointer hover:border-emerald-500 transition-all appearance-none"
      >
        <option value="" disabled>
          Select Active Vendor
        </option>
        {state.vendors.map((v, i) => (
          <option key={v.id} value={i}>
            {v.name} [{v.id}]
          </option>
        ))}
      </select>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600">{'\u{1F465}'}</div>
    </div>
  );
}
