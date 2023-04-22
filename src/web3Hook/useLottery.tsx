import { handleError } from "@/utils/ultities";
import { contractAddress } from "@/web3Config/contract";
import { multicall } from "@/web3Config/multicall";
import { Lottery__factory } from "@/web3Config/type";
import {
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
      totalReward: _dataPromise[0][1],
    };

    return _data as {
      leaderBoardList: string[];
      // totalReward: string;
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
  const getLotteryInfo = async (lotteryId) => {
    const contractLotteryInstance = Lottery__factory.connect(
      contractAddress.lotteryV1,
      singer || provider
    );

    const _lotteryInfo = await contractLotteryInstance._lotteries(+lotteryId);
    return _lotteryInfo;
  };

  return {
    getLotteryInfo,
  };
};

export const useGetCurrentLotteryInfo = () => {
  const provider = useGetProvider();
  const singer = useGetSinger();

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
    const contractLotteryInstance = Lottery__factory.connect(
      contractAddress.lotteryV1,
      singer || provider
    );

    const _dataPromise = await Promise.all([
      multicall(contractLotteryInstance.interface, lotteryCalls, provider),
    ]);

    const currentLotteryId = +_dataPromise[0][0];
    const totalReward = +_dataPromise[0][1];

    const res = await contractLotteryInstance._lotteries(+currentLotteryId);
    const blockTimeEnd = await provider.getBlock(+res.blockEnd);
    return {
      currentLotteryId,
      status: +res.status,
      blockEnd: +res.blockEnd,
      blockTimeEnd: +blockTimeEnd.timestamp,
      blockStart: +res.blockStart,
      totalReward: +totalReward,
      finalNumber: +res.finalNumber,
    };
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

  const provider = new ethers.providers.Web3Provider(window.ethereum as any);

  const contractLotteryInstance = Lottery__factory.connect(
    contractAddress.lotteryV1,
    provider.getSigner()
  );

  const buyTickets = useMutation(async (tickets: number[]) => {
    const contractRewardInstance = contractLotteryInstance.connect(
      contractAddress.lotteryV1,
      provider.getSigner()
    );

    try {
      const tx = await contractRewardInstance.buyTickets(tickets);
      if (tx) {
        await tx?.wait();
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
    buyTickets,
  };
};
