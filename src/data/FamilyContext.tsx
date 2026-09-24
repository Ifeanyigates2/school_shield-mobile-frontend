import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo, useState } from 'react';
import {
  Authorization,
  CHILDREN,
  Child,
  GuardianSession,
  HANDLERS,
  Handler,
  INITIAL_AUTHORIZATIONS,
  WEEK_PLANS,
  WeekPlans,
  firstName,
  mergeHandlers,
} from './family';

type FamilyState = {
  guardianName: string;
  children: Child[];
  handlers: Handler[];
  setHandlers: Dispatch<SetStateAction<Handler[]>>;
  weekPlans: WeekPlans;
  setWeekPlans: Dispatch<SetStateAction<WeekPlans>>;
  authorizations: Authorization[];
  setAuthorizations: Dispatch<SetStateAction<Authorization[]>>;
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
  const [weekPlans, setWeekPlans] = useState(WEEK_PLANS);
  const [authorizations, setAuthorizations] = useState(INITIAL_AUTHORIZATIONS);
  const guardianName = firstName(session?.name ?? '') || 'Zara';
  const value = useMemo(
    () => ({
      guardianName,
      children: kids,
      handlers,
      setHandlers,
      weekPlans,
      setWeekPlans,
      authorizations,
      setAuthorizations,
      session,
    }),
    [guardianName, kids, handlers, weekPlans, authorizations, session],
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
