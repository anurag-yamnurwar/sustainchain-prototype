import { usePortalActions } from '../../hooks/usePortalActions';
import Footer from '../layout/Footer';

const intelligenceCards = [
  {
    icon: '\u{1F4BB}',
    title: 'Multi-Vendor Hub',
    text: 'Manage thousands of concurrent vendor onboardings in a single integrated registry with real-time switching.',
  },
  {
    icon: '\u{1F9E0}',
    title: 'Decision Automation',
    text: 'System-driven risk checks auto-reject partners falling below corporate ESG thresholds, ensuring supply chain integrity.',
  },
  {
    icon: '\u{1F4CB}',
    title: 'Audit-Ready Logs',
    text: 'Defend your compliance position with a time-stamped audit trail covering the entire vendor lifecycle.',
  },
];

export default function HomeView() {
  const { launchPortal, showView } = usePortalActions();

  return (
    <div id="view-home" className="app-view active pt-20">
      <header className="relative py-20 sm:py-28 px-6 text-center max-w-6xl mx-auto">
        <div className="inline-flex items-center px-4 sm:px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-8 sm:mb-10 border border-emerald-100 shadow-sm text-center">
          The Industrial Multi-Vendor Vetting Engine
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-slate-900 leading-tight mb-8 sm:mb-10 tracking-tight">
          Sustainability is <span className="text-emerald-600">Performance.</span>
        </h1>
        <p className="text-base sm:text-xl md:text-2xl text-slate-500 mb-10 sm:mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
          Advanced multi-vendor onboarding with automated ESG risk decision logic and seamless ERP synchronization.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
          <button
            onClick={launchPortal}
            className="px-8 sm:px-12 py-5 sm:py-6 bg-emerald-600 text-white rounded-3xl font-black text-base sm:text-xl hover:bg-emerald-700 shadow-2xl transition transform hover:scale-105"
          >
            Launch Enterprise Hub
          </button>
          <button
            onClick={() => showView('overview')}
            className="px-8 sm:px-12 py-5 sm:py-6 bg-white border border-stone-200 text-slate-800 rounded-3xl font-black text-base sm:text-xl hover:bg-slate-50 transition"
          >
            Process Framework
          </button>
        </div>
      </header>

      <section className="py-16 sm:py-24 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-12 sm:mb-20">Strategic Intelligence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {intelligenceCards.map((card) => (
              <div key={card.title} className="p-8 md:p-10 bg-stone-50 rounded-[2rem] md:rounded-[3rem] card-hover border border-stone-100">
                <div className="text-3xl md:text-4xl mb-5 md:mb-6">{card.icon}</div>
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-slate-900">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
