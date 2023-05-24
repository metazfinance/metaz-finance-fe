import { contractAddress } from "@/web3Config/contract";

import { useBalanceErc20 } from "@/web3Hook/useErc20";
import {
  useGetInfoStakeLpToken
} from "@/web3Hook/useStakeLpToken";
import { useGetAccount } from "@/web3Provider/hookStore/useGetProvider";
import {
  Box,
  Flex,
  SkeletonCircle,
  Text
} from "@chakra-ui/react";
import Image from "next/image";

const SCardLpPool = () => {
  const { isLoading, data: pool } = useGetInfoStakeLpToken(
    contractAddress.stakingLpTokenV1
  );

  const account = useGetAccount();
  const { balance } = useBalanceErc20(contractAddress.lpToken, account);

  if (isLoading) return <SkeletonCircle />;
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
              {/* <Text>Stake {symbol}</Text> */}
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

          {/* <SContentCardLpPool /> */}
        </Box>
      </Box>
    </Box>
  );
};

// const SContentCardLpPool = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const modalUnstake = useDisclosure();

//   const { isLoading, data: pool } = useGetInfoStakeLpToken(
//     contractAddress.stakingLpTokenV1
//   );
//   const { data } = useSigner();
//   const { address } = useAccount();

//   const { isApprove, isApproving, approve } = useApproveERC20(
//     contractAddress.stakingLpTokenV1 as IAddress,
//     contractAddress.lpToken as IAddress
//   );

//   const { claimReward } = useActionIOnLpPool(
//     contractAddress.stakingLpTokenV1 as IAddress,
//     data
//   );

//   if (isLoading) return <SkeletonCircle />;
//   if (!pool) return null;

//   const handleApprove = useCallback(async () => {
//     await approve();
//   }, [isApprove]);

//   const handleClaimToken = useCallback(async () => {
//     await claimReward.mutateAsync();
//   }, []);

//   const isStaked = useMemo(() => {
//     return +pool.yourStaked / 1e18 > 0;
//   }, [pool.yourStaked]);

//   return (
//     <Box>
//       <Box p={5}>
//         <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
//           <Box>Your Stake </Box>
//           <Box>{getBalanceLocalString(pool.yourStaked)}</Box>
//         </Flex>

//         <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
//           <Box>Your Reward</Box>
//           <Box>{getBalanceLocalString(pool.reward)}</Box>
//         </Flex>
//       </Box>

//       <Box p={5}>
//         {isStaked && (
//           <Flex justifyContent={"space-between"} alignItems="center">
//             <Box>
//               <Button
//                 colorScheme={"gray"}
//                 minW={170}
//                 onClick={modalUnstake.onOpen}
//               >
//                 Unstake
//               </Button>
//             </Box>
//             <Box>
//               {pool.reward > 0 && (
//                 <AppButton
//                   minW={170}
//                   colorScheme={"purple"}
//                   onClick={handleClaimToken}
//                   isLoading={claimReward.isLoading}
//                   disabled={claimReward.isLoading}
//                 >
//                   Claim
//                 </AppButton>
//               )}
//             </Box>
//           </Flex>
//         )}
//       </Box>

//       <Box p={5}>
//         {address ? (
//           <Box>
//             {isApprove ? (
//               <Flex gap={5}>
//                 <AppButton onClick={onOpen}>Stake</AppButton>
//               </Flex>
//             ) : (
//               <AppButton
//                 w={"100%"}
//                 mr={3}
//                 disabled={isApproving}
//                 isLoading={isApproving}
//                 onClick={handleApprove}
//               >
//                 Approve
//               </AppButton>
//             )}
//           </Box>
//         ) : (
//           <SConnectButton />
//         )}
//       </Box>

//       <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
//         <ModalStake poolContract={pool.contract} />
//       </Modal>

//       <Modal
//         blockScrollOnMount={false}
//         isOpen={modalUnstake.isOpen}
//         onClose={modalUnstake.onClose}
//       >
//         <ModalUnStake poolContract={pool.contract} />
//       </Modal>
//     </Box>
//   );
// };

// const ModalStake = ({ poolContract }: { poolContract: IAddress }) => {
//   const { data: signerData } = useSigner();
//   const { stake } = useActionIOnLpPool(poolContract, signerData);

//   const { isFetching, balance } = useBalanceErc20(contractAddress.lpToken);
//   const { symbol } = useBalanceToken(contractAddress.lpToken as IAddress);

//   const {
//     handleSubmit,
//     register,
//     formState: { errors, isSubmitting },
//     setValue,
//   } = useForm<{
//     amount: number;
//   }>({
//     defaultValues: {},
//   });

//   const onSubmit = async (formValues: { amount: number }) => {
//     await stake.mutateAsync(formValues.amount);
//   };

//   const hasEnoughFund = useMemo(() => {
//     return +balance > 0;
//   }, [balance]);

//   const isDisable = isSubmitting || stake.isLoading;
//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Box>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Stake in Pool</ModalHeader>
//           <ModalCloseButton />
//           <Divider />
//           <ModalBody pt={4}>
//             <Flex alignItems={"center"} justifyContent="space-between">
//               <Box>Stake:</Box>
//               <Flex
//                 alignItems={"center"}
//                 justifyContent="space-between"
//                 gap={2}
//               >
//                 <Image
//                   src="/assets/image/cake.svg"
//                   alt="CAKE"
//                   width={26}
//                   height={26}
//                 />
//                 <Text fontWeight={"bold"}>{symbol}</Text>
//               </Flex>
//             </Flex>

