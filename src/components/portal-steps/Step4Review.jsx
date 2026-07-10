import { useState } from 'react';
import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import { questionBank } from '../../data/questionBank';
import { getApplicableTopicIds } from '../../data/applicabilityMatrix';

function isAnswered(value) {
  return value !== undefined && value !== null && value !== '';
}

export default function Step4Review() {
  const { requestAdditionalInfo, acceptQuestionnaire } = usePortalActions();
  const vendor = useActiveVendor();
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');

  const tierKey = vendor?.tier?.key;
  const applicableTopicIds = tierKey ? getApplicableTopicIds(tierKey) : [];
  const topics = questionBank.filter((t) => applicableTopicIds.includes(t.id));
  const totalQuestions = topics.reduce((sum, t) => sum + t.questions.length, 0);
  const answeredCount = topics.reduce(
    (sum, t) => sum + t.questions.filter((q) => isAnswered(vendor?.answers?.[q.id])).length,
    0
  );

  if (vendor?.questionnaireStatus === 'accepted') {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade">
        <div className="w-16 h-16 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Questionnaire Accepted</h3>
        <p className="text-slate-500 font-medium">Proceed to Step 5 to run ESG scoring.</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!message.trim()) return;
    requestAdditionalInfo(message.trim());
    setMessage('');
    setRequesting(false);
  };

  return (
    <section className="animate-fade max-w-2xl mx-auto">
      <div className="mb-10 px-2">
        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Review & Clarifications</h3>
        <p className="text-stone-400 font-bold uppercase text-[11px] tracking-widest">
          Procurement Review: {vendor?.name}
        </p>
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Questionnaire Completion</p>
            <p className="text-3xl font-black text-slate-900">{answeredCount} / {totalQuestions} <span className="text-sm text-stone-400 font-bold">answered</span></p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center text-sm font-black text-emerald-600">
            {totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0}%
          </div>
        </div>

        {vendor?.clarifications.length > 0 && (
          <div className="mb-4 p-4 bg-white border border-stone-200 rounded-2xl">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Vendor's Latest Note</p>
            <p className="text-sm text-slate-600 font-medium">{vendor.clarifications[vendor.clarifications.length - 1].msg}</p>
          </div>
        )}

        {vendor?.infoRequests.length > 0 && (
          <details className="text-xs text-stone-400">
            <summary className="cursor-pointer font-bold uppercase tracking-widest text-[10px]">
              Request History ({vendor.infoRequests.length})
            </summary>
            <ul className="mt-2 space-y-1">
              {vendor.infoRequests.map((r, i) => (
                <li key={i}>• {r.message} <span className="text-stone-300">({r.time})</span></li>
              ))}
            </ul>
          </details>
        )}
      </div>

      {requesting ? (
        <div className="bg-white border border-amber-200 rounded-3xl p-6 animate-fade">
          <label className="block text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-2">
            What additional detail is needed?
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            autoFocus
            placeholder="e.g. Please attach your ISO 14001 certificate and confirm your Scope 3 roadmap."
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium outline-none focus:border-amber-400 mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setRequesting(false)}
              className="flex-1 py-3 border border-stone-200 rounded-xl font-bold text-sm text-stone-500 hover:bg-stone-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-amber-600 transition disabled:opacity-40"
            >
              Send Request to Vendor
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          <button
            onClick={() => setRequesting(true)}
            className="p-6 border-2 border-stone-200 rounded-3xl font-black text-stone-500 uppercase tracking-widest text-xs hover:bg-stone-50 transition"
          >
            Request Additional Info
          </button>
          <button
            onClick={acceptQuestionnaire}
            className="p-6 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-emerald-700 transition"
          >
            Accept &rarr; Proceed to Scoring
          </button>
        </div>
      )}
    </section>
  );
}
