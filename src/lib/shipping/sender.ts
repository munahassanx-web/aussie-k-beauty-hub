/**
 * Skin Grocer dispatch identity for the manual carrier (MyPost Business)
 * workflow. Client-safe reference data — staff fulfilment screens only.
 *
 * Only values genuinely configured in the project appear here. Anything null
 * is surfaced to staff as "Owner setup required" — never guessed, never
 * invented. When the owner completes sender setup, fill in the nulls here and
 * every staff screen updates at once.
 */
export const DISPATCH_SENDER = {
  businessName: 'Skin Grocer',
  /** Customer-care mailbox used across the transactional email templates. */
  email: 'customercare@skingrocer.com.au',
  /** The owner-confirmed warehouse/dispatch address in Australia Post-friendly format. */
  streetAddress: 'Unit 13, 30 Willandra Drive',
  cityLabel: 'Epping VIC 3076, Australia',
  /** Owner-confirmed warehouse phone number. */
  phone: '+61 474 587 111',
  /** Owner-confirmed fulfilment contact person. */
  contactPerson: 'Muna Hasan',
};

/** Official Australia Post MyPost Business sign-in page. */
export const MYPOST_BUSINESS_URL = 'https://mypostbusiness.auspost.com.au';

