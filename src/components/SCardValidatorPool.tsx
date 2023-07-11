import { beautifulNumber, getBalanceLocalString } from "@/utils/ultities";
import { contractAddress } from "@/web3Config/contract";
import {
  useActionInfoValidator,
  useInfoValidator,
} from "@/web3Hook/useStakeCetToValidator";
import {
  useBalance,
  useGetAccount,
  useGetSinger,
} from "@/web3Provider/hookStore/useGetProvider";

import {
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import AppButton from "./AppButton";
import SConnectButton from "./SConnectButton";
import SCardSkeleton from "./SSkeleton/SCardSkeleton";

export const WrapperCardValidatorPool = () => {
  const { isLoading, data: pool } = useInfoValidator();

  return (
    <Box>
      <Flex
        display={{
          md: "flex",
          base: "block",
        }}
        justifyContent={"center"}
        gap={10}
      >
        {isLoading ? (
          <SCardSkeleton length={1} />
        ) : (
          <SCardValidatorPool pool={pool as any} />
        )}
      </Flex>
    </Box>
  );
};

const SCardValidatorPool = ({ pool }: { pool: IPoolValidatorStake }) => {
  if (!pool) return <Text>Please connect wallet to see validator pool</Text>;
  return (
    <Box>
      <Box
        minW={{
          base: 300,
          md: 420,
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
              <Text>Stake CET</Text>
              <Text fontSize={13}>Stake, Earn – And more!</Text>
            </Box>
            <Box>
              <Image
                src="/assets/image/cet.png"
                alt="METAZ"
                width={50}
                height={50}
              />
            </Box>
          </Flex>
          <Box p={5}>
            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
              <Box>Validator</Box>
              <Box>METAZ Finance</Box>
            </Flex>
            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
              <Box>Your Reward</Box>
              <Box>
                {+pool.totalReward > 0
                  ? getBalanceLocalString(pool.totalReward)
                  : 0}
              </Box>
            </Flex>

            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
              <Box>Your Stake</Box>
              <Box>
                {+pool.totalStakedByAccount > 0
                  ? getBalanceLocalString(pool.totalStakedByAccount)
                  : 0}
              </Box>
            </Flex>

            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
              <Box>Total Staking</Box>
              <Box>
                {+pool.totalStaking > 0
                  ? beautifulNumber(+pool.totalStaking / 1e18)
                  : 0}
              </Box>
            </Flex>

            <GroupAction />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SCardValidatorPool;

const GroupAction = () => {
  const { data: pool } = useInfoValidator();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalUnstake = useDisclosure();

  const address = useGetAccount();

  const nativeBalance = useBalance();

  const { claimReward, withdrawTokenStake } = useActionInfoValidator();

  const handleClaimToken = useCallback(async () => {
    await claimReward.mutateAsync();
  }, [claimReward]);

  const handleWithdraw = useCallback(async () => {
    await withdrawTokenStake.mutateAsync();
  }, [withdrawTokenStake]);

  const hasEnoughFund = useMemo(() => {
    return +nativeBalance ? +nativeBalance >= 1000 : false;
  }, [nativeBalance]);

  if (!pool) return null;

  return (
    <>
      <Box p={5}>
        {address ? (
          <>
            {pool && (
              <Box>
                <Flex
                  justifyContent={"space-between"}
                  alignItems="center"
                  gap={2}
                >
                  <Flex gap={5}>
                    <Box>
                      <Button
                        minW={{
                          base: 110,
                          md: 170,
                        }}
                        mt={2}
                        w="100%"
                        isDisabled={!pool.isStaking || !pool.hasUnstake}
                        colorScheme={"purple"}
                        onClick={modalUnstake.onOpen}
                      >
                        Unstake
                      </Button>
                    </Box>
                  </Flex>

                  <Box>
                    <Button
                      minW={{
                        base: 110,
                        md: 170,
                      }}
                      mt={2}
                      w="100%"
                      colorScheme={"blue"}
                      isLoading={claimReward.isLoading}
                      isDisabled={!pool.hasClaimable || claimReward.isLoading}
                      onClick={handleClaimToken}
                    >
                      Claim reward
                    </Button>
                  </Box>
                </Flex>
                <Box mt={4}>
                  <Flex gap={5}>
                    <Button
                      w="100%"
                      colorScheme={"blue"}
                      onClick={onOpen}
                      isDisabled={!pool.hasStaking || !hasEnoughFund}
                    >
                      Stake
                    </Button>
                  </Flex>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <SConnectButton />
        )}
      </Box>

      <Box>
        {pool.isShowWithdraw && (
          <Box px={5} pb={4}>
            <AppButton
              w="100%"
              isLoading={withdrawTokenStake.isLoading}
              isDisabled={
                withdrawTokenStake.isLoading || pool.isWaitingWithdraw
              }
              onClick={handleWithdraw}
            >
              Withdraw
            </AppButton>
          </Box>
        )}
      </Box>

      <ModalStake isOpen={isOpen} onClose={onClose} />
      <ModalUnstake
        poolContract={contractAddress.rewardContractStakeValidator as IAddress}
        isOpen={modalUnstake.isOpen}
        onClose={modalUnstake.onClose}
      />
    </>
  );
};

const ModalStake = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const nativeBalance = useBalance();

  const { stake } = useActionInfoValidator();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<{
    amount: number;
  }>({
    defaultValues: {},
    resolver: yupResolver(
      yup.object().shape({
        amount: yup
          .string()
          .required("Amount is not valid")
          .test(
            "amount",
            "Amount should be greater than 1000CET",
            (value: any) => +value >= 1000
          ),
      })
    ),
  });

  const onSubmit = async (formValues: { amount: number }) => {
    await stake.mutateAsync(formValues.amount).then(onClose);
  };

  const hasEnoughFund = useMemo(() => {
    return nativeBalance ? +nativeBalance >= 1000 : false;
  }, [nativeBalance]);

  const isDisable = isSubmitting || stake.isLoading;
  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Stake in Pool</ModalHeader>
            <ModalCloseButton />
            <Divider />
            <ModalBody pt={4}>
              <Flex alignItems={"center"} justifyContent="space-between">
                <Box>Stake:</Box>
                <Flex
                  alignItems={"center"}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Image
                    src="/assets/image/cet.png"
                    alt={"CET"}
                    width={26}
                    height={26}
                  />
                  <Text fontWeight={"bold"}>CET</Text>
                </Flex>
              </Flex>

              <Box>
                <Box py={4}>
                  <FormControl isInvalid={!!errors.amount}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Image
                          src="/assets/image/cet.png"
                          alt=""
                          width={30}
                          height={30}
                        />
                      </InputLeftElement>
                      <Input
                        disabled={isDisable || !hasEnoughFund}
                        placeholder="0.0"
                        {...register("amount", {
                          required: "This is required",
                          minLength: {
                            value: 0.1,
                            message: "Minimum length should be 0.1",
                          },
                        })}
                      />
                      <InputRightAddon
                        onClick={() =>
                          setValue(
                            "amount",
                            nativeBalance
                              ? +nativeBalance / Math.pow(10, 18)
                              : 0
                          )
                        }
                      >
                        Max
                      </InputRightAddon>
                    </InputGroup>

                    <FormErrorMessage>
                      {errors?.amount && errors?.amount?.message}
                    </FormErrorMessage>
                  </FormControl>
                </Box>

                <Text textAlign={"right"}>
                  Balance:
                  {getBalanceLocalString(nativeBalance)}
                </Text>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button
                w={"100%"}
                colorScheme="blue"
                mr={3}
                isDisabled={isDisable || !hasEnoughFund}
                isLoading={isDisable}
                type="submit"
              >
                Stake
              </Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </form>
    </Modal>
  );
};

const ModalUnstake = ({
  isOpen,
  onClose,
}: {
  poolContract: IAddress;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { unStake } = useActionInfoValidator();

  const handleUnstake = useCallback(async () => {
    await unStake.mutateAsync().then(onClose);
  }, []);

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Unstake in Pool
          </AlertDialogHeader>

          <AlertDialogBody>
            After 72 hours, you can claim your stake .
            <br />
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <AppButton
              onClick={handleUnstake}
              ml={3}
              isDisabled={unStake.isLoading}
              isLoading={unStake.isLoading}
            >
              Unstake
            </AppButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </Modal>
  );
};
