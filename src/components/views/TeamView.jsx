import { teamMembers, teamNote } from '../../data/teamMembers';
import Footer from '../layout/Footer';

export default function TeamView() {
  return (
    <div id="view-team" className="app-view active pt-28 md:pt-32">
      <header className="px-6 max-w-3xl mx-auto text-center mb-14">
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-emerald-100 shadow-sm">
          The Team
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
          People Behind the Portal
        </h1>
        <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">
          The Procurement and ESG team responsible for vendor onboarding, scoring, and approvals.
        </p>
      </header>

      <section className="px-6 max-w-6xl mx-auto pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="p-6 md:p-8 bg-stone-50 rounded-[2rem] card-hover border border-stone-100 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-emerald-600 text-white flex items-center justify-center text-xl md:text-2xl font-black mb-5 shadow-lg shadow-emerald-100">
                {member.initials}
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">{member.name}</h3>
              <p className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-widest mt-1 mb-4">
                {member.role}
              </p>
              <p className="text-sm text-slate-500 leading-relaxed">{member.blurb}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-stone-400 font-medium mt-14 max-w-xl mx-auto leading-relaxed">
          {teamNote}
        </p>
      </section>

      <Footer />
    </div>
  );
}