//             <Box>
//               <Box py={4}>
//                 <FormControl isInvalid={!!errors.amount}>
//                   <InputGroup>
//                     <InputLeftElement pointerEvents="none">
//                       <Image
//                         src="/assets/image/cake.svg"
//                         alt=""
//                         width={30}
//                         height={30}
//                       />
//                     </InputLeftElement>
//                     <Input
//                       disabled={isDisable || !hasEnoughFund}
//                       placeholder="0.0"
//                       {...register("amount", {
//                         required: "This is required",
//                         minLength: {
//                           value: 0.1,
//                           message: "Minimum length should be 0.1",
//                         },
//                       })}
//                     />
//                     <InputRightAddon
//                       onClick={() => setValue("amount", +balance / 1e18)}
//                     >
//                       Max
//                     </InputRightAddon>
//                   </InputGroup>

//                   <FormErrorMessage>
//                     {errors?.amount && errors?.amount?.message}
//                   </FormErrorMessage>
//                 </FormControl>
//               </Box>

//               <Text textAlign={"right"}>
//                 Balance:
//                 {isFetching ? (
//                   "Fetching..."
//                 ) : (
//                   <>{getBalanceLocalString(balance)}</>
//                 )}
//               </Text>
//             </Box>
//           </ModalBody>

//           <ModalFooter>
//             <AppButton
//               mr={3}
//               isDisabled={isDisable || !hasEnoughFund}
//               isLoading={isDisable}
//               type="submit"
//             >
//               Stake
//             </AppButton>
//           </ModalFooter>
//         </ModalContent>
//       </Box>
//     </form>
//   );
// };

// const ModalUnStake = ({ poolContract }: { poolContract: IAddress }) => {
//   const { data: pool } = useGetInfoStakeLpToken(
//     contractAddress.stakingLpTokenV1
//   );
//   const { symbol } = useBalanceToken(contractAddress.lpToken as IAddress);

//   const { data: signerData } = useSigner();
//   const { unStake } = useActionIOnLpPool(poolContract, signerData);
//   const { isFetching, balance } = useBalanceErc20();

//   const {
//     handleSubmit,
//     register,
//     formState: { errors, isSubmitting },
//     setValue,
//   } = useForm<{
//     amount: number;
//   }>({
//     defaultValues: {},
//     resolver: yupResolver(
//       yup.object().shape({
//         amount: yup
//           .string()
//           .required("Amount is not valid")
//           .test(
//             "amount",
//             "Amount should be greater than 0",
//             (value: any) => +value > 0
//           )
//           .test(
//             "amount",
//             "Amount should be less than balance",
//             (value: any) => +value > 0 && +value <= +balance
//           ),
//       })
//     ),
//   });

//   const onSubmit = async (formValues: { amount: number }) => {
//     console.log(formValues.amount, "amount");
//     await unStake.mutateAsync(+formValues.amount);
//   };

//   if (!pool) return null;
//   const isDisable = isSubmitting || unStake.isLoading;

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <Box>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Unstake in Pool</ModalHeader>
//           <ModalCloseButton />
//           <Divider />
//           <ModalBody pt={4}>
//             <Flex alignItems={"center"} justifyContent="space-between">
//               <Box>Stake:</Box>
//               <Flex
//                 alignItems={"center"}
//                 justifyContent="space-between"
//                 gap={2}
//               >
//                 <Image
//                   src="/assets/image/cake.svg"
//                   alt="CAKE"
//                   width={26}
//                   height={26}
//                 />
//                 <Text fontWeight={"bold"}>{symbol}</Text>
//               </Flex>
//             </Flex>

//             <Box>
//               <Box py={4}>
//                 <FormControl isInvalid={!!errors.amount}>
//                   <InputGroup>
//                     <InputLeftElement pointerEvents="none">
//                       <Image
//                         src="/assets/image/cake.svg"
//                         alt=""
//                         width={30}
//                         height={30}
//                       />
//                     </InputLeftElement>
//                     <Input
//                       disabled={isDisable}
//                       placeholder="0.0"
//                       {...register("amount")}
//                     />
//                     <InputRightAddon
//                       onClick={() =>
//                         setValue("amount", +pool?.yourStaked / 1e18)
//                       }
//                     >
//                       Max
//                     </InputRightAddon>
//                   </InputGroup>

//                   <FormErrorMessage>
//                     {errors?.amount && errors?.amount?.message}
//                   </FormErrorMessage>
//                 </FormControl>
//               </Box>

//               <Text textAlign={"right"}>
//                 Balance:
//                 {isFetching ? (
//                   "Fetching..."
//                 ) : (
//                   <>{getBalanceLocalString(balance)}</>
//                 )}
//               </Text>
//             </Box>
//           </ModalBody>

//           <ModalFooter>
//             <AppButton
//               mr={3}
//               disabled={isDisable || !!errors.amount}
//               isLoading={isDisable}
//               type="submit"
//             >
//               Unstake
//             </AppButton>
//           </ModalFooter>
//         </ModalContent>
//       </Box>
//     </form>
//   );
// };

export default SCardLpPool;
