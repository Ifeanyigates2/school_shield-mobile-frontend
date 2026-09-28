import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { ApiParent, login as loginRequest } from './auth';
import { setAuthToken } from './client';

type SessionValue = {
  parent: ApiParent | null;
  isSignedIn: boolean;
  signIn: (identifier: string, password: string) => Promise<ApiParent>;
  signOut: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

// TODO: persist the token (expo-secure-store) so users stay signed in after closing the app.
export function SessionProvider({ children }: { children: ReactNode }) {
  const [parent, setParent] = useState<ApiParent | null>(null);

  const signIn = useCallback(async (identifier: string, password: string) => {
    const result = await loginRequest(identifier.trim(), password);
    setAuthToken(result.token);
    setParent(result.parent);
    return result.parent;
  }, []);

  const signOut = useCallback(() => {
    setAuthToken(null);
    setParent(null);
  }, []);

  const value = useMemo(
    () => ({ parent, isSignedIn: parent !== null, signIn, signOut }),
    [parent, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside <SessionProvider>.');
  return value;
}
