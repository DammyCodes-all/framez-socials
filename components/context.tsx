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
  setProfileData?: (data: Profile) => void;
};

export type Profile = {
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
    (async () => {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();
        setSession(currentSession ?? null);
        setUser(currentSession ? currentSession.user : null);
        if (currentSession?.user?.id) {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentSession.user.id)
            .single();
          if (!error) setProfileData(profileData as Profile);
        }
      } catch {
      } finally {
        setInitialized(true);
      }
    })();

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session ?? null);
      setUser(session ? session.user : null);
      try {
        if (session?.user?.id) {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (!error) setProfileData(profileData as Profile);
        } else {
          setProfileData(undefined);
        }
      } catch {
      } finally {
        setInitialized(true);
      }
    });

    return () => {
      try {
        data.subscription.unsubscribe();
      } catch {}
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
    setProfileData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
