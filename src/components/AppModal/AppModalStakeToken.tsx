import { getBalanceLocalString } from "@/utils/ultities";
import { SYMBOL } from "@/web3Config/contract";
import { useBalanceErc20 } from "@/web3Hook/useErc20";
import { useActionIOnPool } from "@/web3Hook/useStakeToken";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import AppButton from "../AppButton";

export const ModalStakeToken = ({
  maxPool,
  poolContract,
  onClose,
}: {
  maxPool: number;
  poolContract: IAddress;
  onClose: () => void;
}) => {
  const { stake } = useActionIOnPool(poolContract);

  const { isFetching, balance } = useBalanceErc20();

  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
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
            "Balance is not enough",
            (value: any) => +value <= +balance / 1e18
          )
          .test(
            "amount",
            "Pool limit exceeded",
            (value: any) => +value <= +maxPool / 1e18
          ),
      })
    ),
  });

  const onSubmit = async (formValues: { amount: number }) => {
    try {
      if (+formValues.amount > +balance / 1e18) {
        toast({
          status: "error",
          title: "Error",
          description: "Balance is not enough",
        });
      }
      await stake.mutateAsync(formValues.amount);
      onClose();
    } catch (e) {
      console.log(e, "e");
      toast({
        title: "Error",
        description: e.message,
      });
    }
  };

  const hasEnoughFund = useMemo(() => {
    return +balance > 0;
  }, [balance]);

  const isDisable = isSubmitting || stake.isLoading;

  return (
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
                  src="/assets/image/logo.png"
                alt="METAZ"
                  width={26}
                  height={26}
                />
                <Text fontWeight={"bold"}>{SYMBOL}</Text>
              </Flex>
            </Flex>

            <Box>
              <Box py={4}>
                <FormControl isInvalid={!!errors.amount}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Image
                        src="/assets/image/logo.png"
                      alt="METAZ"
                        width={26}
                        height={26}
                      />
                    </InputLeftElement>
                    <Input
                      disabled={isDisable || !hasEnoughFund}
                      placeholder="0.0"
                      {...register("amount")}
                    />
                    <InputRightAddon
                      onClick={() => setValue("amount", maxPool / 1e18)}
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
            <AppButton
              mr={3}
              isDisabled={isDisable || !hasEnoughFund}
              isLoading={isDisable}
              type="submit"
            >
              Stake
            </AppButton>
          </ModalFooter>
        </ModalContent>
      </Box>
    </form>
  );
};

export const ModalUnStakeToken = ({
  pool,
  poolContract,
  onClose,
}: {
  pool: IPool;
  poolContract: IAddress;
  onClose: () => void;
}) => {
  const { unStake } = useActionIOnPool(poolContract);
  const { isFetching, balance } = useBalanceErc20();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
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
          )
          .test(
            "amount",
            "Amount should be less than balance",
            (value: any) => +value <= +pool.amountClaimable / Math.pow(10, 18)
          ),
      })
    ),
  });

  const onSubmit = async (formValues: { amount: number }) => {
    await unStake.mutateAsync(+formValues.amount).then(onClose);
  };

  const isDisable = isSubmitting || unStake.isLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unstake in Pool</ModalHeader>
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
                  src="/assets/image/logo.png"
                alt="METAZ"
                  width={26}
                  height={26}
                />
                <Text fontWeight={"bold"}>{SYMBOL}</Text>
              </Flex>
            </Flex>

            <Box>
              <Box py={4}>
                <FormControl isInvalid={!!errors.amount}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Image
                        src="/assets/image/logo.png"
                      alt="METAZ"
                        width={26}
                        height={26}
                      />
                    </InputLeftElement>
                    <Input
                      disabled={isDisable}
                      placeholder="0.0"
                      {...register("amount")}
                    />
                    <InputRightAddon
                      onClick={() =>
                        setValue(
                          "amount",
                          +pool.amountClaimable / Math.pow(10, 18)
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
            <AppButton
              mr={3}
              disabled={isDisable || !!errors.amount}
              isLoading={isDisable}
              type="submit"
            >
              Unstake
            </AppButton>
          </ModalFooter>
        </ModalContent>
      </Box>
    </form>
  );
};
