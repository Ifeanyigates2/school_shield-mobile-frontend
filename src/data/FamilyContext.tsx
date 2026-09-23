import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo, useState } from 'react';
import { CHILDREN, Child, HANDLERS, Handler, WEEK } from './family';

type FamilyState = {
  children: Child[];
  handlers: Handler[];
  setHandlers: Dispatch<SetStateAction<Handler[]>>;
  week: typeof WEEK;
};

const FamilyContext = createContext<FamilyState | null>(null);

export function FamilyProvider({ children }: { children: ReactNode }) {
  const [handlers, setHandlers] = useState(HANDLERS);
  const value = useMemo(
    () => ({ children: CHILDREN, handlers, setHandlers, week: WEEK }),
    [handlers],
  );
  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>;
}

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) {
    throw new Error('useFamily must be used within FamilyProvider');
  }
  return ctx;
}
