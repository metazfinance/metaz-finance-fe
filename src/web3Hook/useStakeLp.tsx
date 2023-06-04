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
export const BIG_AMOUNT_CHEAT = 0.000000001;

export const useStakeLp = () => {
  const address = useGetAccount();
  const singer = useGetSinger();
  const provider = useGetProvider();

  const lpStakingInstance = LpStaking__factory.connect(
    contractAddress.stakingLpTokenV1,
    singer || provider
  );

  const lpStakingInstanceV2 = LpStaking__factory.connect(
    contractAddress.stakingLpTokenV2,
    singer || provider
  );

  const calls = [
    contractAddress.stakingLpTokenV1,
    contractAddress.stakingLpTokenV2,
  ].map((contract) => {
    return [
      {
        address: contract,
        name: "LPstakedBalance",
        params: [address],
      },
      {
        address: contract,
        name: "reward",
        params: [address],
      },
      {
        address: contract,
        name: "LPstakeable",
      },
      {
        address: contract,
        name: "LPtotalStaked",
      },
    ];
  });

  const getData = async () => {
    const _dataPromise = await Promise.all([
      multicall(lpStakingInstance.interface, calls[0], provider),
      multicall(lpStakingInstanceV2.interface, calls[1], provider),
    ]);

    const _dataInfo = [
      {
        symbol_lp: "MTZ/CET",
        contractLP: contractAddress.ERC_LP_TOKEN,
      },
      {
        symbol_lp: "USDT/CET",
        contractLP: contractAddress.ERC_LP_TOKEN_STABLE,
      },
    ];

    const _data = _dataPromise.map(
      ([balanceStaked, reward, isStakeable, lPtotalStaked], idx) => {
        return {
          balanceStaked: balanceStaked[0],
          reward: reward[0],
          isStakeable: isStakeable[0],
          LPtotalStaked: lPtotalStaked[0],
          symbol_lp: _dataInfo[idx].symbol_lp,
          contract: calls[idx][0].address,
          contractLP: _dataInfo[idx].contractLP,
        };
      }
    );

    return _data as Array<IPoolLpStake>;
  };

  const _data = useQuery({
    queryKey: ["useStakeLp", address],
    queryFn: getData,
    refetchOnMount: true,
    enabled: !!address,
    staleTime: 1000 * 60 * 0.5,
  });

  return _data;
};

export const useActionStakeLpToken = (contract: string) => {
  const toast = useToast();
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const contractStakingInstance = LpStaking__factory.connect(
    contract,
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
