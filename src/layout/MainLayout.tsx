import SNavbar from "@/components/Navbar";
import SHeader from "@/components/SHeader";
import { CHAIN_ID } from "@/web3Config/contract";
import { handleChainId } from "@/web3Config/switchNetwork";
import { useCheckValidNetwork } from "@/web3Hook/useCheckValidNetwork";
import { updateSigner } from "@/web3Provider/etherSlice";
import { useGetAccount } from "@/web3Provider/hookStore/useGetProvider";
import { useAppDispatch } from "@/web3Provider/store";
import { Box, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect } from "react";
import { useIsClient } from "usehooks-ts";

declare global {
  interface Window {
    ethereum: any;
  }
}

const MainLayout = ({ children }: TChildren) => {
  const dispatch = useAppDispatch();

  const isClient = useIsClient();

  useEffect(() => {
    if (isClient && typeof window.ethereum != "undefined") {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const chainId = window.ethereum.chainId;
      if (chainId !== +CHAIN_ID) {
        handleChainId(CHAIN_ID);
        return;
      }
      if (provider) {
        const _singer = provider.getSigner();
        dispatch(updateSigner(_singer));
      }
    }
  }, [isClient]);

  const address = useGetAccount();
  const { isValid } = useCheckValidNetwork();

  return (
    <Box>
      <SNavbar />

      {address && isValid ? (
        <Box>{children}</Box>
      ) : (
        <Box>
          <Text textAlign={"center"} py={4}>
            Please connect metamask
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default MainLayout;
