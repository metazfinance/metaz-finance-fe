import { ellipseAddress, getBalanceLocalString } from "@/utils/ultities";
import { CHAIN_ID } from "@/web3Config/contract";
import { handleChainId, switchChainMetaMask } from "@/web3Config/switchNetwork";
import { useCheckValidNetwork } from "@/web3Hook/useCheckValidNetwork";
import { updateAccount } from "@/web3Provider/etherSlice";
import {
  useBalance,
  useGetAccount,
} from "@/web3Provider/hookStore/useGetProvider";
import { useAppDispatch } from "@/web3Provider/store";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useIsClient } from "usehooks-ts";
import AppButton from "./AppButton";

const Profile = ({ connectWallet }: any) => {
  const balance = useBalance();
  const address = useGetAccount();
  const isClient = useIsClient();
  const { isValid, onCheckValidNetwork } = useCheckValidNetwork();

  const dispatch = useAppDispatch();
  const onDisconnect = () => {
    if (isClient && window?.ethereum) {
      dispatch(updateAccount(""));
    }
  };

  const onSwitchNetwork = async () => {
    await switchChainMetaMask(ethers.BigNumber.from(CHAIN_ID).toHexString());
    onCheckValidNetwork();
  };

  return (
    <Box>
      {isValid ? (
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Flex gap={4} fontSize={14}>
              <Box>{balance && getBalanceLocalString(balance)} CET</Box>
              <Box>{ellipseAddress(address)}</Box>
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onDisconnect}>Disconnect</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <>
          <AppButton
            onClick={onSwitchNetwork}
            bg="red"
            _hover={{
              bg: "red.500",
            }}
          >
            Wrong network
          </AppButton>
        </>
      )}
    </Box>
  );
};

const SConnectButton = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [walletAddress, setWalletAddress] = useState("");

  const dispatch = useAppDispatch();
  const address = useGetAccount();
  const { isValid, onCheckValidNetwork, setIsValid } = useCheckValidNetwork();

  useEffect(() => {
    connectWallet();
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress, window.ethereum, window.ethereum?.chainId]);

  // const networkChanged = async () => {
  //   try {
  //     if (!window.ethereum) throw new Error("No crypto wallet found");
  //     const chain = +BigNumber.from(window?.ethereum?.chainId || 0);
  //     if (+chain == +CHAIN_ID) return;
  //     await window.ethereum.request({
  //       method: "wallet_addEthereumChain",
  //       params: [
  //         {
  //           id: 1,
  //           jsonrpc: "2.0",
  //           method: "wallet_addEthereumChain",
  //           params: [
  //             {
  //               chainId: `0x${Number(CHAIN_ID).toString(16)}`,
  //               chainName: "Coinex",
  //               rpcUrls: ["https://rpc.coinex.net"],
  //               nativeCurrency: {
  //                 name: "CET",
  //                 symbol: "CET",
  //                 decimals: 18,
  //               },
  //               blockExplorerUrls: ["https://www.coinex.net"],
  //             },
  //           ],
  //         },
  //       ],
  //     });
  //   } catch (err) {}
  // };

  // useEffect(() => {
  //   window.ethereum.on("chainChanged", networkChanged);
  //   return () => {
  //     window.ethereum.removeListener("chainChanged", networkChanged);
  //   };
  // }, []);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        if ("chainId" in window?.ethereum) {
          const chain = +BigNumber.from(window?.ethereum?.chainId || 0);
          await handleChainId(+chain);
        }

        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(account);
        dispatch(updateAccount(account));
      } catch (err: any) {}
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          dispatch(updateAccount(accounts[0]));
        }
      } catch (err: any) {}
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window?.ethereum?.on("accountsChanged", (accounts: any) => {
        setWalletAddress(accounts[0]);
        dispatch(updateAccount(accounts[0]));
      });
      // network chain
      window?.ethereum?.on("chainChanged", async (chainId: any) => {
        window.location.reload();
      });
    } else {
      setWalletAddress("");
    }
  };

  return (
    <Box width={"100%"}>
      {address ? (
        <Box>
          <Profile connectWallet={connectWallet} />
        </Box>
      ) : (
        <Box>
          <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <Box>
              <ModalOverlay />
              <ModalContent p={4}>
                {[
                  {
                    id: "metaMask",
                    name: "MetaMask",
                  },
                ].map((connector) => {
                  return (
                    <Button
                      p={10}
                      my={2}
                      key={connector.id}
                      onClick={() => connectWallet()}
                    >
                      {connector.id == "metaMask" ? (
                        <Image
                          src={"/assets/metamask.png"}
                          alt={connector.name}
                          width={37}
                          height={37}
                        />
                      ) : (
                        <Image
                          src={"/assets/wallet-connect.png"}
                          alt={connector.name}
                          width={37}
                          height={37}
                        />
                      )}
                      <Text pl={2}>{connector.name}</Text>
                    </Button>
                  );
                })}
              </ModalContent>
            </Box>
          </Modal>
          <AppButton onClick={onOpen}>Connect wallet</AppButton>
        </Box>
      )}
    </Box>
  );
};

export default SConnectButton;
