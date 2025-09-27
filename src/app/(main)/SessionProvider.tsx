"use client";

import { SessionProvider as NextAuthSessionProvider, useSession as useNextAuthSession } from "next-auth/react";
import { ReactNode, createContext, useContext } from "react";

interface SessionContextType {
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    userType: string;
  } | null;
  session: {
    id: string;
  } | null;
  isLoading: boolean;
}

// Create a context for your custom session format
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider component
interface SessionProviderProps {
  children: ReactNode;
  session: any; // NextAuth session object
}

export default function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      <SessionContextWrapper>
        {children}
      </SessionContextWrapper>
    </NextAuthSessionProvider>
  );
}

// Wrapper component that provides the custom session context
function SessionContextWrapper({ children }: { children: ReactNode }) {
  const { data: nextAuthSession, status } = useNextAuthSession();
  
  // Convert NextAuth session to your expected format
  const customSession = nextAuthSession ? {
    user: {
      id: nextAuthSession.user?.id || '',
      name: nextAuthSession.user?.name || '',
      email: nextAuthSession.user?.email || '',
      username: nextAuthSession.user?.username || nextAuthSession.user?.name || '',
      userType: nextAuthSession.user?.userType || 'STUDENT',
    },
    session: {
      id: nextAuthSession.user?.id || '',
    }
  } : null;

  const value = {
    user: customSession?.user || null,
    session: customSession?.session || null,
    isLoading: status === 'loading'
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook that matches your existing API
export function useSession() {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
}