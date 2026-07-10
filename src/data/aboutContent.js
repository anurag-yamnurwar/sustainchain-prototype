// Background / "why we're building this" copy shown on the About page.
// Kept as data (not markup) so the text can be edited without touching
// any component code — matches the pattern used across src/data/*.

export const aboutIntro = {
  eyebrow: 'Why We Built This',
  heading: 'Embedding Sustainability in Procurement',
  paragraphs: [
    'Sustainability is increasingly central to how organizations operate and create long-term value. Beyond financial performance, companies are expected to consider environmental impact, social responsibility, and good governance. Procurement plays a key role in this because it connects the organization with a wide network of suppliers and service providers.',
    'By integrating sustainability into procurement practices, organizations can extend responsible business conduct across their supply chains. This helps manage risks, improve efficiency, strengthen reputation, and meet the expectations of regulators, investors, and customers. More importantly, it helps build a broader ecosystem where suppliers also adopt responsible environmental, social, and ethical practices.',
    'Organizations can enable this by embedding Environmental, Social, and Governance (ESG) considerations into vendor onboarding and supplier evaluation processes. Collecting structured information from suppliers and conducting periodic assessments encourages transparency and continuous improvement.',
    'Technology can further support this effort by integrating sustainability criteria into procurement systems. Starting with responsible vendor onboarding and gradually expanding to periodic ESG assessments allows organizations to build a practical and scalable sustainability ecosystem within their supply chain.',
  ],
};

// Short pillars derived from the background copy — used as supporting
// cards under the intro text.
export const aboutPillars = [
  {
    icon: '\u{1F30D}',
    title: 'Environmental',
    text: 'Track supplier environmental impact and emissions data as part of routine onboarding.',
  },
  {
    icon: '\u{1F91D}',
    title: 'Social',
    text: 'Evaluate labor practices, diversity policies, and community impact across the supply chain.',
  },
  {
    icon: '\u2696\uFE0F',
    title: 'Governance',
    text: 'Confirm oversight, whistleblowing channels, and ethical conduct before a vendor is approved.',
  },
];
