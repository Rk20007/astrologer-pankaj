/**
 * Manual UPI / bank payment configuration.
 *
 * Until Razorpay is wired up, payment is collected by showing the QR code and
 * the bank account below. The client pays from any UPI app (or by NEFT/IMPS),
 * then submits the UTR — the transaction reference every bank shows on the
 * receipt — through the form on the site. An admin verifies the amount against
 * the bank statement and approves it from /admin/payments.
 *
 * Everything here is editable from Admin → Website Content → "Payment (UPI QR
 * & Bank)", so the QR or the account details can be swapped without a redeploy.
 * The `qrImage` field renders as an image picker: upload the QR under Admin →
 * Images and choose it from the library.
 */
export const paymentConfig = {
  // Static QR photo shipped with the site. Replace the file at
  // public/payment-qr.jpg, or pick an uploaded image from the admin library.
  qrImage: '/payment-qr.jpg',
  // Optional — shown as copyable text beside the QR. Leave empty to hide.
  upiId: '',
  payeeName: 'Bold and Spiritual',
  bankLabel: 'HDFC Bank • UPI / Cards / Digital Rupee',
  // Shown above the QR.
  note: 'Scan the QR with any UPI app (GPay, PhonePe, Paytm, BHIM) and pay the exact amount for your service.',
  steps: [
    'Pay the exact amount by scanning the QR code, or by bank transfer to the account shown.',
    'Copy the UTR / Transaction Reference Number from the payment receipt.',
    'Fill it in the form below and submit.',
    'Our team verifies the payment and confirms your booking on WhatsApp — usually within 24 hours.',
  ],
  // Shown alongside the QR for anyone who would rather do NEFT / IMPS.
  bankAccount: {
    accountHolder: 'BOLD AND SPIRITUAL',
    accountNumber: '50200085219433',
    ifsc: 'HDFC0009522',
    bank: 'HDFC Bank',
    branch: 'OMAXE WORLD STREET, FARIDABAD',
    accountType: 'Current Account',
  },
};

/** Payment methods offered today. Razorpay slots in here later. */
export const PAYMENT_METHODS = [
  { key: 'upi', label: 'UPI / QR (Scan & Pay)' },
  { key: 'bank', label: 'Bank transfer (NEFT / IMPS)' },
];
