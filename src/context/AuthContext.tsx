import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { demoAdmin, demoSubscriber, subscriptionPlans } from "../lib/demo-data";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type {
  AppUser,
  SubscriptionPlan,
  UserRole,
  UserSubscription,
} from "../lib/types";

interface AuthCredentials {
  email: string;
  password: string;
  displayName?: string;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  isDemoMode: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  register: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const DEMO_SESSION_KEY = "ssr-demo-session";
const AuthContext = createContext<AuthContextValue | null>(null);

function mapPlan(row: Record<string, unknown>): SubscriptionPlan {
  return {
    id: String(row.id),
    name: String(row.name) as SubscriptionPlan["name"],
    slug: String(row.slug) as SubscriptionPlan["slug"],
    description: String(row.description ?? ""),
    priceMonthly: Number(row.price_monthly ?? 0),
    monthlySampleLimit:
      row.monthly_sample_limit === null
        ? null
        : Number(row.monthly_sample_limit ?? 0),
    monthlyInstrumentalLimit:
      row.monthly_instrumental_limit === null
        ? null
        : Number(row.monthly_instrumental_limit ?? 0),
    includesCourses: Boolean(row.includes_courses),
    isActive: Boolean(row.is_active),
  };
}

async function loadSupabaseUser(userId: string): Promise<AppUser | null> {
  if (!supabase) {
    return null;
  }

  const [{ data: profile, error: profileError }, { data: subscription }] =
    await Promise.all([
      supabase.from("users").select("*").eq("id", userId).single(),
      supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", userId)
        .in("status", ["trialing", "active"])
        .order("current_period_end", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  if (profileError || !profile) {
    return null;
  }

  const planRow = subscription?.subscription_plans as
    | Record<string, unknown>
    | null
    | undefined;
  const mappedSubscription: UserSubscription | undefined = subscription
    ? {
        id: subscription.id,
        userId: subscription.user_id,
        planId: subscription.plan_id,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
      }
    : undefined;

  return {
    id: profile.id,
    email: profile.email,
    displayName: profile.display_name,
    role: profile.role as UserRole,
    subscription: mappedSubscription,
    plan: planRow ? mapPlan(planRow) : undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function initializeAuth() {
      if (!supabase) {
        const demoSession = sessionStorage.getItem(DEMO_SESSION_KEY);
        if (active && demoSession) {
          setUser(demoSession === "admin" ? demoAdmin : demoSubscriber);
        }
        if (active) {
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      const loadedUser = data.session
        ? await loadSupabaseUser(data.session.user.id)
        : null;

      if (active) {
        setUser(loadedUser);
        setLoading(false);
      }
    }

    void initializeAuth();

    const subscription = supabase?.auth.onAuthStateChange(
      async (_event, session) => {
        const loadedUser = session
          ? await loadSupabaseUser(session.user.id)
          : null;
        if (active) {
          setUser(loadedUser);
          setLoading(false);
        }
      },
    );

    return () => {
      active = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async ({ email, password }: AuthCredentials) => {
    setLoading(true);
    try {
      if (!supabase) {
        const isAdmin = /admin|archivista/i.test(email);
        sessionStorage.setItem(DEMO_SESSION_KEY, isAdmin ? "admin" : "member");
        setUser(isAdmin ? demoAdmin : demoSubscriber);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async ({ email, password, displayName }: AuthCredentials) => {
      setLoading(true);
      try {
        if (!supabase) {
          const registeredUser: AppUser = {
            id: crypto.randomUUID(),
            email,
            displayName: displayName || "nuevo iniciado",
            role: "registered",
            plan: subscriptionPlans[0],
          };
          sessionStorage.setItem(DEMO_SESSION_KEY, "member");
          setUser(registeredUser);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
          },
        });
        if (error) {
          throw error;
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem(DEMO_SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isDemoMode: !isSupabaseConfigured,
      login,
      register,
      logout,
    }),
    [loading, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
