import { contractAddress } from "@/web3Config/contract";
import { multicall } from "@/web3Config/multicall";
import { Lottery__factory } from "@/web3Config/type";
import {
  useGetAccount,
  useGetProvider,
  useGetSinger,
} from "@/web3Provider/hookStore/useGetProvider";
import { useQuery } from "react-query";

export const useLottery = () => {
  const address = useGetAccount();
  const provider = useGetProvider();
  const singer = useGetSinger();

  const contractLotteryInstance = Lottery__factory.connect(
    contractAddress.lotteryV1,
    singer || provider
  );

  const poolCalls = [
    {
      address: contractAddress.lotteryV1,
      name: "currentLotteryId",
    },
    {
      address: contractAddress.lotteryV1,
      name: "tier1_rate",
    },
    // {
    //   address: contractAddress.lotteryV1,
    //   name: "tier2_rate",
    // },
    // {
    //   address: contractAddress.lotteryV1,
    //   name: "tier3_rate",
    // },
    // {
    //   address: contractAddress.lotteryV1,
    //   name: "fee_rate",
    // },
    // {
    //   address: contractAddress.lotteryV1,
    //   name: "_lotteries",
    // },
    // {
    //   address: contractAddress.lotteryV1,
    //   name: "totalReward",
    // },
  ];
  const getData = async () => {
    // const _dataPromise = await Promise.all([
    //   multicall(contractLotteryInstance.interface, poolCalls, provider),
    // ]);
    console.log('abc')

    const currentLotteryId = await contractLotteryInstance.currentLotteryId();
    // eslint-disable-next-line no-console
    console.log({ currentLotteryId: +currentLotteryId }, "log");
    // const _data = _dataPromise.map((pool) => {
    //   return {
    //     currentLotteryId: pool[0],
    //     tier1_rate: pool[1],
    //     // tier2_rate: pool[2],
    //     // tier3_rate: pool[3],
    //     // fee_rate: pool[4],
    //     // _lotteries: pool[5],
    //     // totalReward: pool[6],
    //   };
    // });

    return [] || _data;
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
