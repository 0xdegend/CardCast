// ClientProviders.tsx
"use client";
import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { config } from "./WagmiClient";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          defaultChain: base,
          supportedChains: [base],
        }}
      >
        {children}
      </PrivyProvider>
    </WagmiProvider>
  );
}
