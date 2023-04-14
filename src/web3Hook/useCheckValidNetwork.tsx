import { CHAIN_ID } from "@/web3Config/contract";
import {
  useGetAccount,
  useGetProvider,
} from "@/web3Provider/hookStore/useGetProvider";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

export const useCheckValidNetwork = () => {
  const provider = useGetProvider();
  const [isValid, setIsValid] = useState(false);
  const account = useGetAccount();

  const onCheckValidNetwork = () => {
    if (provider && window?.ethereum && "chainId" in window.ethereum) {
      const chain = window.ethereum?.chainId
        ? +BigNumber.from(window.ethereum?.chainId)
        : 0;
      if (+chain == +CHAIN_ID) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }
  };

  useEffect(() => {
    onCheckValidNetwork();
  }, [account]);

  return { isValid, onCheckValidNetwork, setIsValid };
};
