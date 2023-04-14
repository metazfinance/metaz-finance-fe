import { handleError } from "@/utils/ultities";
import { contractAddress } from "@/web3Config/contract";
import { Erc20__factory } from "@/web3Config/type";
import {
  useGetAccount,
  useGetProvider,
  useGetSinger,
} from "@/web3Provider/hookStore/useGetProvider";
import { Toast, useDisclosure } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-query";

export const useERC20Action = (token?: string) => {
  const account = useGetAccount();

  const provider = new ethers.providers.Web3Provider(window.ethereum as any);

  const contractInstance = Erc20__factory.connect(
    token || contractAddress.ERC20,
    provider.getSigner()
  );

  const balanceOf = useCallback(
    async (account: IAddress) => {
      const _balance = await contractInstance?.balanceOf(account);
      return _balance;
    },
    [account]
  );

  const getAllowance = useCallback(
    async (spender: IAddress) => {
      if (!account) return 0;
      const _allowance = await contractInstance?.allowance(account, spender);
      return _allowance;
    },
    [account]
  );

  const onApprove = useMutation(async (spender: IAddress) => {
    try {
      const tx = await contractInstance?.approve(
        spender,
        BigNumber.from(10).pow(60)
      );
      await tx?.wait();
      return tx;
    } catch (e) {
      return handleError(e);
    }
  });

  const revokeApprove = useMutation(
    async (spender: IAddress) => {
      const tx = await contractInstance?.approve(spender, BigNumber.from(0));
      await tx?.wait();
      return tx;
    },
    {
      onError: (e) => {
        console.log(e);
        Toast({
          description: "Error",
          status: "error",
          duration: 200,
        });
      },
      onSuccess: () => {
        Toast({
          description: "Revoked",
          status: "success",
          duration: 200,
        });
      },
    }
  );

  return {
    balanceOf,
    getAllowance,
    onApprove,
    revokeApprove,
  };
};

export const useApproveERC20 = (spender: IAddress, token?: string) => {
  const setIsApprove = useDisclosure();

  const erc20Action = useERC20Action(token);
  const checkApprove = async () => {
    const _allowance = await erc20Action.getAllowance(spender);
    if (Number(_allowance) > 0) {
      setIsApprove.onOpen();
    } else {
      setIsApprove.onClose();
    }
  };
  useEffect(() => {
    checkApprove();
  }, []);

  return {
    isApprove: setIsApprove.isOpen,
    approve: async () => {
      await erc20Action.onApprove.mutateAsync(spender);
      await checkApprove();
    },
    isApproving: erc20Action.onApprove.isLoading,
  };
};

export const useBalanceErc20 = (
  token?: IAddress | string,
  address?: IAddress
) => {
  const disclosure = useDisclosure();
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const { balanceOf } = useERC20Action(token);
  const account = useGetAccount();

  const getBalance = async () => {
    if (account || address) {
      disclosure.onOpen();
      balanceOf(address || (account as IAddress)).then((balance: any) => {
        setBalance(balance);
        disclosure.onClose();
      });
    }
  };

  useEffect(() => {
    getBalance();
    let interval = setInterval(() => {
      if (address || account) {
        getBalance();
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [account, address]);

  return { isFetching: disclosure.isOpen, balance, getBalance };
};
