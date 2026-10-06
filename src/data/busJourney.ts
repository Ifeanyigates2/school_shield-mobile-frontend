/**
 * School-bus day for a child who rides a route instead of being handed over at
 * the gate. The school can only confirm the school end of each leg; the
 * guardian closes the day by confirming the child reached home.
 */

export type BusStage =
  /** Bus arrived and gate staff sighted the child — morning leg closed */
  | 'at_school'
  /** Gate saw the child board the afternoon bus — waiting on the guardian */
  | 'awaiting_home'
  /** Guardian confirmed the child is home — the record is locked */
  | 'closed'
  /** Guardian reported the child has not arrived — the school is alerted */
  | 'escalated';

export const BUS_JOURNEY = {
  childId: 'david',
  pronoun: { subject: 'he', object: 'him' },
  route: 'Route B',
  seat: 4,
  gate: 'Main Gate',
  busArrived: '7:19 AM',
  arrivedAtSchool: '7:22 AM',
  leftSchool: '3:04 PM',
  gateStaff: 'Ibrahim Sule',
  gateCode: '8041',
  officeContact: 'Mrs Folake Adebayo',
  supervisor: 'Mr Tunde Bakare',
};

/** Before the afternoon drop the day starts at school; after it, it needs the guardian. */
export function initialBusStage(now = new Date()): BusStage {
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= 15 * 60 + 4 ? 'awaiting_home' : 'at_school';
}

/** Next stage for the demo long-press on the journey cards. */
export function nextBusStage(stage: BusStage): BusStage {
  const order: BusStage[] = ['at_school', 'awaiting_home', 'closed', 'escalated'];
  return order[(order.indexOf(stage) + 1) % order.length];
}

/** 15:13 → "3:13 PM" */
export function formatClock(date: Date) {
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
}
