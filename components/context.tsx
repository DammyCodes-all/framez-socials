import React, {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

type AuthProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
  profile?: Profile;
  signOut?: () => void;
};

type Profile = {
  avatar_url: string;
  username: string;
  created_at: Date;
  email: string;
};

export const AuthContext = createContext<Partial<AuthProps>>({});

// Custom hook to read the context values
export function useAuth() {
  return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [profile, setProfileData] = useState<Profile | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(currentSession ?? null);
        setUser(currentSession ? currentSession.user : null);
        if (currentSession?.user?.id) {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentSession.user.id)
            .single();
          if (!error && mounted) setProfileData(profileData as Profile);
        }
      } catch {
      } finally {
        if (mounted) setInitialized(true);
      }
    })();

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      setSession(session ?? null);
      setUser(session ? session.user : null);
      try {
        if (session?.user?.id) {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (!error && mounted) setProfileData(profileData as Profile);
        } else {
          setProfileData(undefined);
        }
      } catch {
        // ignore per-update errors
      } finally {
        if (mounted) setInitialized(true);
      }
    });

    return () => {
      mounted = false;
      try {
        data.subscription.unsubscribe();
      } catch {
        // ignore unsubscribe errors
      }
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const value = {
    user,
    session,
    initialized,
    profile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
