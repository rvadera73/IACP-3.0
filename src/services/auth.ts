import type { Division, User } from '../types';

export interface DemoSignInPayload {
  provider: 'google' | 'login-gov' | 'dol-sso';
  portal: 'external' | 'internal';
  email: string;
  role: string;
  division?: Division;
  office?: string;
}

function deriveDisplayName(email: string, role: string) {
  if (!email) {
    return `Demo ${role}`;
  }

  const localPart = email.split('@')[0] ?? role;
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export async function beginDemoSignIn(payload: DemoSignInPayload): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  return {
    id: `${payload.provider}-${Math.random().toString(36).slice(2, 10)}`,
    name: deriveDisplayName(payload.email, payload.role),
    role: payload.role,
    division: payload.division,
    office: payload.office,
    organization: payload.portal === 'external' ? 'Unified Filing Service' : 'Department of Labor',
  };
}
