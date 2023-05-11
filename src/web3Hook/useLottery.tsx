import { handleError } from "@/utils/ultities";
import { PUBLIC_RPC, contractAddress } from "@/web3Config/contract";
import { multicall } from "@/web3Config/multicall";
import { Lottery__factory } from "@/web3Config/type";
import {
  useGetAccount,
  useGetProvider,
  useGetSinger,
} from "@/web3Provider/hookStore/useGetProvider";
import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useMutation, useQuery } from "react-query";

export const useLottery = () => {
  const provider = useGetProvider();
  const singer = useGetSinger();

  const contractLotteryInstance = Lottery__factory.connect(
    contractAddress.lotteryV1,
    singer || provider
  );

  const calls = [
    {
      address: contractAddress.lotteryV1,
      name: "currentLotteryId",
    },
    {
      address: contractAddress.lotteryV1,
      name: "tier1_rate",
    },
    {
      address: contractAddress.lotteryV1,
      name: "tier2_rate",
    },
    {
      address: contractAddress.lotteryV1,
      name: "tier3_rate",
    },
    {
      address: contractAddress.lotteryV1,
      name: "fee_rate",
    },
  ];
  const getData = async () => {
    const _dataPromise = await multicall(
      contractLotteryInstance.interface,
      calls,
      provider
    );

    const _data = {
      currentLotteryId: +_dataPromise[0],
      tiers: [+_dataPromise[1], +_dataPromise[2], +_dataPromise[3]],
      fee_rate: +_dataPromise[4],
    };

    return _data as {
      currentLotteryId: number;
      tiers: number[];
      fee_rate: number;
    };
  };

  const _data = useQuery({
    queryKey: ["useLottery"],
    queryFn: getData,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 0.5,
    refetchOnReconnect: true,
  });

  return _data;
};

export const useGetLeaderBoard = () => {
  const provider = useGetProvider();
  const singer = useGetSinger();

  const contractLotteryInstance = Lottery__factory.connect(
    contractAddress.lotteryV1,
    singer || provider
  );

  const lotteryCalls = [
    {
      address: contractAddress.lotteryV1,
      name: "getLeaderboard",
    },
    {
      address: contractAddress.lotteryV1,
      name: "totalReward",
    },
  ];

  const getData = async () => {
    console.log("hello");

    const _dataPromise = await Promise.all([
      multicall(contractLotteryInstance.interface, lotteryCalls, provider),
    ]);

    const _data = {
      leaderBoardList: _dataPromise[0][0][0],
      tickets: _dataPromise[0][0][1],
      totalReward: _dataPromise[0][1],
    };

    return _data as {
      leaderBoardList: string[];
      tickets: any[];
    };
  };

  const _data = useQuery({
    queryKey: ["useGetLeaderBoard"],
    queryFn: getData,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 0.5,
    refetchOnReconnect: true,
  });

  return _data;
};

export const useGetLotteryInfo = () => {
  const provider = useGetProvider();
  const singer = useGetSinger();
  const address = useGetAccount();
  const contractLotteryInstance = Lottery__factory.connect(
    contractAddress.lotteryV1,
    singer || provider
  );

  const getLotteryInfo = async (lotteryId) => {
    if (+lotteryId == 0) return null;
    const _lotteryInfo = await contractLotteryInstance._lotteries(+lotteryId);

    return _lotteryInfo;
  };

  const getRewardAccount = async (lotteryId) => {
    const _reward = await contractLotteryInstance.rewardCalculate(
      address,
      +lotteryId
    );
    return +_reward;
  };

  const getIsClaimable = async (lotteryId) => {
    const isClaimed = await contractLotteryInstance.isClaimed(
      address,
      +lotteryId
    );
    return +isClaimed;
  };

  return {
    getLotteryInfo,
    getRewardAccount,
    getIsClaimable,
  };
};

