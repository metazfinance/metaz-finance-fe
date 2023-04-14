import { getBalanceLocalString } from "@/utils/ultities";
import { SYMBOL } from "@/web3Config/contract";
import { useApproveERC20 } from "@/web3Hook/useErc20";
import { useActionIOnPool } from "@/web3Hook/useStakeToken";
import { onInitProvider } from "@/web3Provider/etherSlice";
import { useGetAccount } from "@/web3Provider/hookStore/useGetProvider";
import {
  Box,
  Button,
  Flex,
  Modal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import AppButton from "./AppButton";
import {
  ModalStakeToken,
  ModalUnStakeToken,
} from "./AppModal/AppModalStakeToken";
import SConnectButton from "./SConnectButton";

export const WrapperSCardPool = ({ pool }: { pool: IPool }) => {
  if (!pool) return null;

  return (
    <Box>
      <Box
        minW={{
          base: "100%",
          md: 400,
        }}
        mb={10}
      >
        <Box border="0.2em solid #24cccd" borderRadius={8} overflow="hidden">
          <Flex
            p={5}
            justifyContent={"space-between"}
            alignItems="center"
            background={"green.800"}
          >
            <Box>
              <Text>Stake {SYMBOL}</Text>
              <Text fontSize={13}>Stake, Earn – And more!</Text>
            </Box>
            <Box>
              <Image
                src="/assets/image/logo.png"
                alt="CAKE"
                width={50}
                height={50}
              />
            </Box>
          </Flex>

          <SContentCard pool={pool} />
        </Box>
      </Box>
    </Box>
  );
};

export const SContentCard = ({ pool }: { pool: IPool }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalUnstake = useDisclosure();
  const { isApprove, isApproving, approve } = useApproveERC20(pool.contract);
  const address = useGetAccount();

  const { claimReward } = useActionIOnPool(pool.contract);

  const handleApprove = useCallback(async () => {
    await approve();
  }, [isApprove]);

  const handleClaimToken = useCallback(async () => {
    await claimReward.mutateAsync();
  }, []);

  const isDisabledStake = useMemo(() => {
    return +pool.totalStaked / 1e18 == +pool.limit / 1e18;
  }, [pool.totalStaked, pool.limit]);

  const isStaked = useMemo(() => {
    return +pool.totalStakedByAccount / 1e18 > 0;
  }, [pool.totalStakedByAccount]);

  return (
    <Box>
      <Box p={5}>
        <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
          <Box>APY</Box>
          <Box>{pool.apy}%</Box>
        </Flex>

        <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
          <Box>Earn</Box>
          <Box>{SYMBOL}</Box>
        </Flex>

        <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
          <Box>Limit</Box>
          <Box>{pool.limit}</Box>
        </Flex>

        <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
          <Box>Total staked</Box>
          <Box>
            {+pool.totalStaked > 0
              ? getBalanceLocalString(pool.totalStaked)
              : 0}
          </Box>
        </Flex>

        <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
          <Box>End In</Box>
          <Box>
            {pool.endIn}
            {/* {dayjs(Date.now() + pool.lockTime).format("DD/MM/YYYY")} */}
          </Box>
        </Flex>

        <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
          <Box>Your Reward</Box>
          <Box>{(pool.totalReward / 1e18).toFixed(2)}</Box>
        </Flex>

        <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
          <Box>Your Stake</Box>
          <Box>
            {+pool.totalStakedByAccount > 0
              ? getBalanceLocalString(pool.totalStakedByAccount)
              : 0}
          </Box>
        </Flex>
      </Box>

      <Box p={5}>
        <Flex justifyContent={"space-between"} alignItems="center" gap={2}>
          <Box>
            <Button
              colorScheme={"gray"}
              minW={{
                base: 110,
                md: 170,
              }}
              isDisabled={!isStaked}
              onClick={modalUnstake.onOpen}
            >
              Unstake
            </Button>
          </Box>
          <Box>
            <AppButton
              minW={{
                base: 110,
                md: 170,
              }}
              colorScheme={"purple"}
              onClick={handleClaimToken}
              isLoading={claimReward.isLoading}
              isDisabled={+pool.totalReward <= 0 || claimReward.isLoading}
            >
              Claim
            </AppButton>
          </Box>
        </Flex>
      </Box>

      <Box p={5}>
        {address ? (
          <Box>
            {isApprove ? (
              <Flex gap={5}>
                {pool.isOpenStake ? (
                  <AppButton isDisabled={isDisabledStake} onClick={onOpen}>
                    Stake
                  </AppButton>
                ) : (
                  <AppButton isDisabled={true}>Wait for opening</AppButton>
                )}
              </Flex>
            ) : (
              <AppButton
                w={"100%"}
                mr={3}
                disabled={isApproving}
                isLoading={isApproving}
                onClick={handleApprove}
              >
                Approve
              </AppButton>
            )}
          </Box>
        ) : (
          <SConnectButton />
        )}
      </Box>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalStakeToken
          maxPool={pool.maxStake}
          poolContract={pool.contract}
          onClose={onClose}
        />
      </Modal>

      <Modal
        blockScrollOnMount={false}
        isOpen={modalUnstake.isOpen}
        onClose={modalUnstake.onClose}
      >
        <ModalUnStakeToken
          pool={pool}
          poolContract={pool.contract}
          onClose={modalUnstake.onClose}
        />
      </Modal>
    </Box>
  );
};
