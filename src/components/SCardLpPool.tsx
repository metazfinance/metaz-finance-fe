import { formatCurrency, getBalanceLocalString } from "@/utils/ultities";
import { SYMBOL } from "@/web3Config/contract";
import { useActionInfoValidator } from "@/web3Hook/useStakeCetToValidator";
import { useGetAccount } from "@/web3Provider/hookStore/useGetProvider";

import { useApproveERC20, useBalanceErc20 } from "@/web3Hook/useErc20";
import {
  BIG_AMOUNT_CHEAT,
  useActionStakeLpToken,
  useStakeLp,
} from "@/web3Hook/useStakeLp";
import {
  Avatar,
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
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import AppButton from "./AppButton";
import SConnectButton from "./SConnectButton";
import SCardSkeleton from "./SSkeleton/SCardSkeleton";

export const WrapperSCardLpPool = () => {
  const { isLoading, data: pools } = useStakeLp();

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
          <>
            {pools.map((pool, idx) => {
              return <SCardLpPool key={idx} pool={pool} />;
            })}
          </>
        )}
      </Flex>
    </Box>
  );
};

const SCardLpPool = ({ pool }: { pool: IPoolLpStake }) => {
  if (!pool) return <Text>Please connect wallet to see stake LP pool</Text>;
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
              <Text>Stake {pool.symbol_lp}</Text>
              <Text fontSize={13}>Stake, Earn – And more!</Text>
            </Box>
            <Box>
              <Avatar
                name={"M"}
                bg="transparent"
                color="#24cccd"
                border="1px"
                width={50}
                height={50}
              />
            </Box>
          </Flex>
          <Box p={5}>
            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
              <Box>Your Reward</Box>
              <Box>
                {+pool.reward > 0 ? getBalanceLocalString(pool.reward) : 0}{" "}
                {SYMBOL}
              </Box>
            </Flex>

            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
              <Box>Reward Estimation</Box>
              <Box>
                {`${formatCurrency(
                  (+pool.balanceStaked / +pool.LPtotalStaked) * 100
                )}`}{" "}
                {SYMBOL}
              </Box>
            </Flex>

            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
              <Box>Your Stake</Box>
              <Box>
                {+pool.balanceStaked > 0
                  ? getBalanceLocalString(pool.balanceStaked)
                  : 0}{" "}
                {pool.symbol_lp}
              </Box>
            </Flex>

            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
              <Box>Total staked</Box>
              <Box>
                {+pool.LPtotalStaked > 0
                  ? getBalanceLocalString(pool.LPtotalStaked)
                  : 0}{" "}
                {pool.symbol_lp}
              </Box>
            </Flex>

            <GroupAction pool={pool} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const GroupAction = ({ pool }: { pool: IPoolLpStake }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalUnstake = useDisclosure();

  const address = useGetAccount();

  const { balance } = useBalanceErc20(pool.contractLP, address);

  const { claimReward } = useActionInfoValidator();

  const hasEnoughFund = useMemo(() => {
    return +balance ? +balance > BIG_AMOUNT_CHEAT : false;
  }, [balance]);

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
                        isDisabled={pool.balanceStaked <= 0}
                        colorScheme={"purple"}
                        onClick={modalUnstake.onOpen}
                      >
                        Withdraw
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
                      isDisabled={pool.reward <= 0 || claimReward.isLoading}
                      onClick={async () => await claimReward.mutateAsync()}
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
                      disabled={!pool.isStakeable}
                      isDisabled={!hasEnoughFund}
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
      {pool && (
        <>
          <ModalStake isOpen={isOpen} onClose={onClose} pool={pool} />
          <ModalWithdraw
            pool={pool}
            isOpen={modalUnstake.isOpen}
            onClose={modalUnstake.onClose}
          />
        </>
      )}
    </>
  );
};

