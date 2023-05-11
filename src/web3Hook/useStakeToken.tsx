import { handleError } from "@/utils/ultities";
import { contractAddress } from "@/web3Config/contract";
import { multicall } from "@/web3Config/multicall";
import { Reward__factory, TokenStaking__factory } from "@/web3Config/type";
import {
  useGetAccount,
  useGetProvider,
  useGetSinger,
} from "@/web3Provider/hookStore/useGetProvider";
import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useMutation, useQuery } from "react-query";
import { useCheckValidNetwork } from "./useCheckValidNetwork";
import { useBalanceErc20 } from "./useErc20";

export const useInfoPoolStakeToken = () => {
  const address = useGetAccount();
  const provider = useGetProvider();
  const singer = useGetSinger();
  const contractStakingInstance = TokenStaking__factory.connect(
    contractAddress.stakingTokenV1,
    singer || provider
  );

  const contractGetReward = Reward__factory.connect(
    contractAddress.CONTRACT_CALCULATOR_REWARD,
    singer || provider
  );

  const pools = [
    contractAddress.stakingTokenV1,
    contractAddress.stakingTokenV2,
    contractAddress.stakingTokenV3,
  ];

  // const poolCallReward = pools.map((poolAddress) => {
  //   return [
  //     {
  //       address: poolAddress,
  //       name: "timestamp",
  //     },
  //     {
  //       address: poolAddress,
  //       name: "startTimeForReward",
  //       params: [address],
  //     },
  //     {
  //       address: poolAddress,
  //       name: "totalStakedByAccount",
  //       params: [address],
  //     },
  //     {
  //       address: poolAddress,
  //       name: "rewardPaidByAccount",
  //       params: [address],
  //     },
  //     {
  //       address: poolAddress,
  //       name: "maxRewardByAccount",
  //       params: [address],
  //     },
  //     {
  //       address: poolAddress,
  //       name: "apy",
  //     },
  //     {
  //       address: poolAddress,
  //       name: "secondPerYear",
  //     },
  //   ];
  // });

  const poolCalls = pools.map((poolAddress) => {
    return [
      {
        address: poolAddress,
        name: "totalStaked",
      },
      {
        address: poolAddress,
        name: "totalStakedByAccount",
        params: [address],
      },
      {
        address: poolAddress,
        name: "totalReward",
        params: [address],
      },
      {
        address: poolAddress,
        name: "amountClaimable",
        params: [address],
      },
      {
        address: poolAddress,
        name: "stakingEnable",
      },
      {
        address: poolAddress,
        name: "amountStakeable",
      },
    ];
  });

  const pollCallCalculateReward = pools.map((poolAddress) => {
    return [
      {
        address: contractAddress.CONTRACT_CALCULATOR_REWARD,
        name: "totalRewardCal",
        params: [poolAddress, address],
      },
    ];
  });

  const getData = async () => {
    const apy = [50, 100, 300];
    const limit = [800000, 100000, 20000];
    const endIn = ["1 Years", "3 Years", "5 Years"];

    if (!address) return [];
    const _dataPromise = await Promise.all([
      multicall(contractStakingInstance.interface, poolCalls[0], provider),
      multicall(contractStakingInstance.interface, poolCalls[1], provider),
      multicall(contractStakingInstance.interface, poolCalls[2], provider),
    ]);

    const _dataReward = await Promise.all([
      multicall(
        contractGetReward.interface,
        pollCallCalculateReward[0],
        provider
      ),
      multicall(
        contractGetReward.interface,
        pollCallCalculateReward[1],
        provider
      ),
      multicall(
        contractGetReward.interface,
        pollCallCalculateReward[2],
        provider
      ),
    ]);

    const _data = _dataPromise.map((pool, index) => {
      return {
        contract: pools[index],
        totalStaked: pool[0][0],
        limit: limit[index],
        apy: apy[index],
        endIn: endIn[index],
        totalStakedByAccount: pool[1][0],
        // totalReward: pool[2][0],
        totalReward: +_dataReward[index][0],
        amountClaimable: pool[3][0],
        isOpenStake: !!pool[4][0],
        maxStake: pool[5][0],
      };
    });

    return _data;
  };

  const _data = useQuery({
    queryKey: ["useInfoPoolStakeToken", address],
    queryFn: getData,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 0.5,
    refetchOnReconnect: true,
  });

  return _data;
};

export const useActionIOnPool = (contractAddress: IAddress | string) => {
  const { refetch } = useInfoPoolStakeToken();
  const { isValid } = useCheckValidNetwork();

  const { getBalance } = useBalanceErc20();
  const toast = useToast();

  const getInstance = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const contractStakingInstance = TokenStaking__factory.connect(
      contractAddress,
      provider.getSigner()
    );

    return contractStakingInstance;
  };
  const stake = useMutation(async (amount: number) => {
    try {
      if (!isValid) {
        toast({
          title: "Network not support",
          description: "Please change to Coin-ex Mainnet",
          status: "error",
        });
      }

      const instance = getInstance();
      const _amount = ethers.utils.parseUnits(amount + "", 18);

      const tx = await instance?.stake(_amount);
      if (tx) {
        await tx?.wait();
        refetch();
        getBalance();
      }
      return tx;
    } catch (e) {
      return handleError(e);
    }
  });

  const unStake = useMutation(async (amount: number) => {
    try {
      if (!isValid) {
        toast({
          title: "Network not support",
          description: "Please change to Coin-ex Mainnet",
          status: "error",
        });
      }
      const instance = getInstance();
      const _amount = ethers.utils.parseUnits(amount + "", 18);
      const tx = await instance?.multiUnstake(_amount);
      if (tx) {
        await tx?.wait();
        refetch();
        getBalance();
      }
      return tx;
    } catch (e) {
      return handleError(e);
    }
  });

  const claimReward = useMutation(async () => {
    try {
      if (!isValid) {
        toast({
          title: "Network not support",
          description: "Please change to Coin-ex Mainnet",
          status: "error",
        });
      }
      const instance = getInstance();
      const tx = await instance?.claim_reward();
      if (tx) {
        await tx?.wait();
        refetch();
        getBalance();
      }
      return tx;
    } catch (e) {
      return handleError(e);
    }
  });

  return {
    stake,
    unStake,
    claimReward,
  };
};
