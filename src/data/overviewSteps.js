// Vendor onboarding process shown on the Overview page.
// Mirrors the same 8 stages driven through the portal (see src/data/stepLabels.js)
// but written out here as plain-language descriptions for visitors who
// haven't launched the portal yet.

export const onboardingProcess = [
  {
    step: 1,
    title: 'Vendor Registration & Initial Payment',
    text: 'Vendor registers on the Procurement website with company details and pays the application fee.',
  },
  {
    step: 2,
    title: 'Vendor Classification',
    text: 'The Procurement team classifies the vendor — Strategic, Critical, or Routine Supplier — which determines the questionnaire depth ahead.',
  },
  {
    step: 3,
    title: 'ESG Questionnaire',
    text: 'As per classification, a tailored ESG questionnaire (Environmental, Social, Governance) is sent to the vendor for completion.',
  },
  {
    step: 4,
    title: 'Follow-Up & Clarifications',
    text: 'Procurement can accept the response or request additional detail; the vendor updates and resubmits until all details are confirmed.',
  },
  {
    step: 5,
    title: 'Scoring',
    text: "The system scores each topic against the vendor's classification and checks it against that tier's minimum threshold.",
  },
  {
    step: 6,
    title: 'Final Payment & Approval',
    text: 'After scrutiny passes and the final payment is received, Procurement accepts the vendor as an Approved Vendor.',
  },
  {
    step: 7,
    title: 'ERP Export',
    text: 'Approved vendor details are downloaded in Excel format for creating the vendor record in the ERP system.',
  },
  {
    step: 8,
    title: 'Dashboard & Indicators',
    text: 'A live dashboard tracks onboarding volume, approval rates, and other ESG indicators across all vendors.',
  },
];

// Detailed field-level spec for Step 1, shown as an expandable/reference
// block on the Overview page so stakeholders can see exactly what the
// registration form collects.
export const step1FieldSpec = {
  title: 'Step 1 — New Vendor Registration Page Details',
  intro:
    'A new probable vendor enquires with the Procurement team about a partnership with the organization. The Procurement team guides them to register on the "New Vendor Registration" page, which lives under the organization\u2019s website.',
  fields: [
    'Vendor Name',
    'CR Number',
    'GST Number',
    'Address',
    'Contact — Email, Mobile & Landline',
    'Bank Account Details',
    'Product Details (multiple items) — brochure attachment, max 2 MB',
    'Service Details (multiple items) — brochure attachment, max 2 MB',
    'Application Fee Payment',
    'Submit Button',
  ],
};
