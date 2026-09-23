export type Handler = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  status: 'ACTIVE' | 'PAUSED';
  pickup: boolean;
  dropoff: boolean;
  childIds: string[];
  days: string;
  color: string;
  authorizedToday?: boolean;
};

export type Child = {
  id: string;
  name: string;
  klass: string;
  color: string;
};

export const CHILDREN: Child[] = [
  { id: 'amara', name: 'Amara Okafor', klass: 'Primary 4A', color: '#1C1917' },
  { id: 'david', name: 'David Okafor', klass: 'Primary 1B', color: '#BE185D' },
];

export const HANDLERS: Handler[] = [
  {
    id: 'chidinma',
    name: 'Chidinma Okafor',
    relationship: 'Nanny',
    phone: '805 221 4478',
    status: 'ACTIVE',
    pickup: true,
    dropoff: true,
    childIds: ['amara', 'david'],
    days: 'Mon, Wed, Fri',
    color: '#C45C6A',
    authorizedToday: true,
  },
  {
    id: 'emeka',
    name: 'Emeka Nwosu',
    relationship: 'Driver',
    phone: '806 774 1120',
    status: 'ACTIVE',
    pickup: true,
    dropoff: false,
    childIds: ['amara'],
    days: 'Any school day',
    color: '#0E7A6B',
  },
  {
    id: 'aisha',
    name: 'Aisha Bello',
    relationship: 'Grandmother',
    phone: '802 118 9043',
    status: 'PAUSED',
    pickup: true,
    dropoff: false,
    childIds: ['amara', 'david'],
    days: 'Fridays only',
    color: '#5B8DEF',
  },
];

export const WEEK: { day: string; handlerId: string }[] = [
  { day: 'Mon', handlerId: 'chidinma' },
  { day: 'Tues', handlerId: 'chidinma' },
  { day: 'Wed', handlerId: 'emeka' },
  { day: 'Thurs', handlerId: 'chidinma' },
  { day: 'Fri', handlerId: 'aisha' },
];

export type Job = 'pickup' | 'dropoff';

export type Collector =
  | { kind: 'saved'; handlerId: string }
  | { kind: 'onetime'; name: string; phone: string; relationship: string; color: string };

export const childNames = (ids: string[], list: Child[] = CHILDREN) =>
  list.filter((c) => ids.includes(c.id)).map((c) => c.name.split(' ')[0]).join(' and ');

export function eligibleHandlers(handlers: Handler[], childId: string, job: Job) {
  return handlers.filter(
    (h) =>
      h.status === 'ACTIVE' &&
      h.childIds.includes(childId) &&
      (job === 'pickup' ? h.pickup : h.dropoff),
  );
}

export function firstChildForHandler(
  handler: Handler | undefined,
  fallback: string,
  allowedIds?: string[],
) {
  if (allowedIds?.length) {
    return handler?.childIds.find((id) => allowedIds.includes(id)) ?? fallback;
  }
  return handler?.childIds[0] ?? fallback;
}

export type NotificationPrefs = {
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
  checkin: boolean;
  reminder: boolean;
  picked: boolean;
  auth: boolean;
};

export type GuardianSession = {
  name: string;
  phone: string;
  email: string;
  relationship: 'Parent' | 'Guardian';
  hasPhoto: boolean;
  childIds: string[];
  handler: Handler | null;
  notifications: NotificationPrefs;
};

export function firstName(full: string) {
  return full.trim().split(/\s+/)[0] || '';
}

export function mergeHandlers(base: Handler[], extra: Handler | null) {
  if (!extra?.name.trim()) return base;
  const extraPhone = extra.phone.replace(/\s/g, '');
  if (!extraPhone) return [{ ...extra, id: extra.id || 'onboarded' }, ...base];
  const match = base.find((h) => h.phone.replace(/\s/g, '') === extraPhone);
  if (match) {
    return base.map((h) => (h.id === match.id ? { ...h, ...extra, id: match.id } : h));
  }
  return [{ ...extra, id: extra.id || 'onboarded' }, ...base];
}

export function collectorProfile(collector: Collector, handlers: Handler[]) {
  if (collector.kind === 'onetime') {
    return {
      name: collector.name,
      phone: collector.phone,
      relationship: collector.relationship,
      color: collector.color,
      firstName: collector.name.split(' ')[0] || collector.name,
    };
  }
  const handler = handlers.find((h) => h.id === collector.handlerId);
  const name = handler?.name ?? 'Unknown';
  return {
    name,
    phone: handler?.phone ?? '',
    relationship: handler?.relationship ?? '',
    color: handler?.color ?? '#0B1F3D',
    firstName: name.split(' ')[0] || name,
  };
}
