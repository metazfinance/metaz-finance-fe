import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../store";

export const useGetSinger = () => {
  return useAppSelector((state) => state.eth.signer);
};

export const useGetProvider = () => {
  return useAppSelector((state) => state.eth.provider);
};

export const useBalance = () => {
  const provider = useGetProvider();
  const address = useGetAccount();
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const getData = async () => {
      const _data = await provider.getBalance(address);
      setBalance(_data);
      return _data;
    };
    getData();
  }, [provider]);

  return balance;
};

export const useGetAccount = () => {
  return useAppSelector((state) => state.eth.account);
};
