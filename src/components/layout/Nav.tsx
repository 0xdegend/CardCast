"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import {
  usePrivy,
  useWallets,
  useLogout,
  useLogin,
  useFundWallet,
} from "@privy-io/react-auth";
import { base } from "viem/chains";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { WalletWidget } from "../ui/WalletWidget";

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
  const { authenticated, user } = usePrivy();
  const [mobileOpen, setMobileOpen] = useState(false);

  const rawAddress = wallets[0]?.address;
  const connectedAddress =
    rawAddress && /^0x[0-9a-fA-F]{40}$/.test(rawAddress) ? rawAddress : null;

  const { login } = useLogin({
    onComplete: ({
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      loginAccount,
    }) => {
      console.log("Logged in:", user, {
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        loginAccount,
      });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const { logout } = useLogout({
    onSuccess: () => {
      console.log("User successfully logged out");
    },
  });

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

          {/* Desktop nav links */}
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
            {authenticated && user && connectedAddress ? (
              <WalletWidget
                walletAddress={connectedAddress}
                handle={connectedAddress.slice(2, 4)}
                xp={30}
                onDisconnect={logout}
              />
            ) : (
              <Button size="md" onClick={() => login()}>
                Connect Wallet
              </Button>
            )}

            <button
              className="md:hidden p-1.5 text-(--text-muted)"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
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

            {authenticated && connectedAddress && (
              <div className="mt-3 pt-3 border-t border-white/8">
                <MobileFundButton address={connectedAddress} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MobileFundButton({ address }: { address: string }) {
  const { fundWallet } = useFundWallet();

  const handleFund = async () => {
    try {
      await fundWallet({
        address: address,
        options: {
          chain: base,
          amount: "50",
          asset: "USDC",
        },
      });
    } catch (err) {
      console.error("[MobileFundButton] fundWallet error:", err);
    }
  };

  return (
    <button
      onClick={handleFund}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-display font-semibold text-sm text-(--teal) bg-[rgba(0,229,204,0.06)] border border-[rgba(0,229,204,0.15)] hover:bg-[rgba(0,229,204,0.1)] transition-all"
    >
      + Fund Wallet with USDC
    </button>
  );
}
