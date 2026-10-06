export const SCHOOL = {
  name: 'Greenfield Academy',
  address: '14 Admiralty Way, Lekki Phase 1, Lagos.',
  officeHours: 'Monday to Friday, 7:00 AM – 4:30 PM.',
  officePhone: '+234 803 456 7890',
  officeEmail: 'office@greenfield.edu.ng',
  emergencyPhone: '+234 802 118 4460',
};

/** "+234 803 456 7890" → "tel:+2348034567890" */
export function telUrl(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
