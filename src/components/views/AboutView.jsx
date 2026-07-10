import { aboutIntro, aboutPillars } from '../../data/aboutContent';
import Footer from '../layout/Footer';

export default function AboutView() {
  return (
    <div id="view-about" className="app-view active pt-28 md:pt-32">
      <header className="px-6 max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100 shadow-sm">
          {aboutIntro.eyebrow}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
          {aboutIntro.heading}
        </h1>
      </header>

      <section className="px-6 max-w-3xl mx-auto space-y-6 mb-20">
        {aboutIntro.paragraphs.map((p, i) => (
          <p key={i} className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
            {p}
          </p>
        ))}
      </section>

      <section className="py-20 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-12 text-center">
            The Three Pillars We Assess
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {aboutPillars.map((card) => (
              <div
                key={card.title}
                className="p-8 md:p-10 bg-stone-50 rounded-[2rem] md:rounded-[3rem] card-hover border border-stone-100"
              >
                <div className="text-3xl md:text-4xl mb-5">{card.icon}</div>
                <h3 className="text-lg md:text-xl font-bold mb-3 text-slate-900">{card.title}</h3>
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
