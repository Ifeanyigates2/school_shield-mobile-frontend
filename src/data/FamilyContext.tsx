import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo, useState } from 'react';
import {
  CHILDREN,
  Child,
  GuardianSession,
  HANDLERS,
  Handler,
  WEEK,
  firstName,
  mergeHandlers,
} from './family';

type FamilyState = {
  guardianName: string;
  children: Child[];
  handlers: Handler[];
  setHandlers: Dispatch<SetStateAction<Handler[]>>;
  week: typeof WEEK;
  session: GuardianSession | null;
};

const FamilyContext = createContext<FamilyState | null>(null);

export function FamilyProvider({
  children,
  session = null,
}: {
  children: ReactNode;
  session?: GuardianSession | null;
}) {
  const kids = session?.childIds.length
    ? CHILDREN.filter((c) => session.childIds.includes(c.id))
    : CHILDREN;
  const [handlers, setHandlers] = useState(() => mergeHandlers(HANDLERS, session?.handler ?? null));
  const guardianName = firstName(session?.name ?? '') || 'Zara';
  const value = useMemo(
    () => ({ guardianName, children: kids, handlers, setHandlers, week: WEEK, session }),
    [guardianName, kids, handlers, session],
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