export const useGetCurrentLotteryInfo = () => {
  const singer = useGetSinger();
  const account = useGetAccount();

  const lotteryCalls = [
    {
      address: contractAddress.lotteryV1,
      name: "currentLotteryId",
    },
    {
      address: contractAddress.lotteryV1,
      name: "totalReward",
    },
  ];

  const getData = async () => {
    const provider = new ethers.providers.JsonRpcProvider(PUBLIC_RPC);
    const contractLotteryInstance = Lottery__factory.connect(
      contractAddress.lotteryV1,
      singer || provider
    );

    const _dataPromise = await Promise.all([
      multicall(contractLotteryInstance.interface, lotteryCalls, provider),
    ]);

    const currentLotteryId = +_dataPromise[0][0];
    const totalReward = +_dataPromise[0][1];

    if (currentLotteryId == 0) {
      return {
        currentLotteryId: 0,
        maxNumberTicketsPerUser: 5000,
        status: 0,
        blockEnd: 0,
        myReward: 0,
        blockStart: 0,
        totalReward: 0,
        finalNumber: 0,
      };
    } else {
      const calls = [
        {
          address: contractAddress.lotteryV1,
          name: "_lotteries",
          params: [currentLotteryId],
        },
        {
          address: contractAddress.lotteryV1,
          name: "totalTicketByUser",
          params: [account, currentLotteryId],
        },
        {
          address: contractAddress.lotteryV1,
          name: "checkFreeTicketsClaimable",
          params: [account],
        },
      ];

      const _dataPromise = await Promise.all([
        multicall(contractLotteryInstance.interface, calls, provider),
      ]);

      const _lotteries = _dataPromise[0][0];
      const countTicket = _dataPromise[0][1];
      const ticketFree = _dataPromise[0][2];

      return {
        currentLotteryId: +currentLotteryId,
        maxNumberTicketsPerUser: 5000,
        status: +_lotteries.status,
        blockEnd: +_lotteries.blockEnd,
        blockStart: +_lotteries.blockStart,
        totalReward,
        finalNumber: +_lotteries.finalNumber,
        ticketHasBuy: +countTicket,
        isTicketFree: ticketFree[0],
      };
    }
  };

  const _data = useQuery({
    queryKey: ["useGetCurrentLotteryInfo"],
    queryFn: getData,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 0.5,
    refetchOnReconnect: true,
  });

  return _data;
};

export const useActionLottery = () => {
  const toast = useToast();
  const { refetch } = useGetCurrentLotteryInfo();

  const getInstance = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const contractStakingInstance = Lottery__factory.connect(
      contractAddress.lotteryV1,
      provider.getSigner()
    );

    return contractStakingInstance;
  };

  const buyTickets = useMutation(async (tickets: number[]) => {
    const instance = getInstance();

    try {
      const tx = await instance.buyTickets(tickets, {
        gasLimit: 40000000,
      });

      if (tx) {
        await tx?.wait();
        refetch();
      }
      return tx;
    } catch (e: any) {
      toast({
        description: "Transaction failed",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return handleError(e);
    }
  });

  const claimReward = useMutation(async (lotteryId: number) => {
    const instance = getInstance();

    try {
      const tx = await instance.claimReward(+lotteryId);
      if (tx) {
        await tx?.wait();
        refetch();
      }
      return tx;
    } catch (e: any) {
      toast({
        description: "Transaction failed",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return handleError(e);
    }
  });

  const claimFreeTicket = useMutation(async (tickets: number[]) => {
    const instance = getInstance();

    try {
      const tx = await instance.claimFreeTickets(tickets, {
        gasLimit: 2000000,
      });

      if (tx) {
        await tx?.wait();
        refetch();
      }
      return tx;
    } catch (e: any) {
      toast({
        description: "Transaction failed",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return handleError(e);
    }
  });

  return {
    buyTickets,
    claimReward,
    claimFreeTicket,
  };
};
