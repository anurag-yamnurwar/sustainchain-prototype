import { useState } from 'react';
import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import { questionBank } from '../../data/questionBank';
import { getApplicableTopicIds, getTopicRequirement, getEvidenceRequirement } from '../../data/applicabilityMatrix';

const PILLAR_LABEL = { E: 'Environmental', S: 'Social', G: 'Governance' };
const PILLAR_COLOR = { E: 'bg-emerald-100 text-emerald-700', S: 'bg-blue-100 text-blue-700', G: 'bg-purple-100 text-purple-700' };

function isAnswered(value) {
  return value !== undefined && value !== null && value !== '';
}

function QuestionField({ question, requirement, value, onChange }) {
  const required = requirement === 'mandatory';

  return (
    <div className="py-4 border-b border-stone-100 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <p className="text-sm font-bold text-slate-700 leading-snug">
          {question.text} {required && <span className="text-red-500">*</span>}
        </p>
        {!required && (
          <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-stone-400 bg-stone-100 px-2 py-1 rounded-lg">
            Optional
          </span>
        )}
      </div>

      {(question.type === 'yesno' || question.type === 'evidence') && (
        <div className="flex gap-3">
          {question.type === 'evidence' && <span className="text-lg leading-none self-center">📎</span>}
          {['Yes', 'No'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt === 'Yes')}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wide border transition-colors ${
                value === (opt === 'Yes')
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-400 border-stone-200 hover:border-emerald-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {question.type === 'text' && (
        <textarea
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
        />
      )}

      {question.type === 'number' && (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-40 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
        />
      )}

      {question.type === 'percent' && (
        <div className="relative w-40">
          <input
            type="number"
            min="0"
            max="100"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 pr-9 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">%</span>
        </div>
      )}
    </div>
  );
}

export default function Step3Audit() {
  const { submitQuestionnaire, resubmitAnswers } = usePortalActions();
  const vendor = useActiveVendor();
  const tierKey = vendor?.tier?.key;
  const isResubmission = vendor?.questionnaireStatus === 'info_requested';
  const [answers, setAnswers] = useState(vendor?.answers ?? {});
  const [note, setNote] = useState('');

  if (!tierKey) {
    return <p className="text-center text-stone-400 py-20">Vendor must be classified before the questionnaire can be generated.</p>;
  }

  const applicableTopicIds = getApplicableTopicIds(tierKey);
  const topics = questionBank.filter((t) => applicableTopicIds.includes(t.id));
  const evidenceReq = getEvidenceRequirement(tierKey);

  const setAnswer = (qId, val) => setAnswers((prev) => ({ ...prev, [qId]: val }));

  const missingMandatory = topics.flatMap((t) =>
    t.questions.filter((q) => {
      const req = q.role === 'evidence' ? evidenceReq : getTopicRequirement(tierKey, t.id);
      return req === 'mandatory' && !isAnswered(answers[q.id]);
    })
  );

  const handleSubmit = () => {
    if (missingMandatory.length > 0) return;
    if (isResubmission) {
      resubmitAnswers(answers, note.trim());
    } else {
      submitQuestionnaire(answers);
    }
  };

  const grouped = { E: topics.filter((t) => t.pillar === 'E'), S: topics.filter((t) => t.pillar === 'S'), G: topics.filter((t) => t.pillar === 'G') };

  return (
    <section className="animate-fade max-w-3xl mx-auto">
      <div className="mb-10 px-2">
        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">ESG Questionnaire</h3>
        <p className="text-stone-400 font-bold uppercase text-[11px] tracking-widest">
          {vendor?.tier?.label} · {vendor?.name}
        </p>
      </div>

      {isResubmission && vendor.infoRequests.length > 0 && (
        <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Procurement Requested More Detail</p>
          <p className="text-sm text-amber-800 font-medium">{vendor.infoRequests[vendor.infoRequests.length - 1].message}</p>
        </div>
      )}

      {Object.entries(grouped).map(([pillar, pillarTopics]) =>
        pillarTopics.length ? (
          <div key={pillar} className="mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest mb-4 ${PILLAR_COLOR[pillar]}`}>
              {pillar} — {PILLAR_LABEL[pillar]}
            </div>
            <div className="space-y-4">
              {pillarTopics.map((topic) => {
                const req = getTopicRequirement(tierKey, topic.id);
                return (
                  <div key={topic.id} className="bg-white border border-stone-200 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-black text-slate-800">
                        {topic.id} · {topic.topic}
                      </h4>
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                          req === 'mandatory' ? 'bg-red-50 text-red-500' : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        {req}
                      </span>
                    </div>
                    {topic.questions.map((q) => (
                      <QuestionField
                        key={q.id}
                        question={q}
                        requirement={q.role === 'evidence' ? evidenceReq : req}
                        value={answers[q.id]}
                        onChange={(val) => setAnswer(q.id, val)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null
      )}

      {isResubmission && (
        <div className="mb-6">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Note to Procurement (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Anything you'd like to explain about the updates..."
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500"
          />
        </div>
      )}

      {missingMandatory.length > 0 && (
        <p className="text-xs text-red-500 font-bold text-center mb-4">
          {missingMandatory.length} mandatory field{missingMandatory.length > 1 ? 's' : ''} remaining.
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={missingMandatory.length > 0}
        className="w-full py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isResubmission ? 'Resubmit Updated Responses' : 'Submit Questionnaire'}
      </button>
    </section>
  );
}
