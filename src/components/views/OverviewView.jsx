import { usePortalActions } from '../../hooks/usePortalActions';
import { onboardingProcess, step1FieldSpec } from '../../data/overviewSteps';
import Footer from '../layout/Footer';

export default function OverviewView() {
  const { launchPortal } = usePortalActions();

  return (
    <div id="view-overview" className="app-view active pt-28 md:pt-32">
      <header className="px-6 max-w-3xl mx-auto text-center mb-16">
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100 shadow-sm">
          Vendor Onboarding Process
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
          From Enquiry to Approved Vendor
        </h1>
        <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">
          Eight stages take a vendor from initial registration to a fully approved, ERP-synced supply chain partner.
        </p>
      </header>

      {/* 8-stage process timeline */}
      <section className="px-6 max-w-4xl mx-auto mb-20">
        <ol className="space-y-4">
          {onboardingProcess.map((item) => (
            <li
              key={item.step}
              className="flex items-start gap-5 md:gap-6 p-5 md:p-6 bg-stone-50 rounded-[1.5rem] md:rounded-[2rem] border border-stone-100"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm md:text-base shadow-md shadow-emerald-100">
                {item.step}
              </div>
              <div>
                <h3 className="text-sm md:text-base font-black text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Step 1 field-level detail */}
      <section className="py-16 md:py-20 bg-white border-y border-stone-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 text-center">
            {step1FieldSpec.title}
          </h2>
          <p className="text-sm md:text-base text-slate-500 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
            {step1FieldSpec.intro}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {step1FieldSpec.fields.map((field) => (
              <div
                key={field}
                className="flex items-center gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-100 text-sm font-bold text-slate-700"
              >
                <span className="text-emerald-600 font-black">&#10003;</span>
                <span>{field}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center py-16 px-6">
        <button
          onClick={launchPortal}
          className="px-10 md:px-12 py-5 md:py-6 bg-emerald-600 text-white rounded-3xl font-black text-base md:text-xl hover:bg-emerald-700 shadow-2xl transition transform hover:scale-105"
        >
          Launch Enterprise Hub &rarr;
        </button>
      </div>

      <Footer />
    </div>
  );
}
