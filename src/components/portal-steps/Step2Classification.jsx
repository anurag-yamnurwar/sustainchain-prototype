import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import { tierOptions } from '../../data/tierOptions';
import { loadAdminConfig } from '../../utils/adminConfig';

export default function Step2Classification() {
  const { setTier, showView } = usePortalActions();
  const vendor = useActiveVendor();
  const customTiers = loadAdminConfig().customTiers ?? [];
  const allTiers = [...tierOptions, ...customTiers.map((t) => ({ ...t, badgeClasses: 'bg-slate-100 text-slate-600', title: t.label }))];

  return (
    <section className="animate-fade">
      <div className="mb-14 px-8">
        <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Classification Stage</h3>
        <p className="text-stone-400 font-bold uppercase text-[11px] tracking-widest">
          Procurement Review: Classify <span className="text-emerald-600 font-black">{vendor?.name ?? '---'}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-8">
        {allTiers.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setTier(opt.key, opt.label, opt.tier)}
            className="p-12 border-2 border-stone-50 bg-stone-50 rounded-[4rem] text-left hover:border-emerald-600 hover:bg-white transition flex flex-col group min-h-[350px]"
          >
            <div className={`w-16 h-16 ${opt.badgeClasses} rounded-3xl flex items-center justify-center text-2xl font-black mb-8`}>
              {opt.badge}
            </div>
            <h4 className="font-black text-2xl mb-3">{opt.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">{opt.description}</p>
          </button>
        ))}
      </div>

      <div className="px-8 mt-10 text-center">
        <p className="text-[11px] text-stone-400 font-medium mb-2">
          Classification varies by industry — system admin can add more classifications.
        </p>
        <button
          onClick={() => showView('admin')}
          className="text-[11px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition"
        >
          + Manage Classifications in Admin Settings
        </button>
      </div>
    </section>
  );
}
