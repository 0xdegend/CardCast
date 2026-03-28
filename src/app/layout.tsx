import type { Metadata } from "next";
import "@/styles/globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { ClientProviders } from "./wrapper/ClientProvider";
import { BaseChainGate } from "@/components/wallet/BaseChainGate";

export const metadata: Metadata = {
  title: {
    default: "CardCast — TCG Prediction Markets",
    template: "%s | CardCast",
  },
  description:
    "The prediction market built for TCG collectors. Bet on card prices, grading outcomes, and pull odds. Earn XP toward the $CAST airdrop.",
  keywords: [
    "pokemon",
    "tcg",
    "prediction market",
    "cards",
    "grading",
    "defi",
    "web3",
  ],
  openGraph: {
    title: "CardCast — TCG Prediction Markets",
    description: "Predict. Collect. Win.",
    type: "website",
    url: "https://cardcast.xyz",
  },
  twitter: {
    card: "summary_large_image",
    title: "CardCast — TCG Prediction Markets",
    description: "Predict. Collect. Win.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="noise-overlay" aria-hidden />
        <ClientProviders>
          <Nav />
          <BaseChainGate>{children}</BaseChainGate>
        </ClientProviders>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--bg-elevated)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              fontFamily: "var(--font-display)",
            },
          }}
        />
      </body>
    </html>
  );
}
