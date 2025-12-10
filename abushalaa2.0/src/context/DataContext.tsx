import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UserRole = "admin" | "user";

export interface CurrencyRecord {
  id: string;
  name: string;
  code: string;
  buyPrice: number;
  sellPrice: number;
  change: number;
  updatedAt: string;
}

interface AccountRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export type PublicAccount = Omit<AccountRecord, "password">;

export type CreateCurrencyPayload = Omit<CurrencyRecord, "id" | "updatedAt" | "change">;
export type UpdateCurrencyPayload = Partial<CreateCurrencyPayload>;

interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
  role?: UserRole;
}

interface DataContextValue {
  currencies: CurrencyRecord[];
  users: PublicAccount[];
  currentUser: PublicAccount | null;
  isAuthReady: boolean;
  isCurrenciesLoading: boolean;
  isUsersLoading: boolean;
  addCurrency: (payload: CreateCurrencyPayload) => Promise<CurrencyRecord>;
  updateCurrency: (id: string, payload: UpdateCurrencyPayload) => Promise<void>;
  deleteCurrency: (id: string) => Promise<void>;
  fetchCurrencies: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<PublicAccount>;
  login: (email: string, password: string) => Promise<PublicAccount>;
  logout: () => void;
  updateUserRole: (id: string, role: UserRole) => Promise<void>;
  resetUserPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const isBrowser = typeof window !== "undefined";
const CURRENCY_STORAGE_KEY = "currency-watch-ly::currencies";
const ACCOUNT_STORAGE_KEY = "currency-watch-ly::accounts";
const SESSION_STORAGE_KEY = "currency-watch-ly::session";
const LEGACY_USER_STORAGE_KEY = "currency-watch-ly::users";
const LEGACY_ADMIN_STORAGE_KEY = "currency-watch-ly::admins";

const defaultCurrencies: CurrencyRecord[] = [
  { id: "1", name: "دولار أمريكي", code: "USD", buyPrice: 4.85, sellPrice: 4.9, change: 0.02, updatedAt: new Date().toISOString() },
  { id: "2", name: "يورو", code: "EUR", buyPrice: 5.2, sellPrice: 5.25, change: -0.01, updatedAt: new Date().toISOString() },
  { id: "3", name: "جنيه سوداني", code: "SDG", buyPrice: 0.008, sellPrice: 0.009, change: 0, updatedAt: new Date().toISOString() },
  { id: "4", name: "جنيه مصري", code: "EGP", buyPrice: 0.1, sellPrice: 0.11, change: 0.01, updatedAt: new Date().toISOString() },
  { id: "5", name: "ريال سعودي", code: "SAR", buyPrice: 1.29, sellPrice: 1.31, change: 0, updatedAt: new Date().toISOString() },
  { id: "6", name: "درهم إماراتي", code: "AED", buyPrice: 1.32, sellPrice: 1.34, change: 0.01, updatedAt: new Date().toISOString() },
  { id: "7", name: "دينار تونسي", code: "TND", buyPrice: 1.55, sellPrice: 1.58, change: -0.02, updatedAt: new Date().toISOString() },
];

const defaultAdminAccount: AccountRecord = {
  id: "seed-admin",
  name: "المدير العام",
  email: "Admin@gmail.com",
  phone: "",
  password: "Admin123!",
  role: "admin",
  createdAt: new Date().toISOString(),
};

const readFromStorage = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage key ${key}`, error);
    return fallback;
  }
};

const writeToStorage = (key: string, value: unknown) => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write localStorage key ${key}`, error);
  }
};

const generateId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const sleep = (ms = 500) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const sanitizeAccount = (account: AccountRecord): PublicAccount => {
  const { password, ...safeAccount } = account;
  return safeAccount;
};

const ensureAdminPresence = (accounts: AccountRecord[]): AccountRecord[] => {
  if (accounts.some((account) => account.role === "admin")) {
    return accounts;
  }

  return [
    ...accounts,
    {
      ...defaultAdminAccount,
      id: generateId(),
      createdAt: new Date().toISOString(),
    },
  ];
};

interface LegacyRegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

interface LegacyAdminAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const hydrateAccounts = (): AccountRecord[] => {
  const storedAccounts = readFromStorage<AccountRecord[]>(ACCOUNT_STORAGE_KEY, []);
  if (storedAccounts.length) {
    return ensureAdminPresence(storedAccounts);
  }

  const legacyUsers = readFromStorage<LegacyRegisteredUser[]>(LEGACY_USER_STORAGE_KEY, []);
  const legacyAdmins = readFromStorage<LegacyAdminAccount[]>(LEGACY_ADMIN_STORAGE_KEY, []);

  const merged: AccountRecord[] = [
    ...legacyAdmins.map((admin) => ({
      id: admin.id ?? generateId(),
      name: admin.name,
      email: admin.email,
      phone: "",
      password: admin.password,
      role: "admin" as const,
      createdAt: admin.createdAt ?? new Date().toISOString(),
    })),
    ...legacyUsers.map((user) => ({
      id: user.id ?? generateId(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      role: "user" as const,
      createdAt: user.createdAt ?? new Date().toISOString(),
    })),
  ];

  if (!merged.length) {
    return [defaultAdminAccount];
  }

  return ensureAdminPresence(merged);
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [currencies, setCurrencies] = useState<CurrencyRecord[]>(() => readFromStorage(CURRENCY_STORAGE_KEY, defaultCurrencies));
  const [accounts, setAccounts] = useState<AccountRecord[]>(hydrateAccounts);
  const [sessionId, setSessionId] = useState<string | null>(() => readFromStorage<string | null>(SESSION_STORAGE_KEY, null));
  const [isCurrenciesLoading, setIsCurrenciesLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    writeToStorage(CURRENCY_STORAGE_KEY, currencies);
  }, [currencies]);

