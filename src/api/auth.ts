import { api } from './client';

export type ApiParent = {
  id: string;
  name: string;
  firstName: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  relationship: string;
  hasPhoto: boolean;
  school: { id: string; name: string; campus: string } | null;
  notificationPrefs: Record<string, boolean>;
  alertsAlwaysOn: string[];
};

export function login(identifier: string, password: string) {
  return api<{ token: string; parent: ApiParent }>('POST', '/auth/login', { identifier, password });
}

/** demoCode is only returned by a non-production backend. */
export function forgotPassword(identifier: string) {
  return api<{ message: string; demoCode?: string }>('POST', '/auth/forgot-password', { identifier });
}

export function resetPassword(identifier: string, code: string, password: string) {
  return api<{ message: string }>('POST', '/auth/reset-password', { identifier, code, password });
}
