import { questionBank } from '../data/questionBank';
import { getApplicableTopicIds } from '../data/applicabilityMatrix';
import { tierThresholds } from '../data/tierOptions';

/**
 * Scores a single topic block 0-4 against the spec's bands:
 *   0 - no evidence          1 - policy only
 *   2 - policy + partial KPIs   3 - policy + KPIs + targets
 *   4 - policy + KPIs + targets + third-party assurance
 *
 * Generalized so it works regardless of which maturity dimensions
 * (policy/kpi/target/evidence) a given topic actually has questions for:
 * a topic missing a dimension simply can't score points for it. This is a
 * first, defensible version — the exact per-topic weighting is easy to
 * tune here without touching anything that calls this function.
 */
export function scoreTopic(topic, answers) {
  const isFilled = (v) => v !== undefined && v !== null && v !== '' && v !== false;

  const byRole = (role) => topic.questions.filter((q) => q.role === role);
  const anyAnswered = (qs, truthyOnly = true) =>
    qs.some((q) => (truthyOnly ? answers[q.id] === true || (answers[q.id] && answers[q.id].fileName) : isFilled(answers[q.id])));

  const policyQs = byRole('policy');
  const kpiQs = byRole('kpi');
  const targetQs = byRole('target');
  const evidenceQs = byRole('evidence');

  // "Policy" is the base signal. If a topic has no explicit policy-role
  // question (rare), fall back to any answered question as the base signal.
  const hasPolicy = policyQs.length
    ? anyAnswered(policyQs, false) && policyQs.some((q) => answers[q.id] === true || (answers[q.id] && answers[q.id].fileName))
    : topic.questions.some((q) => isFilled(answers[q.id]));

  if (!hasPolicy) return 0;

  const hasKpi = kpiQs.length ? anyAnswered(kpiQs, false) : false;
  const hasTarget = targetQs.length ? anyAnswered(targetQs, true) : false;
  const hasEvidence = evidenceQs.length ? anyAnswered(evidenceQs, false) : false;

  const dimensionsPresent = [kpiQs.length > 0, targetQs.length > 0, evidenceQs.length > 0].filter(Boolean).length;
  const dimensionsMet = [hasKpi, hasTarget, hasEvidence].filter(Boolean).length;

  if (dimensionsPresent === 0) return hasPolicy ? Math.min(2, 1) : 0; // policy-only topic
  return Math.min(4, 1 + dimensionsMet);
}

/**
 * Computes per-topic scores, pillar averages, and overall average for a
 * vendor's tier, then evaluates that tier's pass/fail threshold.
 *
 * @param {string} tierKey - 'strategic' | 'critical' | 'routine' | custom
 * @param {Object} answers - { [questionId]: value }
 */
export function calculateScores(tierKey, answers) {
  const applicableTopicIds = getApplicableTopicIds(tierKey);
  const topics = questionBank.filter((t) => applicableTopicIds.includes(t.id));

  const topicScores = {};
  topics.forEach((t) => {
    topicScores[t.id] = scoreTopic(t, answers);
  });

  const scoresByPillar = { E: [], S: [], G: [] };
  topics.forEach((t) => scoresByPillar[t.pillar].push(topicScores[t.id]));

  const avg = (arr) => (arr.length ? arr.reduce((s, n) => s + n, 0) / arr.length : 0);
  const pillarAvg = {
    env: avg(scoresByPillar.E),
    soc: avg(scoresByPillar.S),
    gov: avg(scoresByPillar.G),
  };
  const overallAvg = avg(Object.values(topicScores));

  const threshold = tierThresholds[tierKey] ?? { minAvg: 0, noZeroTopics: [], informationalOnly: true };
  const noZeroFailures = threshold.noZeroTopics.filter((tid) => (topicScores[tid] ?? 0) === 0);
  const meetsAvg = overallAvg >= threshold.minAvg;
  const passed = threshold.informationalOnly ? true : meetsAvg && noZeroFailures.length === 0;

  return {
    topicScores,
    pillarAvg,
    overallAvg: Math.round(overallAvg * 100) / 100,
    // Percentages (0-100) for the existing chart components, derived from the 0-4 bands.
    env: Math.round((pillarAvg.env / 4) * 100),
    soc: Math.round((pillarAvg.soc / 4) * 100),
    gov: Math.round((pillarAvg.gov / 4) * 100),
    aggregate: Math.round((overallAvg / 4) * 100),
    threshold,
    noZeroFailures,
    passed,
    informationalOnly: !!threshold.informationalOnly,
  };
}

/** Returns the Tailwind-friendly color for a given aggregate score (0-100). */
export function scoreColor(aggregate) {
  if (aggregate >= 75) return '#059669'; // emerald
  if (aggregate >= 50) return '#d97706'; // amber
  return '#dc2626'; // red
}
