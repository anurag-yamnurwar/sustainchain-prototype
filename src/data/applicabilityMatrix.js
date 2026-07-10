// Which topics a vendor must answer, per the applicability table in
// Vendor_Onboarding_Process.pdf ("Questionnaire applicability as per
// classification"). 'excluded' topics aren't shown to that tier at all.

const MATRIX = {
  strategic: {
    E1: 'mandatory', E2: 'mandatory', E3: 'mandatory', E4: 'mandatory', E5: 'mandatory', E6: 'mandatory',
    S1: 'mandatory', S2: 'mandatory', S3: 'mandatory', S4: 'mandatory', S5: 'mandatory',
    G1: 'mandatory', G2: 'mandatory', G3: 'mandatory', G4: 'mandatory',
    evidence: 'mandatory',
  },
  critical: {
    E1: 'mandatory', E2: 'mandatory', E3: 'mandatory', E4: 'mandatory', E5: 'optional', E6: 'optional',
    S1: 'mandatory', S2: 'mandatory', S3: 'mandatory', S4: 'optional', S5: 'optional',
    G1: 'mandatory', G2: 'mandatory', G3: 'optional', G4: 'optional',
    evidence: 'mandatory',
  },
  routine: {
    E1: 'optional', E2: 'excluded', E3: 'excluded', E4: 'excluded', E5: 'excluded', E6: 'excluded',
    S1: 'optional', S2: 'optional', S3: 'excluded', S4: 'excluded', S5: 'excluded',
    G1: 'mandatory', G2: 'excluded', G3: 'excluded', G4: 'excluded',
    evidence: 'optional',
  },
};

/** Returns 'mandatory' | 'optional' | 'excluded' for a topic under a given tier key. */
export function getTopicRequirement(tierKey, topicId) {
  return MATRIX[tierKey]?.[topicId] ?? 'excluded';
}

/** Evidence-role sub-questions follow the tier's overall evidence requirement level, not the parent topic's. */
export function getEvidenceRequirement(tierKey) {
  return MATRIX[tierKey]?.evidence ?? 'optional';
}

/** Returns the ordered list of topic IDs a vendor of this tier should see at all (mandatory + optional, excluded dropped). */
export function getApplicableTopicIds(tierKey) {
  const rows = MATRIX[tierKey] ?? {};
  return Object.keys(rows).filter((k) => k !== 'evidence' && rows[k] !== 'excluded');
}
