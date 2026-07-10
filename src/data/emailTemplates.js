// Draft notification email templates, one per event in the vendor
// onboarding process. Per the spec these are first drafts for procurement
// to edit later — kept as plain templates (not sent for real; see
// utils/notifications.js) so editing the wording never touches component
// code. {{placeholders}} are filled in at send time.

export const emailTemplates = {
  vendorRegistered: {
    subject: 'New Vendor Registration — {{vendorName}} ({{applicationId}})',
    body: `A new vendor has registered and paid the application fee.

Vendor: {{vendorName}}
Application ID: {{applicationId}}
GST: {{gst}}
Products/Services: {{productsServices}}

Please log in to the Procurement Portal to review and classify this vendor.`,
  },
  questionnaireAssigned: {
    subject: 'ESG Questionnaire Required — {{vendorName}}',
    body: `Dear {{vendorName}},

Thank you for registering. Based on our classification of your organization as a {{tierLabel}}, please complete the attached ESG questionnaire at the link below.

Questionnaire Link: {{questionnaireLink}}

Please attach supporting policies, certificates, and KPI data where requested. If you have questions, contact {{esgContactEmail}}.`,
  },
  questionnaireSubmitted: {
    subject: 'ESG Questionnaire Submitted — {{vendorName}}',
    body: `{{vendorName}} has submitted their ESG questionnaire responses.

Application ID: {{applicationId}}
Classification: {{tierLabel}}

Please log in to the Procurement Portal to review the submission.`,
  },
  additionalInfoRequested: {
    subject: 'Additional Information Requested — {{applicationId}}',
    body: `Dear {{vendorName}},

Thank you for your ESG questionnaire submission. Our procurement team has reviewed your responses and requires additional information before proceeding:

{{requestMessage}}

Please update your responses at the link below.

Response Link: {{questionnaireLink}}`,
  },
  scoringComplete: {
    subject: 'ESG Scoring Complete — {{vendorName}}',
    body: `ESG scoring has been completed for {{vendorName}}.

Overall Score: {{overallScore}} / 4.0
Result: {{scoreResult}}

Please log in to the Procurement Portal to proceed with final approval.`,
  },
  finalPaymentRequested: {
    subject: 'Final Registration Payment Required — {{applicationId}}',
    body: `Dear {{vendorName}},

Congratulations — your ESG assessment has been successfully reviewed. To complete your registration as an Approved Vendor, please pay the final registration fee at the link below.

Payment Link: {{paymentLink}}
Amount: ₹{{amount}}`,
  },
  vendorApproved: {
    subject: 'Vendor Approved — {{vendorName}}',
    body: `{{vendorName}} has completed final payment and is now an Approved Vendor.

Application ID: {{applicationId}}
Transaction ID: {{txnId}}

The vendor record is ready for ERP export.`,
  },
};

/** Fills {{placeholders}} in a template string with values from `data`. */
export function renderTemplate(str, data) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => (data[key] !== undefined ? data[key] : `{{${key}}}`));
}
