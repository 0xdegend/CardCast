"use client";

import { useLogin } from "@privy-io/react-auth";

/** Network enforcement is handled globally by `BaseChainGate` + `useRequireBaseChain`. */
export function LoginButton() {
  const { login } = useLogin({
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return <button onClick={() => login()}>Connect Wallet</button>;
}