  useEffect(() => {
    writeToStorage(ACCOUNT_STORAGE_KEY, accounts);
  }, [accounts]);

  useEffect(() => {
    writeToStorage(SESSION_STORAGE_KEY, sessionId);
  }, [sessionId]);

  useEffect(() => {
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    if (sessionId && !accounts.some((account) => account.id === sessionId)) {
      setSessionId(null);
    }
  }, [accounts, sessionId]);

  const users = useMemo(() => accounts.map(sanitizeAccount), [accounts]);
  const currentUser = useMemo(() => {
    if (!sessionId) {
      return null;
    }

    const record = accounts.find((account) => account.id === sessionId);
    return record ? sanitizeAccount(record) : null;
  }, [accounts, sessionId]);

  const addCurrency = async (payload: CreateCurrencyPayload) => {
    const currency: CurrencyRecord = {
      ...payload,
      id: generateId(),
      code: payload.code.toUpperCase(),
      change: 0,
      updatedAt: new Date().toISOString(),
    };

    setCurrencies((prev) => [...prev, currency]);
    await sleep(200);
    return currency;
  };

  const updateCurrency = async (id: string, updates: UpdateCurrencyPayload) => {
    setCurrencies((prev) =>
      prev.map((currency) => {
        if (currency.id !== id) {
          return currency;
        }

        const nextBuyPrice = typeof updates.buyPrice === "number" ? updates.buyPrice : currency.buyPrice;
        const changeDelta = typeof updates.buyPrice === "number" ? nextBuyPrice - currency.buyPrice : currency.change;

        return {
          ...currency,
          ...updates,
          name: updates.name ?? currency.name,
          code: updates.code ? updates.code.toUpperCase() : currency.code,
          buyPrice: nextBuyPrice,
          sellPrice: typeof updates.sellPrice === "number" ? updates.sellPrice : currency.sellPrice,
          change: changeDelta,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    await sleep(200);
  };

  const deleteCurrency = async (id: string) => {
    setCurrencies((prev) => prev.filter((currency) => currency.id !== id));
    await sleep(150);
  };

  const fetchCurrencies = async () => {
    setIsCurrenciesLoading(true);
    await sleep(400);
    const refreshed = defaultCurrencies.map((currency) => ({
      ...currency,
      updatedAt: new Date().toISOString(),
    }));
    setCurrencies(refreshed);
    setIsCurrenciesLoading(false);
  };

  const register = async (payload: RegisterPayload) => {
    const trimmedEmail = payload.email.trim();
    const normalizedEmail = normalizeEmail(trimmedEmail);

    if (payload.confirmPassword && payload.password !== payload.confirmPassword) {
      throw new Error("كلمات المرور غير متطابقة");
    }

    if (payload.password.length < 6) {
      throw new Error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    }

    if (accounts.some((account) => normalizeEmail(account.email) === normalizedEmail)) {
      throw new Error("البريد الإلكتروني مستخدم بالفعل");
    }

    const newAccount: AccountRecord = {
      id: generateId(),
      name: payload.name.trim() || trimmedEmail,
      email: trimmedEmail,
      phone: payload.phone?.trim(),
      password: payload.password,
      role: payload.role ?? "user",
      createdAt: new Date().toISOString(),
    };

    setAccounts((prev) => [newAccount, ...prev]);
    setIsUsersLoading(true);
    try {
      await sleep(400);
      return sanitizeAccount(newAccount);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await sleep(300);
    const normalizedEmail = normalizeEmail(email);
    const match = accounts.find(
      (account) => normalizeEmail(account.email) === normalizedEmail && account.password === password
    );

    if (!match) {
      throw new Error("بيانات الدخول غير صحيحة");
    }

    setSessionId(match.id);
    return sanitizeAccount(match);
  };

  const logout = () => {
    setSessionId(null);
  };

  const updateUserRole = async (id: string, role: UserRole) => {
    const target = accounts.find((account) => account.id === id);
    if (!target) {
      throw new Error("الحساب غير موجود");
    }

    if (target.role === "admin" && role !== "admin") {
      const adminCount = accounts.filter((account) => account.role === "admin").length;
      if (adminCount <= 1) {
        throw new Error("لا يمكن حذف آخر مشرف");
      }
    }

    setAccounts((prev) => prev.map((account) => (account.id === id ? { ...account, role } : account)));
    if (sessionId === id && role !== "admin") {
      setSessionId(null);
    }

    setIsUsersLoading(true);
    try {
      await sleep(350);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const resetUserPassword = async (email: string, newPassword: string) => {
    const normalizedEmail = normalizeEmail(email);
    let wasUpdated = false;

    setAccounts((prev) =>
      prev.map((account) => {
        if (normalizeEmail(account.email) === normalizedEmail) {
          wasUpdated = true;
          return { ...account, password: newPassword };
        }
        return account;
      })
    );

    await sleep(300);

    if (!wasUpdated) {
      return { success: false, error: "لا يوجد حساب مرتبط بهذا البريد" };
    }

    return { success: true };
  };

  const value: DataContextValue = {
    currencies,
    users,
    currentUser,
    isAuthReady,
    isCurrenciesLoading,
    isUsersLoading,
    addCurrency,
    updateCurrency,
    deleteCurrency,
    fetchCurrencies,
    register,
    login,
    logout,
    updateUserRole,
    resetUserPassword,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataStore = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataStore must be used within a DataProvider");
  }
  return context;
};