const ModalStake = ({
  isOpen,
  onClose,
  pool,
}: {
  isOpen: boolean;
  onClose: () => void;
  pool: IPoolLpStake;
}) => {
  const address = useGetAccount();
  const { isFetching, balance, symbol } = useBalanceErc20(
    pool.contractLP,
    address
  );
  const { isApprove, approve, isApproving } = useApproveERC20(
    pool.contract,
    pool.contractLP
  );

  const { stake } = useActionStakeLpToken(pool.contract);

  useEffect(() => {
    reset();
  }, [isOpen]);

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
            "Amount should be greater than 0",
            (value: any) => +value > 0
          ),
      })
    ),
  });

  const onSubmit = async (formValues: { amount: number }) => {
    await stake.mutateAsync(formValues.amount).then(onClose);
  };

  const hasEnoughFund = useMemo(() => {
    return balance ? +balance / 1e18 >= BIG_AMOUNT_CHEAT : false;
  }, [balance]);

  const isDisable = isSubmitting || stake.isLoading;
  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Stake LP-token in Pool</ModalHeader>
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
                  <Avatar
                    name="M"
                    bg="transparent"
                    color="#24cccd"
                    border="1px"
                    width={26}
                    height={26}
                  />

                  <Text fontWeight={"bold"}>{symbol}</Text>
                </Flex>
              </Flex>

              <Box>
                <Box py={4}>
                  <FormControl isInvalid={!!errors.amount}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Avatar
                          name="M"
                          bg="transparent"
                          color="#24cccd"
                          border="1px"
                          width={26}
                          height={26}
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
                            balance && +balance > BIG_AMOUNT_CHEAT
                              ? +balance / Math.pow(10, 18)
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
                  {isFetching ? (
                    "Fetching..."
                  ) : (
                    <>{getBalanceLocalString(balance)}</>
                  )}
                </Text>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Box>
                {isApprove ? (
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
                ) : (
                  <AppButton
                    w={"100%"}
                    mr={3}
                    disabled={isApproving}
                    isLoading={isApproving}
                    onClick={approve}
                  >
                    Approve
                  </AppButton>
                )}
              </Box>
            </ModalFooter>
          </ModalContent>
        </Box>
      </form>
    </Modal>
  );
};

const ModalWithdraw = ({
  isOpen,
  onClose,
  pool,
}: {
  isOpen: boolean;
  onClose: () => void;
  pool: IPoolLpStake;
}) => {
  const address = useGetAccount();
  const { isFetching, balance, symbol } = useBalanceErc20(
    pool.contractLP,
    address
  );

  const { isApprove, approve, isApproving } = useApproveERC20(
    pool.contract,
    pool.contractLP
  );

  const { withdrawLP } = useActionStakeLpToken(pool.contract);

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
            "Amount should be less than balance",
            (value: any) => +value <= pool.balanceStaked / Math.pow(10, 18)
          ),
      })
    ),
  });

  const onSubmit = async (formValues: { amount: number }) => {
    await withdrawLP.mutateAsync(formValues.amount).then(onClose);
  };

  const hasEnoughFund = useMemo(() => {
    return balance ? +balance / 1e18 >= BIG_AMOUNT_CHEAT : false;
  }, [balance]);

  const isDisable = isSubmitting || withdrawLP.isLoading;

  if (!pool) return null;
  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Withdraw LP-token in Pool</ModalHeader>
            <ModalCloseButton />
            <Divider />
            <ModalBody pt={4}>
              <Flex alignItems={"center"} justifyContent="space-between">
                <Box></Box>
                <Flex
                  alignItems={"center"}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Avatar
                    name="M"
                    bg="transparent"
                    color="#24cccd"
                    border="1px"
                    width={26}
                    height={26}
                  />

                  <Text fontWeight={"bold"}>{symbol}</Text>
                </Flex>
              </Flex>

              <Box>
                <Box py={4}>
                  <FormControl isInvalid={!!errors.amount}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Avatar
                          name="M"
                          bg="transparent"
                          color="#24cccd"
                          border="1px"
                          width={26}
                          height={26}
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
                        cursor={"pointer"}
                        onClick={() =>
                          setValue(
                            "amount",
                            pool.balanceStaked &&
                              pool.balanceStaked > BIG_AMOUNT_CHEAT
                              ? pool.balanceStaked / Math.pow(10, 18)
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
                  {isFetching ? (
                    "Fetching..."
                  ) : (
                    <>{getBalanceLocalString(pool.balanceStaked)}</>
                  )}
                </Text>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Box>
                {isApprove ? (
                  <Button
                    w={"100%"}
                    colorScheme="blue"
                    mr={3}
                    isDisabled={isDisable || !hasEnoughFund}
                    isLoading={isDisable}
                    type="submit"
                  >
                    Withdraw
                  </Button>
                ) : (
                  <AppButton
                    w={"100%"}
                    mr={3}
                    disabled={isApproving}
                    isLoading={isApproving}
                    onClick={approve}
                  >
                    Approve
                  </AppButton>
                )}
              </Box>
            </ModalFooter>
          </ModalContent>
        </Box>
      </form>
    </Modal>
  );
};

export default SCardLpPool;
