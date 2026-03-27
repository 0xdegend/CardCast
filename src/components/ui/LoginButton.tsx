"use client";

import { useEffect, useState } from "react";
import { useLogin, useWallets } from "@privy-io/react-auth";
import { base } from "viem/chains";

export function LoginButton() {
  const { wallets } = useWallets();
  const [checkBaseAfterLogin, setCheckBaseAfterLogin] = useState(false);

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
      setCheckBaseAfterLogin(true);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  useEffect(() => {
    if (!checkBaseAfterLogin || wallets.length === 0) return;

    const enforceBase = async () => {
      const wallet = wallets[0];
      if (!wallet) return;

      try {
        const provider = await wallet.getEthereumProvider();
        const chainIdHex = await provider.request({ method: "eth_chainId" });
        const chainId = Number(chainIdHex);

        if (chainId !== base.id) {
          await wallet.switchChain(base.id);
        }
      } catch (error) {
        console.error("Please switch your wallet to Base to continue.", error);
      } finally {
        setCheckBaseAfterLogin(false);
      }
    };

    void enforceBase();
  }, [checkBaseAfterLogin, wallets]);

  return <button onClick={() => login()}>Connect Wallet</button>;
}
