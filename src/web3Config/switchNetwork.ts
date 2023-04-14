// @ts-nocheck
import { CHAIN_ID } from "@/web3Config/contract";
import { BigNumber, ethers } from "ethers";

export const switchChainMetaMask = async (chainId: any) => {
  await addChainMetaMask(+BigNumber.from(CHAIN_ID));
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId }],
  });
};

export const addChainMetaMask = async (chain: any) => {
  if (+chain == 52) {
    // eslint-disable-next-line no-console
    console.log(chain, "chain");
    if (!window.ethereum) return;
    return await window.ethereum.request({
      id: 5,
      jsonrpc: "2.0",
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: ethers.BigNumber.from(CHAIN_ID).toHexString(),
          chainName: "Coinex",
          rpcUrls: ["https://rpc.coinex.net"],
          nativeCurrency: {
            name: "CET",
            symbol: "CET",
            decimals: 18,
          },
          blockExplorerUrls: ["https://www.coinex.net"],
        },
      ],
    });
  }
};

export const handleChainId = async (chain: any) => {
  if (+chain != +CHAIN_ID) {
    console.log("hello123");
    await switchChainMetaMask(ethers.BigNumber.from(CHAIN_ID).toHexString());
  }
};
