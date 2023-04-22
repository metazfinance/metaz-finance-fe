import { getBalanceLocalString } from "@/utils/ultities";
import { SYMBOL, contractAddress } from "@/web3Config/contract";
import { useApproveERC20, useBalanceErc20 } from "@/web3Hook/useErc20";
import {
  Badge,
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
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import AppButton from "../AppButton";
import { useActionLottery } from "@/web3Hook/useLottery";

export const AppModalBuyTicket = ({ onClose }: { onClose: () => void }) => {
  const { isFetching, balance } = useBalanceErc20();

  const { buyTickets } = useActionLottery();
  const { isApprove, isApproving, approve } = useApproveERC20(
    contractAddress.lotteryV1,
    contractAddress.ERC20_LOTTERY
  );

  const handleApprove = useCallback(async () => {
    await approve();
  }, [isApprove]);

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
    // resolver: {},
  });

  const onSubmit = async (formValues: { amount: number }) => {
    const ticketNumbers = [123, 456, 789];
    try {
      await buyTickets.mutateAsync(ticketNumbers);
      toast({
        title: "Success",
        description: "Buy ticket success",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {}
  };

  const hasEnoughFund = useMemo(() => {
    return +balance > 0;
  }, [balance]);

  const isDisable = isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Buy Tickets</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody pt={4}>
            <Box
              sx={{
                border: "1px solid #E2E8F0",
                padding: 5,
                borderRadius: 5,
                background: "orange.900",
              }}
            >
              <Flex alignItems={"center"} justifyContent="space-between">
                <Box>Cost</Box>
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
                  <Flex alignItems={"center"} gap={2}>
                    <FormControl isInvalid={!!errors.amount}>
                      <InputGroup
                        borderColor={"none"}
                        _active={{
                          borderColor: "none",
                        }}
                      >
                        <Input
                          variant="unstyled"
                          border={"none"}
                          placeholder="0.0"
                          {...register("amount")}
                        />
                      </InputGroup>

                      <FormErrorMessage>
                        {errors?.amount && errors?.amount?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <Box>Tickets</Box>
                    <Badge
                      background={"green"}
                      color={"white"}
                      px={2}
                      py={1}
                      borderRadius={5}
                    >
                      Max
                    </Badge>
                  </Flex>
                </Box>
              </Box>
            </Box>

            <Box py={2}>Max of 10 tickets per purchase</Box>

            <Box
              sx={{
                border: "1px solid #E2E8F0",
                padding: 5,
                borderRadius: 5,
                background: "orange.900",
              }}
            >
              <Flex alignItems={"center"} justifyContent="space-between">
                <Box>Cost ({SYMBOL} )</Box>
                <Flex
                  alignItems={"center"}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Text fontSize={12}>-{SYMBOL}</Text>
                </Flex>
              </Flex>

              <Flex py={3} alignItems={"center"} justifyContent="space-between">
                <Box>-% Bulk discount</Box>
                <Flex
                  alignItems={"center"}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Text fontSize={12}>-{SYMBOL}</Text>
                </Flex>
              </Flex>

              <Flex
                borderTop={"1px dashed"}
                borderColor={"green.900"}
                py={3}
                alignItems={"center"}
                justifyContent="space-between"
              >
                <Box>You Pay</Box>
                <Flex
                  alignItems={"center"}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Text fontSize={12}>-{SYMBOL}</Text>
                </Flex>
              </Flex>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Box>
              {isApprove ? (
                <AppButton
                  mr={3}
                  // isDisabled={isDisable || !hasEnoughFund}
                  // isLoading={isDisable}
                  type="submit"
                >
                  Buy tickes
                </AppButton>
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
          </ModalFooter>
        </ModalContent>
      </Box>
    </form>
  );
};
