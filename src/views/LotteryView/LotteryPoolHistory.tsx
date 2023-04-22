import { BallColor, BallWithNumber } from "@/components/BallSVG/Balls";
import { parseRetrievedNumber } from "@/utils/helpers";
import {
  useGetCurrentLotteryInfo,
  useGetLotteryInfo,
  useLottery,
} from "@/web3Hook/useLottery";
import { useGetProvider } from "@/web3Provider/hookStore/useGetProvider";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

import {
  Badge,
  Box,
  Button,
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { random } from "lodash-es";
import { useEffect, useMemo, useState } from "react";

export default function LotteryPoolHistory() {
  const provider = useGetProvider();
  const { data } = useLottery();
  const { data: _lastLottery } = useGetCurrentLotteryInfo();
  const { getLotteryInfo } = useGetLotteryInfo();

  const [lotteryInfo, setLotteryInfo] = useState<any>();
  const [currentId, setCurrentId] = useState(+data?.currentLotteryId);
  const [timeStart, setTimeStart] = useState();
  // const [timeBuy, setTimeBuy] = useState();
  const [timeEnd, setTimeEnd] = useState();

  const [isLoading, setLoading] = useState(false);

  useMemo(() => {
    setCurrentId(+data?.currentLotteryId);
  }, [data?.currentLotteryId]);

  const getLotteryInfoById = async (currentId: number) => {
    setLoading(true);

    const res = await getLotteryInfo(currentId);
    //   enum Status {
    //     Pending,
    //     Open,
    //     Claimable
    // }

    setLotteryInfo({
      currentLotteryId: currentId,
      status: +res.status,
      blockEnd: +res.blockEnd,
      blockStart: +res.blockStart,
      totalReward: +res.totalReward,
      finalNumber: +res.finalNumber,
    });

    setLoading(false);

    if (!res?.blockStart) return;
    const block = await provider.getBlock(+res.blockStart);
    const blockTimeEnd = await provider.getBlock(+res.blockEnd);
    setTimeStart(block?.timestamp);
    setTimeEnd(blockTimeEnd?.timestamp);
  };

  useEffect(() => {
    if (!currentId) return;
    getLotteryInfoById(currentId);
  }, [currentId]);

  const handleBack = () => {
    if (currentId === 1) return;
    setCurrentId(currentId - 1);
  };

  const handleNext = () => {
    if (currentId === +data?.currentLotteryId) return;
    setCurrentId(currentId + 1);
  };

  // eslint-disable-next-line no-console
  console.log(isLoading, "isLoading");

  return (
    <section>
      <Box
        py={4}
        bg="#F8BD9D"
        p={{
          base: 4,
          md: 10,
        }}
      >
        <Text fontSize={"3xl"} textAlign={"center"} pb={5} fontWeight="bold">
          Prize Pool History
        </Text>

        <Box
          borderRadius={10}
          overflow={"hidden"}
          my={4}
          p={4}
          maxW={{
            base: "100%",
            md: "80%",
          }}
          margin={"0 auto"}
          color={"#000"}
          sx={{
            background: "#FBE1D3",
          }}
        >
          <Box>
            <Skeleton isLoaded={!isLoading}>
              <Flex justifyContent={"space-between"} p={4}>
                <Box>
                  <Flex gap={5} alignItems={"center"}>
                    <Text>Round</Text>
                    <Badge>{lotteryInfo?.currentLotteryId}</Badge>
                  </Flex>
                  <Text textAlign={"left"}>
                    {dayjs.unix(timeEnd).format("MMMM DD, YYYY HH:mm:ss")}
                  </Text>
                </Box>
                <Box>
                  <Flex gap={3}>
                    <Button
                      size={"sm"}
                      isDisabled={+currentId == 1}
                      onClick={handleBack}
                    >
                      <ArrowBackIcon />
                    </Button>
                    <Button
                      onClick={handleNext}
                      size={"sm"}
                      isDisabled={_lastLottery.currentLotteryId == +currentId}
                    >
                      <ArrowForwardIcon />
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Skeleton>
          </Box>
          <Skeleton isLoaded={!isLoading}>
            <Box m={3} borderRadius={7} bg="#383241" p={4} color={"white"}>
              <Flex alignItems={"center"} gap={10}>
                <Box>
                  <Text>Winning Number</Text>
                  <Text>
                    <Badge>Latest</Badge>
                  </Text>
                </Box>
                <Box>
                  <BallResult finalNumber={lotteryInfo?.finalNumber} />
                </Box>
              </Flex>
            </Box>
          </Skeleton>

          <Skeleton isLoaded={!isLoading}>
            <Box
              m={3}
              p={4}
              bg="white"
              color={"#000"}
              borderRadius={10}
              border="1px solid #F8BE9D"
            >
              <Box display={{ base: "none", md: "block" }}>
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>
                          <Text fontSize={12}>Prize Pot</Text>
                        </Th>
                        <Th>
                          <Text fontSize={"xl"} color="#F8BE9D">
                            $ {lotteryInfo?.totalReward}
                          </Text>
                        </Th>
                        <Th textAlign={"left"} color="#F8BE9D">
                          <Text fontSize={12}>181,663.2368 PPI</Text>
                        </Th>
                        <Th textAlign={"right"}>
                          <Text fontSize={12}>
                            Total tickets this round: 137
                          </Text>
                          <Text>Total roll over: $7,448.2</Text>
                        </Th>
                        <Th />
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.tiers?.map((tierPercent, idx) => {
                        return (
                          <Tr key={idx}>
                            <Td>
                              <Text fontWeight={700}>Tier {idx + 1}</Text>
                            </Td>
                            <Td>
                              <Text color="#4daf9e" fontWeight={700}>
                                {tierPercent}%
                              </Text>
                            </Td>

                            <Td>
                              <Text color="#4daf9e" fontWeight={700}>
                                {(+lotteryInfo?.totalReward * tierPercent) /
                                  100}
                              </Text>
                            </Td>
                            <Td>
                              <Text color="#4daf9e" fontWeight={700}></Text>
                            </Td>
                          </Tr>
                        );
                      })}

                      <Tr>
                        <Td>
                          <Text fontWeight={700} color="#ed4b9e">
                            Fee
                          </Text>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            {data?.fee_rate}%
                          </Text>
                        </Td>

                        <Td>
                          <Text color="#4daf9e" fontWeight={700}></Text>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}></Text>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Skeleton>
        </Box>
      </Box>
    </section>
  );
}

export const BallResult = ({ finalNumber }) => {
  const colors: BallColor[] = [
    "pink",
    "lilac",
    "teal",
    "aqua",
    "green",
    "yellow",
  ];

  const [rotationValues, setRotationValues] = useState([]);
  const reversedNumber = parseRetrievedNumber(finalNumber || "0000000");
  const numAsArray = reversedNumber.split("");

  useEffect(() => {
    if (numAsArray && rotationValues.length === 0) {
      setRotationValues(numAsArray.map(() => random(-30, 30)));
    }
  }, [numAsArray, rotationValues]);

  return (
    <Flex justifyContent="space-between">
      {numAsArray.map((num, index) => {
        return (
          <BallWithNumber
            key={index}
            rotationTransform={rotationValues[index]}
            color={colors[index]}
            number={num}
          />
        );
      })}
    </Flex>
  );
};
