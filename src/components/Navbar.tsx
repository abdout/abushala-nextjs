"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useDataStore } from "@/context/DataContext";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useDataStore();

  const isAdmin = currentUser?.role === "admin";
  const isLoggedInFromContext = Boolean(currentUser);
  const showLogoutButton = typeof isAuthenticated === "boolean" ? isAuthenticated : isLoggedInFromContext;

  const handleLogout = () => {
    logout();
    onLogout?.();
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
    ...(isAdmin ? [{ href: "/admin", label: "لوحة التحكم" }] : []),
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-card shadow-soft sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/02.png"
              alt="شعار مكتب أبو شعالة"
              className="w-12 h-12 object-contain drop-shadow-md"
            />
            <div className="hidden md:block">
              <h1 className="font-bold text-lg text-primary">مكتب أبو شعالة</h1>
              <p className="text-xs text-muted-foreground">للتحويلات المالية</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-smooth hover:text-accent ${isActive(link.href) ? "text-accent" : "text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              تسجيل خروج
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-4 rounded-lg font-medium transition-smooth ${isActive(link.href)
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-muted"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                size="sm"
                className="gap-2 w-full"
              >
                <LogOut className="w-4 h-4" />
                تسجيل خروج
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
