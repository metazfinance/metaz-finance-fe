import { SYMBOL } from "@/web3Config/contract";
import { LpStaking__factory } from "@/web3Config/type";
import {
  useGetAccount,
  useGetProvider,
  useGetSinger,
} from "@/web3Provider/hookStore/useGetProvider";
import { useQuery } from "react-query";

export const useGetInfoStakeLpToken = (contractAddress: string | IAddress) => {
  const address = useGetAccount();
  const provider = useGetProvider();
  const signer = useGetSinger();

  const contractInstance = LpStaking__factory.connect(
    contractAddress,
    signer || provider
  );

  const getDataPool = async () => {
    const getLPstakedBalance = async () => {
      if (contractInstance && address) {
        const _data = await contractInstance.LPstakedBalance(address);
        return _data;
      }
      return null;
    };

    const getReward = async () => {
      if (address && contractInstance) {
        const _data = await contractInstance.reward(address);
        return _data;
      }
      return null;
    };

    const _data = await Promise.all([getLPstakedBalance(), getReward()]);
    return _data;
  };

  const getInfoPool = async () => {
    const pool = await getDataPool();
    return {
      contract: contractAddress,
      yourStaked: pool[0],
      reward: pool[1],
      daily: `100 ${SYMBOL}`,
    } as IPoolLpStake;
  };

  const _data = useQuery({
    queryKey: "getInfoPool-stakeLP token",
    queryFn: async () => {
      const _data = await getInfoPool();
      return _data;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
  return _data;
};
