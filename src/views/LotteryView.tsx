import { BallColor, BallWithNumber } from "@/components/BallSVG/Balls";
import { parseRetrievedNumber } from "@/utils/helpers";
import { useLottery } from "@/web3Hook/useLottery";
import { random } from "lodash-es";
import { useEffect, useState } from "react";

import BuyTicketsButton from "@/components/BuyTickets";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Countdown, { zeroPad } from "react-countdown";
import { AppModalBuyTicket } from "@/components/AppModal/AppModalBuyTicket";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function LotteryView() {
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

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return "End";
    } else {
      // Render a countdown
      return (
        <span>
          {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      );
    }
  };

  const img1Animation = useAnimation();
  const img2Animation = useAnimation();
  const img3Animation = useAnimation();
  const img4Animation = useAnimation();

  const handleMouseMove = (e: any) => {
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 1.4;
    const moveY = clientY - window.innerHeight / 1.4;
    const offsetFactor = 2;

    img1Animation.start({
      x: -moveX / (offsetFactor + 15),
      y: -moveY / (offsetFactor + 15),
    });
    img2Animation.start({
      x: -moveX / (offsetFactor + 7),
      y: -moveY / (offsetFactor + 7),
    });
    img3Animation.start({
      x: -moveX / (offsetFactor + 15),
      y: -moveY / (offsetFactor + 15),
    });
    img4Animation.start({
      x: -moveX / (offsetFactor + 7),
      y: -moveY / (offsetFactor + 7),
    });
  };

  return (
    <Box
      position={"relative"}
      margin={"0 auto"}
      sx={{ background: "#FCDF79" }}
      p={0}
    >
      <motion.div
        animate={img1Animation}
        onMouseMove={(e) => handleMouseMove(e)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
          }}
        >
          <Image
            src="/assets/image/lottery/die1.png"
            alt="lottery"
            width={50}
            height={50}
          />
        </Box>{" "}
      </motion.div>

      <motion.div onMouseMove={(e) => handleMouseMove(e)}>
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "10%",
          }}
        >
          <Image
            src="/assets/image/lottery/die2.png"
            alt="lottery"
            width={50}
            height={50}
          />
        </Box>{" "}
      </motion.div>

      <motion.div
        animate={img3Animation}
        onMouseMove={(e) => handleMouseMove(e)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            right: "10%",
          }}
        >
          <Image
            src="/assets/image/lottery/die3.png"
            alt="lottery"
            width={50}
            height={50}
          />
        </Box>{" "}
      </motion.div>

      <motion.div onMouseMove={(e) => handleMouseMove(e)}>
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "10%",
          }}
        >
          <Image
            src="/assets/image/lottery/die6.png"
            alt="lottery"
            width={50}
            height={50}
          />
        </Box>{" "}
      </motion.div>

      <motion.div onMouseMove={(e) => handleMouseMove(e)}>
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            right: "10%",
          }}
        >
          <Image
            src="/assets/image/lottery/die4.png"
            alt="lottery"
            width={50}
            height={50}
          />
        </Box>{" "}
      </motion.div>

      <motion.div
        animate={img3Animation}
        onMouseMove={(e) => handleMouseMove(e)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "28%",
            right: "20%",
          }}
        >
          <Image
            src="/assets/image/lottery/die4.png"
            alt="lottery"
            width={50}
            height={50}
          />
        </Box>
      </motion.div>

      <motion.div onMouseMove={(e) => handleMouseMove(e)}>
        <Box
          sx={{
            position: "absolute",
            top: "28%",
            left: "20%",
          }}
        >
          <Image
            src="/assets/image/lottery/die5.png"
            alt="lottery"
            width={50}
            height={50}
          />
        </Box>
      </motion.div>

      <motion.div
        animate={img1Animation}
        onMouseMove={(e) => handleMouseMove(e)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "38%",
            left: "20%",
          }}
        >
          <Image
            src="/assets/image/lottery/die6.png"
            alt="lottery"
            width={50}
            height={50}
          />
        </Box>
      </motion.div>

      <Flex minH={500} justifyContent={"center"} alignItems={"center"}>
        <Box />
        <Box>
          <Text
            textAlign={"center"}
            color={"#eba337"}
            fontSize={"3xl"}
            py={2}
            fontWeight="bold"
          >
            Prize Pot
          </Text>

          <Box textAlign={"center"}>
            <Box>
              <Text fontSize={"3xl"} pb={2} fontWeight="bold" color={"#163b56"}>
                $ 7,562.14
              </Text>
              <Flex alignItems={"center"} py={4} gap={1}>
                <Text fontSize={"md"} color={"#eba337"} fontWeight={700}>
                  Next Draw
                </Text>

                <Text fontSize={"md"} fontWeight={"700"}>
                  <Countdown
                    date={Date.now() + 100000}
                    renderer={renderer}
                    zeroPadDays={2}
                  />
                </Text>
              </Flex>

              <Box>
                <BuyTicketsButton />
              </Box>
            </Box>
          </Box>
        </Box>
      </Flex>

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
            <Box p={4}>
              <Flex gap={5} alignItems={"center"}>
                <Text>Round</Text>
                <Text>864</Text>
              </Flex>
              <Text textAlign={"left"}>Drawn Apr 9, 2023, 7:00 AM</Text>
            </Box>

            <Box m={3} borderRadius={7} bg="#383241" p={4} color={"white"}>
              <Flex alignItems={"center"} gap={10}>
                <Box>
                  <Text>Winning Number</Text>
                  <Text>
                    <Badge>Latest</Badge>
                  </Text>
                </Box>
                <Box>
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
                </Box>
              </Flex>
            </Box>

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
                            $ 7,944.75
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
                      <Tr>
                        <Td>
                          <Text fontWeight={700}>Match First 1</Text>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            4,541.5809 PPI
                          </Text>
                        </Td>
                        <Td textAlign={"left"}>
                          <Text color="gray.800">~$198.61</Text>
                        </Td>
                        <Td textAlign={"right"}>
                          <Text color="gray.800"> 378.465 PPI each</Text>
                        </Td>
                        <Td textAlign={"right"}>
                          <Text color="gray.800"> 0 Winning Tickets</Text>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
        </Box>
      </section>

      <section>
        <Box
          py={4}
          sx={{
            background:
              "linear-gradient(rgb(67, 69, 117) 0%, rgb(102, 87, 141) 100%)",
          }}
          p={{
            base: 4,
            md: 10,
          }}
        >
          <Text
            fontSize={"3xl"}
            textAlign={"center"}
            color={"white"}
            pb={5}
            fontWeight="bold"
          >
            Dashboard
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
            <Box p={4}>
              <Flex gap={5} alignItems={"center"}>
                <Text>Round</Text>
                <Text>864</Text>
              </Flex>
              <Text textAlign={"left"}>Drawn Apr 9, 2023, 7:00 AM</Text>
            </Box>

            <Box p={4}>
              <Flex gap={5} alignItems={"center"}>
                <Text>Winner List</Text>
              </Flex>
            </Box>

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
                          <Text>Players</Text>
                        </Th>
                        <Th textAlign={"left"}>
                          <Text fontSize={12}>Purchase</Text>
                        </Th>

                        <Th textAlign={"left"}>
                          <Text fontSize={12}>Tx</Text>
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>
                          <Flex alignItems={"center"}>
                            <Avatar
                              size="sm"
                              name="Dan Abrahmov"
                              bg={"#F8BE9D"}
                            />

                            <Text ml={2}>0x0</Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            20 tickets
                          </Text>
                        </Td>

                        <Td>
                          <Text color="#4daf9e" fontWeight={700}>
                            <ExternalLinkIcon />
                          </Text>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Box>
        </Box>
      </section>
    </Box>
  );
}
