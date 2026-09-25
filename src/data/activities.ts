export type ActivityCategory = 'all' | 'pickup' | 'dropoff' | 'authorization' | 'security';

export type ActivityStatusType = 'success' | 'danger' | 'info' | 'cancelled';

export interface HandoverDetails {
  bannerStatus: 'success' | 'danger' | 'info';
  bannerTitle: string;
  bannerDate: string;
  event: string;
  child: string;
  releasedTo: string;
  date: string;
  time: string;
  gate: string;
  verifiedBy: string;
  authorization: string;
  approvedBy: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  tag: 'Pickup' | 'Drop-off' | 'Authorization' | 'Security';
  category: ActivityCategory;
  statusType: ActivityStatusType;
  details: HandoverDetails;
}

export const ACTIVITIES: ActivityItem[] = [
  {
    id: 'amara-picked-up',
    title: 'Amara picked up',
    subtitle: 'Chidinma Okafor · Main Gate',
    time: '2:52 PM',
    tag: 'Pickup',
    category: 'pickup',
    statusType: 'success',
    details: {
      bannerStatus: 'success',
      bannerTitle: 'Amara was picked up safely',
      bannerDate: 'Monday 7 September at 2:52 PM',
      event: 'Pickup · handover complete',
      child: 'Amara Okafor · Primary 4A',
      releasedTo: 'Chidinma Okafor · Nanny',
      date: 'Monday, 7 September',
      time: '2:52 PM',
      gate: 'Main Gate · Greenfield Academy',
      verifiedBy: 'QR scan + face match',
      authorization: 'One-time · created 6:40 AM',
      approvedBy: 'Gate staff on duty',
    },
  },
  {
    id: 'david-picked-up',
    title: 'David picked up',
    subtitle: 'Chidinma Okafor · Main Gate',
    time: '2:41 PM',
    tag: 'Pickup',
    category: 'pickup',
    statusType: 'success',
    details: {
      bannerStatus: 'success',
      bannerTitle: 'David was picked up safely',
      bannerDate: 'Monday 7 September at 2:41 PM',
      event: 'Pickup · handover complete',
      child: 'David Okafor · Primary 1B',
      releasedTo: 'Chidinma Okafor · Nanny',
      date: 'Monday, 7 September',
      time: '2:41 PM',
      gate: 'Main Gate · Greenfield Academy',
      verifiedBy: 'QR scan + face match',
      authorization: 'Regular · Mon, Wed, Fri',
      approvedBy: 'Gate staff on duty',
    },
  },
  {
    id: 'unauthorized-attempt',
    title: 'Unauthorized pickup attempt',
    subtitle: 'Emeka Nwosu turned away · Amara not released',
    time: '2:12 PM',
    tag: 'Security',
    category: 'security',
    statusType: 'danger',
    details: {
      bannerStatus: 'danger',
      bannerTitle: 'Unauthorized pickup prevented',
      bannerDate: 'Monday 7 September at 2:12 PM',
      event: 'Security alert · release refused',
      child: 'Amara Okafor · Primary 4A',
      releasedTo: 'None · Emeka Nwosu turned away',
      date: 'Monday, 7 September',
      time: '2:12 PM',
      gate: 'Main Gate · Greenfield Academy',
      verifiedBy: 'Authorization expired / invalid slot',
      authorization: 'Expired token',
      approvedBy: 'Gate supervisor security team',
    },
  },
  {
    id: 'auth-cancelled',
    title: 'Authorization cancelled',
    subtitle: 'You cancelled Grace Bello for Amara',
    time: '1:14 PM',
    tag: 'Authorization',
    category: 'authorization',
    statusType: 'cancelled',
    details: {
      bannerStatus: 'info',
      bannerTitle: 'Authorization was revoked',
      bannerDate: 'Monday 7 September at 1:14 PM',
      event: 'Authorization · cancelled by parent',
      child: 'Amara Okafor · Primary 4A',
      releasedTo: 'Revoked for Grace Bello',
      date: 'Monday, 7 September',
      time: '1:14 PM',
      gate: 'System audit log',
      verifiedBy: 'Guardian digital signature',
      authorization: 'One-time revoked',
      approvedBy: 'Parent (Zara Okafor)',
    },
  },
  {
    id: 'auth-created',
    title: 'Authorization created',
    subtitle: 'Chidinma Okafor · one-time until 3:30 PM',
    time: '6:40 AM',
    tag: 'Authorization',
    category: 'authorization',
    statusType: 'info',
    details: {
      bannerStatus: 'info',
      bannerTitle: 'Pickup pass generated',
      bannerDate: 'Monday 7 September at 6:40 AM',
      event: 'Authorization · pass issued',
      child: 'Amara & David Okafor',
      releasedTo: 'Chidinma Okafor · Nanny',
      date: 'Monday, 7 September',
      time: '6:40 AM',
      gate: 'Main Gate · Greenfield Academy',
      verifiedBy: 'Parent OTP authorization',
      authorization: 'One-time · valid until 3:30 PM',
      approvedBy: 'Parent (Zara Okafor)',
    },
  },
  {
    id: 'amara-checked-in',
    title: 'Amara checked in',
    subtitle: 'Main Gate · brought by you',
    time: '7:48 AM',
    tag: 'Drop-off',
    category: 'dropoff',
    statusType: 'success',
    details: {
      bannerStatus: 'success',
      bannerTitle: 'Amara checked in safely',
      bannerDate: 'Monday 7 September at 7:48 AM',
      event: 'Drop-off · student check-in',
      child: 'Amara Okafor · Primary 4A',
      releasedTo: 'School Reception / Class 4A Staff',
      date: 'Monday, 7 September',
      time: '7:48 AM',
      gate: 'Main Gate · Greenfield Academy',
      verifiedBy: 'QR scan confirmation',
      authorization: 'Parent drop-off',
      approvedBy: 'Gate staff on duty',
    },
  },
];
