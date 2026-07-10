// ESG audit questions. Each `w` is the point weight if answered "YES".
// Kept as data (not markup) so new questions can be added here without
// touching any component code.
export const auditQuestions = [
  { id: 'e1', cat: 'env', text: 'Tracking of Scope 1 & 2 GHG emissions?', w: 5 },
  { id: 'e2', cat: 'env', text: 'ISO 14001 certification active?', w: 4 },
  { id: 's1', cat: 'soc', text: 'Supply chain labor vetting protocol?', w: 5 },
  { id: 's2', cat: 'soc', text: 'Documented diversity hiring policy?', w: 3 },
  { id: 'g1', cat: 'gov', text: 'External whistleblowing channel active?', w: 4 },
  { id: 'g2', cat: 'gov', text: 'Board-level ESG subcommittee oversight?', w: 4 },
];

// Max attainable points per category - used to normalize raw scores to a
// percentage. Derived from the weights above (env: 5+4=9, soc: 5+3=8, gov: 4+4=8).
export const categoryMaxPoints = {
  env: auditQuestions.filter((q) => q.cat === 'env').reduce((s, q) => s + q.w, 0),
  soc: auditQuestions.filter((q) => q.cat === 'soc').reduce((s, q) => s + q.w, 0),
  gov: auditQuestions.filter((q) => q.cat === 'gov').reduce((s, q) => s + q.w, 0),
};
