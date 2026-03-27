"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn, formatXP } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  usePrivy,
  useWallets,
  useLogout,
  useLoginWithSiwe,
  useLogin,
} from "@privy-io/react-auth";
import { Button } from "@/components/ui/Button";
import { Bell, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
  { href: "/create", label: "Create" },
];

export function Nav() {
  const pathname = usePathname();
  const { wallets } = useWallets();
  const { notifCount, clearNotifs } = useAppStore();
  const { authenticated, user } = usePrivy();
  const isAuthenticated = authenticated;

  const [mobileOpen, setMobileOpen] = useState(false);

  const { login } = useLogin({
    onComplete: ({
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      loginAccount,
    }) => {
      console.log("Logged in user:", user);
      console.log("New user?", isNewUser);
      console.log("Already authenticated?", wasAlreadyAuthenticated);
      console.log("Login method:", loginMethod);
      console.log("Login account:", loginAccount);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const handleLogin = async () => {
    login();
  };

  const { logout } = useLogout({
    onSuccess: () => {
      console.log("User successfully logged out");
    },
  });

  const handleLogout = async () => {
    logout();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-var(--border) h-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-(--teal) to-(--purple) flex items-center justify-center text-sm font-bold text-black select-none">
              ◈
            </div>
            <span className="font-display font-extrabold text-base tracking-tight">
              CardCast
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-[rgba(0,229,204,0.08)] border border-[rgba(0,229,204,0.15)] text-[10px] font-bold text-(--teal) tracking-widest font-display">
              BETA
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-sm text-sm font-display font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-(--teal) bg-[rgba(0,229,204,0.08)]"
                    : "text-(--text-muted) hover:text-(--text) hover:bg-white/5",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* XP Pill */}
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(240,180,41,0.08)] border border-[rgba(240,180,41,0.2)] rounded-sm">
                  <span className="text-xs">⚡</span>
                  <span className="font-mono text-[13px] text-(--gold) font-medium">
                    {/* {formatXP(user?.xp)} XP */}
                    30 XP
                  </span>
                </div>

                {/* Notif bell */}
                <button
                  onClick={clearNotifs}
                  className="relative p-2 rounded-sm text-(--text-muted) hover:text-(--text) hover:bg-white/5 transition-colors"
                >
                  <Bell size={16} />
                  {notifCount > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-(--red) text-[9px] font-bold text-white flex items-center justify-center">
                      {notifCount}
                    </span>
                  )}
                </button>

                {/* Avatar */}
                <Link href="/profile">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-(--teal) to-(--purple) flex items-center justify-center text-xs font-extrabold text-black cursor-pointer">
                    {/* {user.handle.slice(0, 2).toUpperCase()} */}
                    0x
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="hidden sm:block text-xs text-(--text-dim) hover:text-(--text-muted) transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <Button size="md" onClick={handleLogin}>
                Connect Wallet
              </Button>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden p-1.5 text-(--text-muted)"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 pt-15 glass md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="flex flex-col p-4 gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-md text-base font-display font-semibold transition-all",
                  pathname === link.href
                    ? "text-(--teal) bg-[rgba(0,229,204,0.08)]"
                    : "text-(--text-muted)",
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
