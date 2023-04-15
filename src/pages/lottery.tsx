import { BallColor } from "@/components/BallSVG/Balls";
import ComingSoon from "@/components/ComingSoon";
import { parseRetrievedNumber } from "@/utils/helpers";
import { useLottery } from "@/web3Hook/useLottery";
import { random } from "lodash-es";
import { useEffect, useState } from "react";

export default function Lottery() {
  const colors: BallColor[] = [
    "pink",
    "lilac",
    "teal",
    "aqua",
    "green",
    "yellow",
  ];

  const [rotationValues, setRotationValues] = useState([]);

  const reversedNumber = parseRetrievedNumber("7678238");
  const numAsArray = reversedNumber.split("");

  useEffect(() => {
    if (numAsArray && rotationValues.length === 0) {
      setRotationValues(numAsArray.map(() => random(-30, 30)));
    }
  }, [numAsArray, rotationValues]);

  const { data } = useLottery();

  return <ComingSoon />;
  // return (
  //   <Box margin={"0 auto"} sx={{ background: "#FCDF79" }} p={0}>
  //     <Flex minH={500} justifyContent={"space-around"} alignItems={"center"}>
  //       <Box />
  //       <Box>
  //         <Text textAlign={"center"} fontSize={"3xl"} py={2} fontWeight="bold">
  //           Prize Pot
  //         </Text>

  //         <Box textAlign={"center"}>
  //           <Box>
  //             <Text fontSize={"3xl"} pb={2} fontWeight="bold">
  //               $ 7,562.14
  //             </Text>
  //             <Text fontSize={"3xl"} pb={2} fontWeight="bold">
  //               Next Draw 13h15m19s
  //             </Text>

  //             <Box>
  //               <AppButton w={200}>Buy Tickets</AppButton>
  //             </Box>
  //           </Box>
  //         </Box>
  //       </Box>
  //     </Flex>

  //     {/* <Box py={4}>
  //         <Text fontSize={"3xl"} pb={2} fontWeight="bold">
  //           Get your tickets now!
  //         </Text>

  //         <Flex alignItems={"end"} justifyContent={"center"} gap={1}>
  //           <Text fontSize={28} color={"#f0b90b"} fontWeight={"bold"}>
  //             20 h 60 m
  //           </Text>
  //           <Text> until the draw</Text>
  //         </Flex>

  //         <Box borderRadius={10} overflow={"hidden"} my={4}>
  //           <Box bg="#3b4155" p={4} color={"white"}>
  //             <Flex justifyContent={"space-between"} alignItems={"center"}>
  //               <Text>Next Draw</Text>
  //               <Text> #864 | Draw: Apr 10, 2023, 7:00 PM</Text>
  //             </Flex>
  //           </Box>

  //           <Box bg="#383241" p={4} color={"white"}>
  //             <Flex alignItems={"center"} gap={10}>
  //               <Text>Prize Pot</Text>
  //               <Box>
  //                 <Text as="h3" fontSize={32} fontWeight={"bold"}>
  //                   ~$72,875
  //                 </Text>
  //                 <Text>20.000 METAZ</Text>
  //               </Box>
  //             </Flex>

  //             <Flex alignItems={"center"} gap={10} mt={4}>
  //               <Text>Your tickets</Text>
  //               <Box>
  //                 <AppButton>Buy Tickets</AppButton>
  //               </Box>
  //             </Flex>
  //           </Box>
  //         </Box>
  //       </Box> */}

  //     <section>
  //       <Box
  //         py={4}
  //         bg="#F8BD9D"
  //         p={{
  //           base: 4,
  //           md: 10,
  //         }}
  //       >
  //         <Text fontSize={"3xl"} textAlign={"center"} pb={5} fontWeight="bold">
  //           Prize Pool History
  //         </Text>

  //         <Box
  //           borderRadius={10}
  //           overflow={"hidden"}
  //           my={4}
  //           p={4}
  //           maxW={{
  //             base: "100%",
  //             md: "80%",
  //           }}
  //           margin={"0 auto"}
  //           color={"#000"}
  //           sx={{
  //             background: "#FBE1D3",
  //           }}
  //         >
  //           <Box p={4}>
  //             <Flex gap={5} alignItems={"center"}>
  //               <Text>Round</Text>
  //               <Text>864</Text>
  //             </Flex>
  //             <Text textAlign={"left"}>Drawn Apr 9, 2023, 7:00 AM</Text>
  //           </Box>

  //           <Box m={3} borderRadius={7} bg="#383241" p={4} color={"white"}>
  //             <Flex alignItems={"center"} gap={10}>
  //               <Box>
  //                 <Text>Winning Number</Text>
  //                 <Text>
  //                   <Badge>Latest</Badge>
  //                 </Text>
  //               </Box>
  //               <Box>
  //                 <Flex justifyContent="space-between">
  //                   {numAsArray.map((num, index) => {
  //                     return (
  //                       <BallWithNumber
  //                         key={index}
  //                         rotationTransform={rotationValues[index]}
  //                         color={colors[index]}
  //                         number={num}
  //                       />
  //                     );
  //                   })}
  //                 </Flex>
  //               </Box>
  //             </Flex>
  //           </Box>

  //           <Box
  //             m={3}
  //             p={4}
  //             bg="white"
  //             color={"#000"}
  //             borderRadius={10}
  //             border="1px solid #F8BE9D"
  //           >
  //             <Box display={{ base: "none", md: "block" }}>
  //               <TableContainer>
  //                 <Table>
  //                   <Thead>
  //                     <Tr>
  //                       <Th>
  //                         <Text fontSize={12}>Prize Pot</Text>
  //                       </Th>
  //                       <Th>
  //                         <Text fontSize={"xl"} color="#F8BE9D">
  //                           $ 7,944.75
  //                         </Text>
  //                       </Th>
  //                       <Th textAlign={"left"} color="#F8BE9D">
  //                         <Text fontSize={12}>181,663.2368 PPI</Text>
  //                       </Th>
  //                       <Th textAlign={"right"}>
  //                         <Text fontSize={12}>
  //                           Total tickets this round: 137
  //                         </Text>
  //                         <Text>Total roll over: $7,448.2</Text>
  //                       </Th>
  //                       <Th />
  //                     </Tr>
  //                   </Thead>
  //                   <Tbody>
  //                     <Tr>
  //                       <Td>
  //                         <Text fontWeight={700}>Match First 1</Text>
  //                       </Td>
  //                       <Td>
  //                         <Text color="#4daf9e" fontWeight={700}>
  //                           4,541.5809 PPI
  //                         </Text>
  //                       </Td>
  //                       <Td textAlign={"left"}>
  //                         <Text color="gray.800">~$198.61</Text>
  //                       </Td>
  //                       <Td textAlign={"right"}>
  //                         <Text color="gray.800"> 378.465 PPI each</Text>
  //                       </Td>
  //                       <Td textAlign={"right"}>
  //                         <Text color="gray.800"> 0 Winning Tickets</Text>
  //                       </Td>
  //                     </Tr>
  //                   </Tbody>
  //                 </Table>
  //               </TableContainer>
  //             </Box>
  //           </Box>
  //         </Box>
  //       </Box>
  //     </section>
  //   </Box>
  // );
}
