// Vendor classification per Step 2 of the vendor onboarding process.
// Per the spec: "This classification varies from industry to industry —
// system admin will have an option to add more classification." The three
// below are the defaults; custom tiers added via Admin Settings are merged
// in at render time (see Step2Classification.jsx / utils/adminConfig.js).

export const tierOptions = [
  {
    key: 'strategic',
    label: 'Strategic Supplier',
    tier: 'Strategic',
    badge: 'S',
    badgeClasses: 'bg-red-100 text-red-600',
    title: 'Strategic Supplier',
    description: 'High-spend, high-dependency vendors. Full ESG questionnaire mandatory across all pillars.',
  },
  {
    key: 'critical',
    label: 'Critical Supplier',
    tier: 'Critical',
    badge: 'C',
    badgeClasses: 'bg-amber-100 text-amber-600',
    title: 'Critical Supplier',
    description: 'Important but replaceable vendors. Core ESG topics mandatory, others optional.',
  },
  {
    key: 'routine',
    label: 'Routine Supplier',
    tier: 'Routine',
    badge: 'R',
    badgeClasses: 'bg-emerald-100 text-emerald-600',
    title: 'Routine Supplier',
    description: 'Low-risk, low-spend vendors. Light-touch screening — used for improvement plans, not gating.',
  },
];

// Scoring thresholds per the spec's "Scoring & Acceptance" section.
// Custom tiers added via Admin Settings default to `informationalOnly`
// (screening/no gate) unless a threshold is explicitly configured.
export const tierThresholds = {
  strategic: { minAvg: 2.5, noZeroTopics: ['G1', 'S1', 'S2'], informationalOnly: false },
  critical: { minAvg: 2.0, noZeroTopics: ['G1'], informationalOnly: false },
  routine: { minAvg: 0, noZeroTopics: [], informationalOnly: true },
};

export const RISK_REJECT_THRESHOLD = 40; // legacy display-only reference, superseded by tierThresholds
