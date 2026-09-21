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

export const childNames = (ids: string[]) =>
  CHILDREN.filter((c) => ids.includes(c.id)).map((c) => c.name.split(' ')[0]).join(' and ');
