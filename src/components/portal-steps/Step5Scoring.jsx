import { useEffect, useRef } from 'react';
import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import ChartCanvas from '../common/ChartCanvas';

export default function Step5Scoring() {
  const { computeScores, simulateProcessing } = usePortalActions();
  const vendor = useActiveVendor();
  const computedRef = useRef(false);

  const hasScores = vendor?.scores && Object.keys(vendor.scores.topicScores ?? {}).length > 0;

  useEffect(() => {
    if (!hasScores && !computedRef.current && vendor?.tier) {
      computedRef.current = true;
      computeScores();
    }
  }, [hasScores, vendor, computeScores]);

  if (!hasScores) {
    return <p className="text-center text-stone-400 py-20 animate-pulse">Running ESG scoring engine...</p>;
  }

  const { topicScores, pillarAvg, overallAvg, threshold, noZeroFailures, passed, informationalOnly } = vendor.scores;
  const topicIds = Object.keys(topicScores);

  const barConfig = {
    type: 'bar',
    data: {
      labels: topicIds,
      datasets: [
        {
          label: 'Topic Score (0-4)',
          data: topicIds.map((id) => topicScores[id]),
          backgroundColor: topicIds.map((id) => (id.startsWith('E') ? '#10b981' : id.startsWith('S') ? '#3b82f6' : '#a855f7')),
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 4, ticks: { stepSize: 1 } } },
    },
  };

  return (
    <section className="animate-fade max-w-2xl mx-auto">
      <div className="mb-8 px-2">
        <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">ESG Scoring</h3>
        <p className="text-stone-400 font-bold uppercase text-[11px] tracking-widest">{vendor.tier.label} · {vendor.name}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Environmental', value: pillarAvg.env, color: 'text-emerald-600' },
          { label: 'Social', value: pillarAvg.soc, color: 'text-blue-600' },
          { label: 'Governance', value: pillarAvg.gov, color: 'text-purple-600' },
        ].map((p) => (
          <div key={p.label} className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">{p.label}</p>
            <p className={`text-3xl font-black ${p.color}`}>{p.value.toFixed(1)}</p>
            <p className="text-[10px] text-stone-400 font-bold">/ 4.0</p>
          </div>
        ))}
      </div>

      <div className="h-56 mb-6 bg-white border border-stone-200 rounded-3xl p-5">
        <ChartCanvas config={barConfig} />
      </div>

      <div
        className={`rounded-3xl p-6 mb-6 border ${
          informationalOnly
            ? 'bg-blue-50 border-blue-200'
            : passed
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Overall Average</p>
          <p className="text-2xl font-black text-slate-900">{overallAvg.toFixed(2)} / 4.0</p>
        </div>
        <p className="text-xs font-bold text-stone-500 mb-1">
          Threshold: avg &ge; {threshold.minAvg}{threshold.noZeroTopics.length ? `, no zeroes in ${threshold.noZeroTopics.join(', ')}` : ''}
        </p>
        {informationalOnly ? (
          <p className="text-sm font-black text-blue-700">Informational only — used for screening, not a gate.</p>
        ) : passed ? (
          <p className="text-sm font-black text-emerald-700">✓ Threshold met — proceeds to Final Approval.</p>
        ) : (
          <p className="text-sm font-black text-red-600">
            ✗ Threshold not met{noZeroFailures.length ? ` — zero score in ${noZeroFailures.join(', ')}` : ''}.
          </p>
        )}
      </div>

      <button
        onClick={() => simulateProcessing(6)}
        className="w-full py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition"
      >
        Proceed to Final Approval
      </button>
    </section>
  );
}
