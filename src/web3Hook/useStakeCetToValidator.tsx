import { handleError } from "@/utils/ultities";
import { contractAddress } from "@/web3Config/contract";
import { multicall } from "@/web3Config/multicall";
import {
  StakingRewards__factory,
  StakingToValidator__factory,
} from "@/web3Config/type";
import {
  useGetAccount,
  useGetProvider,
  useGetSinger,
} from "@/web3Provider/hookStore/useGetProvider";
import { useToast } from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { useMutation, useQuery } from "react-query";

export const useInfoValidator = () => {
  const address = useGetAccount();
  const singer = useGetSinger();
  const provider = useGetProvider();

  const contractStakingInstance = StakingToValidator__factory.connect(
    contractAddress.stakingCetToValidator,
    singer || provider
  );

  const contractRewardInstance = StakingRewards__factory.connect(
    contractAddress.rewardContractStakeValidator,
    provider
  );

  const getTotalStaking = async () => {
    const _data = await contractStakingInstance.getValidatorInfo(
      contractAddress.COIN_EX_VALIDATOR
    );
    return _data;
  };

  const getInfoStake = async () => {
    if (!address) return BigNumber.from(0);
    const _data = await contractStakingInstance.getStakingInfo(
      address,
      contractAddress.COIN_EX_VALIDATOR
    );
    return _data;
  };

  const getReward = async () => {
    if (!address) return BigNumber.from(0);
    const _data = await contractRewardInstance.reward(address);
    return _data;
  };

  const getData = async () => {
    const totalStaking = await getTotalStaking();
    const stakingInfo = await getInfoStake();
    const dataReward = await getReward();

    // const [_dataStaking, _dataReward] = await Promise.all([
    //   multicall(contractStakingInstance.interface, calls, provider),
    //   multicall(contractRewardInstance.interface, callOnRewardPool, singer),
    // ]);

    const blockHeight = await provider.getBlockNumber();

    // const totalStaking = _dataStaking[0][0];
    // const stakingInfo = _dataStaking[1];
    // const dataReward = _dataReward[0];

    const firstInfo = stakingInfo[0]; //amount staked
    const secondInfo = stakingInfo[1]; // block height unstake

    const contractList = [contractAddress.stakingCetToValidator];
    const _data = {
      hasStaking: +secondInfo == 0,
      hasUnstake: +firstInfo > 0 && +secondInfo == 0,

      isShowWithdraw: +secondInfo > 0,

      isWaitingWithdraw: +secondInfo > 0 && +blockHeight <= +secondInfo + 86400,

      hasClaimable: +dataReward > 0,
      contract: contractList[0],
      isStaking: +firstInfo > 0,
      totalStaking: totalStaking[2],
      totalStakedByAccount: stakingInfo ? stakingInfo[0] : BigNumber.from(0),
      totalReward: dataReward ? dataReward : BigNumber.from(0),
    } as unknown as IPoolValidatorStake;

    return _data;
  };

  const _data = useQuery({
    queryKey: ["useInfoValidator", address],
    queryFn: getData,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 0.5,
    refetchOnReconnect: true,
  });

  return _data;
};

export const useActionInfoValidator = () => {
  const toast = useToast();
  const validator = contractAddress.COIN_EX_VALIDATOR;
  const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  const contractStakingInstance = StakingToValidator__factory.connect(
    contractAddress.stakingCetToValidator,
    provider.getSigner()
  );

  const { refetch } = useInfoValidator();

  const stake = useMutation(async (amount: number) => {
    try {
      const _amount = ethers.utils.parseUnits(amount + "", 18);

      const tx = await contractStakingInstance.stake(
        contractAddress.COIN_EX_VALIDATOR,
        {
          value: _amount,
        }
      );
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

  const unStake = useMutation(async () => {
    try {
      const tx = await contractStakingInstance.unstake(validator);
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

  const withdrawTokenStake = useMutation(async () => {
    try {
      const tx = await contractStakingInstance.withdrawStaking(validator);
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
    const contractRewardInstance = StakingRewards__factory.connect(
      contractAddress.rewardContractStakeValidator,
      provider.getSigner()
    );

    try {
      const tx = await contractRewardInstance.claimReward();
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
    unStake,
    withdrawTokenStake,
    claimReward,
  };
};
