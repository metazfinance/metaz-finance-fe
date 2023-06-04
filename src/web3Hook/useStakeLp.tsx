import { handleError } from "@/utils/ultities";
import { contractAddress } from "@/web3Config/contract";
import { multicall } from "@/web3Config/multicall";
import { LpStaking__factory } from "@/web3Config/type";
import {
  useGetAccount,
  useGetProvider,
  useGetSinger,
} from "@/web3Provider/hookStore/useGetProvider";
import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useMutation, useQuery } from "react-query";

export const AMOUNT_CHEAT = 0.000000001;
export const BIG_AMOUNT_CHEAT = 0.000000001 * 10 ** 18;
export const useStakeLp = () => {
  const address = useGetAccount();
  const singer = useGetSinger();
  const provider = useGetProvider();

  const lpStakingInstance = LpStaking__factory.connect(
    contractAddress.stakingLpTokenV1,
    singer || provider
  );

  const calls = [
    {
      address: contractAddress.stakingLpTokenV1,
      name: "LPstakedBalance",
      params: [address],
    },
    {
      address: contractAddress.stakingLpTokenV1,
      name: "reward",
      params: [address],
    },
    {
      address: contractAddress.stakingLpTokenV1,
      name: "LPstakeable",
    },
    {
      address: contractAddress.stakingLpTokenV1,
      name: "LPtotalStaked",
    },
  ];

  const getData = async () => {
    const [balanceStaked, reward, isStakeable, lPtotalStaked] = await multicall(
      lpStakingInstance.interface,
      calls,
      provider
    );

    return {
      balanceStaked: balanceStaked[0],
      reward: reward[0],
      isStakeable: isStakeable[0],
      LPtotalStaked: lPtotalStaked[0],
    };
  };

  const _data = useQuery({
    queryKey: ["useStakeLp", address],
    queryFn: getData,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchIntervalInBackground: true,
    staleTime: 1000 * 60 * 0.5,
    refetchOnReconnect: true,
  });

  return _data;
};

export const useActionStakeLpToken = () => {
  const toast = useToast();
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const contractStakingInstance = LpStaking__factory.connect(
    contractAddress.stakingLpTokenV1,
    provider.getSigner()
  );

  const decimal = 18;
  const { refetch } = useStakeLp();

  const stake = useMutation(async (amount: number) => {
    try {
      const _amount = ethers.utils.parseUnits(
        amount - 0.000000001 + "",
        decimal
      );
      const tx = await contractStakingInstance.stakeLP(_amount);
      if (tx) {
        await tx?.wait();
        refetch();
      }
      return tx;
    } catch (e: any) {
      toast({
        description: e?.message || e?.error?.data?.message || "Something wrong",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return handleError(e);
    }
  });

  const withdrawLP = useMutation(async (amount: number) => {
    const _amount = ethers.utils.parseUnits(amount - 0.000000001 + "", decimal);

    try {
      const tx = await contractStakingInstance.withdrawLP(_amount);
      if (tx) {
        await tx?.wait();
        refetch();
      }
      return tx;
    } catch (e: any) {
      toast({
        description: e?.message || e?.error?.data?.message || "Something wrong",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return handleError(e);
    }
  });

  const claimReward = useMutation(async () => {
    try {
      const tx = await contractStakingInstance.claimReward();
      if (tx) {
        await tx?.wait();
        refetch();
      }
      return tx;
    } catch (e: any) {
      toast({
        description: e?.message || e?.error?.data?.message || "Something wrong",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return handleError(e);
    }
  });

  return {
    stake,
    withdrawLP,
    claimReward,
  };
};
