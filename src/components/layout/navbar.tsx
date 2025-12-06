"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { logout } from "@/components/auth/logout-action";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "تواصل معنا" },
    ...(isAdmin ? [{ href: "/admin", label: "لوحة التحكم" }] : []),
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">ش</span>
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-lg text-gray-900">مكتب أبو شعالة</h1>
              <p className="text-xs text-gray-500">للتحويلات المالية</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors hover:text-amber-600 ${
                  isActive(link.href) ? "text-amber-600" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <form action={handleLogout}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  تسجيل خروج
                </Button>
              </form>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-amber-100 text-amber-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn && (
                <form action={handleLogout}>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل خروج
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
