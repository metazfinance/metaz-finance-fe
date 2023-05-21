import { BallColor, BallWithNumber } from "@/components/BallSVG/Balls";
import { formatCurrency } from "@/utils/ultities";
import { BLOCK_PER_SECONDS, EXPLORE, SYMBOL } from "@/web3Config/contract";
import {
  useGetCurrentLotteryInfo,
  useGetLotteryInfo,
  useLottery,
} from "@/web3Hook/useLottery";
import { useGetProvider } from "@/web3Provider/hookStore/useGetProvider";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";

import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import AppCheckClaimable from "./components/AppCheckClaimable";
import Link from "next/link";

export default function LotteryPoolHistory() {
  const provider = useGetProvider();
  const { data } = useLottery();
  const { data: _lastLottery } = useGetCurrentLotteryInfo();
  const { getLotteryInfo, getRewardAccount } = useGetLotteryInfo();

  const [lotteryInfo, setLotteryInfo] = useState<any>();
  const [currentId, setCurrentId] = useState(+data?.currentLotteryId);
  const [timeEnd, setTimeEnd] = useState(0);
  const [isLoading, setLoading] = useState(false);

  useMemo(() => {
    if (!data?.currentLotteryId) return;
    setCurrentId(+data?.currentLotteryId);
  }, [data?.currentLotteryId]);

  const getLotteryInfoById = async (currentId: number) => {
    setLoading(true);

    const res = await getLotteryInfo(currentId);
    setLotteryInfo({
      currentLotteryId: currentId,
      status: +res.status,
      blockEnd: +res.blockEnd,
      blockStart: +res.blockStart,
      totalReward: +res.totalReward / 1e18,
      finalNumber: +res.finalNumber,
      countWinnersTier1: +res.countWinnersTier1,
      countWinnersTier2: +res.countWinnersTier2,
      countWinnersTier3: +res.countWinnersTier3,
    });

    setLoading(false);
    if (!res?.blockStart) return;
    const block = +res.blockEnd - +res.blockStart;
    const time = block * BLOCK_PER_SECONDS;
    const timeCountDown =
      (await provider.getBlock(+res.blockStart)).timestamp + time;
    setTimeEnd(+timeCountDown);
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
                    <Skeleton isLoaded={!isLoading}>
                      <Badge>{lotteryInfo?.currentLotteryId}</Badge>
                    </Skeleton>
                  </Flex>
                  <Text textAlign={"left"}>
                    {dayjs.unix(timeEnd).format("MMMM DD, YYYY HH:mm:ss")}
                  </Text>

                  <Skeleton isLoaded={!isLoading || !lotteryInfo}>
                    <Box
                      pt={2}
                      display={{
                        base: "block",
                        md: "none",
                      }}
                    >
                      {lotteryInfo && lotteryInfo?.status != 1 && (
                        <AppCheckClaimable
                          currentId={lotteryInfo.currentLotteryId}
                        />
                      )}
                    </Box>
                  </Skeleton>
                </Box>
                <Skeleton isLoaded={!isLoading || !lotteryInfo}>
                  <Box
                    display={{
                      base: "none",
                      md: "block",
                    }}
                  >
                    {lotteryInfo && lotteryInfo?.status != 1 && (
                      <AppCheckClaimable
                        currentId={lotteryInfo.currentLotteryId}
                      />
                    )}
                  </Box>
                </Skeleton>

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
                      // isDisabled={_lastLottery.currentLotteryId == +currentId}
                    >
                      <ArrowForwardIcon />
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Skeleton>
          </Box>
          <Skeleton isLoaded={!isLoading}>
            <Box
              m={3}
              borderRadius={7}
              bg="#383241"
              p={4}
              color={"white"}
              position={"relative"}
            >
              <Flex
                alignItems={"center"}
                gap={10}
                display={{
                  base: "block",
                  md: "flex",
                }}
              >
                <Box
                  pb={{
                    base: 5,
                    md: 0,
                  }}
                >
                  <Text>Winning Number</Text>
                  <Text>
                    <Badge>Latest</Badge>
                  </Text>
                </Box>
                <Box>
                  <BallResult finalNumber={lotteryInfo?.finalNumber} />
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                  }}
                >
                  <Link
                    href={`${EXPLORE}/block/${+lotteryInfo?.blockEnd}`}
                    passHref
                    target="_blank"
                  >
                    <Icon as={ExternalLinkIcon} />
                  </Link>
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
              <Box>
                <TableContainer>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>
                          <Text fontSize={12}>Prize Pot</Text>
                        </Th>
                        <Th>
                          <Text color="#F8BE9D">Prize pool allocation</Text>
                        </Th>
                        <Th textAlign={"left"} color="#F8BE9D">
                          <Text fontSize={12}>Ticket win this round</Text>
                        </Th>

                        <Th />
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          <Text fontWeight={700}>Tier 1</Text>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            {data?.tiers[0]}%
                          </Text>
                        </Td>

                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            {lotteryInfo?.countWinnersTier1} tickets
                          </Text>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}></Text>
                        </Td>
                      </Tr>

                      <Tr>
                        <Td>
                          <Text fontWeight={700}>Tier 2</Text>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            {data?.tiers[1]}%
                          </Text>
                        </Td>

                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            {lotteryInfo?.countWinnersTier2} tickets
                          </Text>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}></Text>
                        </Td>
                      </Tr>

                      <Tr>
                        <Td>
                          <Text fontWeight={700}>Tier 3</Text>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            {data?.tiers[2]}%
                          </Text>
                        </Td>

                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            {lotteryInfo?.countWinnersTier3} tickets
                          </Text>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}></Text>
                        </Td>
                      </Tr>

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
                      <Tr>
                        <Td>
                          <Text fontWeight={700} color="#ed4b9e">
                            Total reward
                          </Text>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            {`${formatCurrency(+lotteryInfo?.totalReward)}`}{" "}
                            ( {SYMBOL} )
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

  function padWithLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, "0");
  }

  if (!finalNumber) return null;

  const luckyNumber = padWithLeadingZeros(
    finalNumber,
    // @ts-ignore
    6 - (finalNumber + "").split().length
  );
  return (
    <Flex justifyContent="space-between">
      {(luckyNumber + "")?.split("").map((num, index) => {
        return (
          <BallWithNumber key={index} color={colors[index]} number={num} />
        );
      })}
    </Flex>
  );
};
