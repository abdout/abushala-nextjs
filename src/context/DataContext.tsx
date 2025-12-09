"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Currency {
  id: string;
  name: string;
  code: string;
  buyPrice: number;
  sellPrice: number;
  change: number;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface DataContextType {
  currencies: Currency[];
  setCurrencies: (currencies: Currency[]) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <DataContext.Provider
      value={{
        currencies,
        setCurrencies,
        currentUser,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useDataStore() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataStore must be used within a DataProvider");
  }
  return context;
}
