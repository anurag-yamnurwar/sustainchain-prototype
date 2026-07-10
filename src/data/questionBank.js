// The actual ESG questionnaire content, topic-by-topic, as specified in
// Vendor_Onboarding_Process.pdf. Each question carries a `role` used by
// utils/scoring.js to compute the 0-4 maturity band per topic:
//   policy   - a foundational policy/practice exists (yes/no)
//   kpi      - a measurable figure is tracked (number/percent/text)
//   target   - forward-looking commitment or recurring practice (yes/no)
//   evidence - certification/attachment proving third-party assurance
//   context  - informational / risk-disclosure, not scored
//
// This is a first, defensible version of the scoring logic per topic —
// procurement can adjust which question drives which role without
// touching the scoring engine itself.

export const questionBank = [
  // ── Environmental ──────────────────────────────────────────────
  {
    id: 'E1', pillar: 'E', topic: 'GHG & Energy',
    questions: [
      { id: 'E1.1', role: 'policy', type: 'yesno', text: 'Do you measure Scope 1 & 2 emissions?' },
      { id: 'E1.2', role: 'target', type: 'yesno', text: 'Do you have energy-reduction targets for the next 3 years?' },
      { id: 'E1.3', role: 'evidence', type: 'evidence', text: 'Evidence: latest GHG/energy data or summary.' },
    ],
  },
  {
    id: 'E2', pillar: 'E', topic: 'Fuels, Electricity & Renewables',
    questions: [
      { id: 'E2.1', role: 'kpi', type: 'text', text: 'Share annual electricity (kWh) and fuel consumption (last FY).' },
      { id: 'E2.2', role: 'kpi', type: 'percent', text: '% of electricity from renewable sources (if any, provide proof).' },
    ],
  },
  {
    id: 'E3', pillar: 'E', topic: 'Water & Waste',
    questions: [
      { id: 'E3.1', role: 'policy', type: 'yesno', text: 'Do you track water withdrawal and discharge volumes?' },
      { id: 'E3.2', role: 'kpi', type: 'yesno', text: 'Hazardous/non-hazardous waste generated and disposal methods documented?' },
      { id: 'E3.3', role: 'evidence', type: 'evidence', text: 'Evidence: waste manifests or equivalent.' },
    ],
  },
  {
    id: 'E4', pillar: 'E', topic: 'Environmental Management',
    questions: [
      { id: 'E4.1', role: 'evidence', type: 'evidence', text: 'Environmental certification (e.g., ISO 14001).' },
      { id: 'E4.2', role: 'target', type: 'yesno', text: 'Do you conduct environmental/legal compliance audits annually?' },
    ],
  },
  {
    id: 'E5', pillar: 'E', topic: 'Materials & Packaging',
    questions: [
      { id: 'E5.1', role: 'policy', type: 'yesno', text: 'Do you use recyclable/reusable packaging?' },
      { id: 'E5.2', role: 'kpi', type: 'percent', text: '% recycled content in packaging/materials.' },
    ],
  },
  {
    id: 'E6', pillar: 'E', topic: 'Product Stewardship',
    questions: [
      { id: 'E6.1', role: 'evidence', type: 'evidence', text: 'REACH/ROHS/SVHC compliance (or equivalent).' },
    ],
  },

  // ── Social ──────────────────────────────────────────────────────
  {
    id: 'S1', pillar: 'S', topic: 'Labor & Human Rights',
    questions: [
      { id: 'S1.1', role: 'policy', type: 'evidence', text: 'Policy prohibiting forced/child labor and excessive overtime (attach).' },
      { id: 'S1.2', role: 'target', type: 'yesno', text: 'Grievance mechanism available to workers? (describe)' },
    ],
  },
  {
    id: 'S2', pillar: 'S', topic: 'Health & Safety',
    questions: [
      { id: 'S2.1', role: 'evidence', type: 'evidence', text: 'H&S certification (e.g., ISO 45001).' },
      { id: 'S2.2', role: 'kpi', type: 'text', text: 'Last 12 months: LTIs / TRIR (or equivalent).' },
      { id: 'S2.3', role: 'policy', type: 'yesno', text: 'Toolbox talks and near-miss reporting in place?' },
    ],
  },
  {
    id: 'S3', pillar: 'S', topic: 'Diversity, Equity & Inclusion',
    questions: [
      { id: 'S3.1', role: 'policy', type: 'evidence', text: 'Non-discrimination policy (attach).' },
      { id: 'S3.2', role: 'kpi', type: 'percent', text: '% women in total workforce / management.' },
    ],
  },
  {
    id: 'S4', pillar: 'S', topic: 'Training & Competence',
    questions: [
      { id: 'S4.1', role: 'kpi', type: 'number', text: 'Average H&S training hours per employee last year.' },
      { id: 'S4.2', role: 'policy', type: 'yesno', text: 'ESG awareness training conducted?' },
    ],
  },
  {
    id: 'S5', pillar: 'S', topic: 'Community & Local Content',
    questions: [
      { id: 'S5.1', role: 'policy', type: 'yesno', text: 'Participation in local hiring / IKTVA or similar? (describe)' },
    ],
  },

  // ── Governance ──────────────────────────────────────────────────
  {
    id: 'G1', pillar: 'G', topic: 'Ethics & Compliance',
    questions: [
      { id: 'G1.1', role: 'policy', type: 'evidence', text: 'Code of Conduct in force and signed by employees (attach).' },
      { id: 'G1.2', role: 'policy', type: 'evidence', text: 'Anti-bribery/anti-corruption policy (attach).' },
      { id: 'G1.3', role: 'target', type: 'yesno', text: 'Whistleblowing channel (anonymous)?' },
    ],
  },
  {
    id: 'G2', pillar: 'G', topic: 'Data Protection & Cybersecurity',
    questions: [
      { id: 'G2.1', role: 'policy', type: 'yesno', text: 'Information security certification or controls (e.g., ISO 27001 / policies)?' },
      { id: 'G2.2', role: 'context', type: 'yesno', text: 'Any data breaches in last 24 months? (if yes, explain)' },
    ],
  },
  {
    id: 'G3', pillar: 'G', topic: 'Management Systems & Governance',
    questions: [
      { id: 'G3.1', role: 'policy', type: 'yesno', text: 'Internal ESG oversight (committee or designated officer)?' },
      { id: 'G3.2', role: 'target', type: 'yesno', text: 'Annual ESG/Compliance training for relevant staff?' },
    ],
  },
  {
    id: 'G4', pillar: 'G', topic: 'Supply Chain Ethics',
    questions: [
      { id: 'G4.1', role: 'policy', type: 'yesno', text: 'Do you cascade ESG requirements to your own suppliers?' },
      { id: 'G4.2', role: 'target', type: 'yesno', text: 'Screening of sub-suppliers for sanctions/ABAC risks?' },
    ],
  },
];

export const questionBankById = Object.fromEntries(questionBank.map((t) => [t.id, t]));
