import * as XLSX from 'xlsx';

/**
 * Serializes a vendor + its tier/score context into an .xlsx file and
 * triggers a download, mirroring the original exportIndustrialMasterData().
 */
export function exportVendorMasterData(vendor, tier, scores) {
  const data = [
    ['ERP_FIELD_NAME', 'SYSTEM_SERIALIZED_VALUE'],
    ['Vendor_ID', vendor.id],
    ['Vendor_Name', vendor.name],
    ['GST_Number', vendor.gst],
    ['CR_Number', vendor.cr],
    ['Address', vendor.address],
    ['Category', tier?.label ?? ''],
    ['Risk_Level', tier?.tier ?? ''],
    ['ESG_Aggregate', scores.aggregate],
    ['Payment_Status', vendor.payment_status],
    ['Payment_Method', vendor.payment_method],
    ['Products', vendor.products.join(' | ')],
    ['Services', vendor.services.join(' | ')],
    ['Lifecycle_Status', vendor.status],
    ['Audit_Timestamp', new Date().toISOString()],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'MASTER_INGESTION');
  XLSX.writeFile(wb, `${vendor.name}_ERP_Sync.xlsx`);
}

/**
 * Exports the ENTIRE vendor registry (every vendor, any stage) as one
 * spreadsheet — one row per vendor. This is the admin-facing export: "how
 * many vendors got approved and their status", not a single vendor's
 * ERP packet.
 */
export function exportAllVendorsToExcel(vendors) {
  const headers = [
    'Vendor ID', 'Application ID', 'Vendor Name', 'GST', 'CR Number', 'Address',
    'Email', 'Mobile', 'Classification', 'Lifecycle Status',
    'Application Fee Status', 'Application Fee Txn', 'Final Fee Status', 'Final Fee Txn',
    'ESG Overall Avg (0-4)', 'ESG Env %', 'ESG Soc %', 'ESG Gov %', 'Threshold Passed',
    'Products', 'Services',
  ];

  const rows = vendors.map((v) => [
    v.id,
    v.applicationId ?? '',
    v.name,
    v.gst,
    v.cr,
    v.address,
    v.email,
    v.mobile,
    v.tier?.label ?? 'Unclassified',
    v.status,
    v.payment_status,
    v.payment_txn_id ?? '',
    v.final_payment_status,
    v.final_payment_txn_id ?? '',
    v.scores?.overallAvg ?? 0,
    v.scores?.env ?? 0,
    v.scores?.soc ?? 0,
    v.scores?.gov ?? 0,
    v.scores?.passed === null || v.scores?.passed === undefined ? 'Not Scored' : v.scores.passed ? 'Yes' : 'No',
    v.products.join(' | '),
    v.services.join(' | '),
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'VENDOR_REGISTRY');
  XLSX.writeFile(wb, `SustainChain_Vendor_Registry_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
