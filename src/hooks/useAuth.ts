import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseEnabled } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { UserAccount, AppUserRole } from "../types";

interface AuthState {
  user: User | null;
  profile: UserAccount | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setState((s) => ({ ...s, isLoading: false }));
      return;
    }

    supabase!.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (user: User) => {
    const { data } = await supabase!
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    const profile: UserAccount | null = data
      ? {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as AppUserRole,
          roleTitle: data.role_title,
          organization: data.organization,
          identifier: data.identifier,
          avatar: data.avatar_url || undefined,
          permissions: data.permissions,
        }
      : null;

    setState({
      user,
      profile,
      isLoading: false,
      isAuthenticated: !!profile,
    });
  };

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseEnabled) throw new Error("Supabase not configured");
    const { error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, userData: Partial<UserAccount>) => {
      if (!isSupabaseEnabled) throw new Error("Supabase not configured");
      const { data, error } = await supabase!.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        await supabase!.from("users").insert({
          auth_id: data.user.id,
          name: userData.name,
          email,
          role: userData.role || "guru",
          role_title: userData.roleTitle,
          organization: userData.organization,
          identifier: userData.identifier,
          permissions: userData.permissions || [],
        });
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (!isSupabaseEnabled) return;
    await supabase!.auth.signOut();
  }, []);

  return { ...state, signIn, signUp, signOut };
}
