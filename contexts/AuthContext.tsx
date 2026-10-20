"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { withTimeout } from '@/lib/request-timeout';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkAdminRole: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = async (userId?: string): Promise<boolean> => {
    const currentUserId = userId || user?.id;
    if (!currentUserId) return false;
    
    const { data, error } = await withTimeout(supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', currentUserId)
      .eq('role', 'admin')
      .maybeSingle());

    return !error && !!data;
  };

  useEffect(() => {
    let disposed = false;
    let revision = 0;
    let roleUserId: string | null = null;
    let roleTimer: ReturnType<typeof setTimeout> | undefined;
    const startupTimer = setTimeout(() => { if (!disposed) setLoading(false); }, 15000);
    const applySession = (nextSession: Session | null) => {
      if (disposed) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      // Token refreshes do not change roles or restart the account loader.
      if (nextSession?.user.id && roleUserId === nextSession.user.id) return;
      roleUserId = nextSession?.user.id ?? null;
      const currentRevision = ++revision;
      clearTimeout(roleTimer);
      setIsAdmin(false);
      if (!nextSession?.user) {
        clearTimeout(startupTimer);
        setLoading(false);
        return;
      }
      setLoading(true);
      // Run database calls outside Supabase's auth notification lock.
      roleTimer = setTimeout(async () => {
        try {
          const admin = await checkAdminRole(nextSession.user.id);
          if (!disposed && revision === currentRevision) setIsAdmin(admin);
        } catch (error) {
          console.error('Unable to check account role:', error);
        } finally {
          if (!disposed && revision === currentRevision) {
            clearTimeout(startupTimer);
            setLoading(false);
          }
        }
      }, 0);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => applySession(nextSession));
    const initialRevision = revision;
    withTimeout(supabase.auth.getSession()).then(({ data: { session: restoredSession }, error }) => {
      if (error) throw error;
      if (!disposed && revision === initialRevision) applySession(restoredSession);
    }).catch(error => {
      console.error('Unable to restore session:', error);
      if (!disposed && revision === initialRevision) setLoading(false);
    });
    return () => {
      disposed = true;
      clearTimeout(startupTimer);
      clearTimeout(roleTimer);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : 'https://www.laptap.in/';
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signUp,
        signIn,
        signOut,
        checkAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
