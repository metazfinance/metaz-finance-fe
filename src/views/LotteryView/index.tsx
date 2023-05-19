import { useGetCurrentLotteryInfo } from "@/web3Hook/useLottery";

import AppEndDraw from "@/components/AppEndDraw";
import { SYMBOL } from "@/web3Config/contract";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import LotteryLeaderBoard from "./LotteryLeaderBoard";
import LotteryPoolHistory from "./LotteryPoolHistory";

export default function LotteryView() {
  const { isLoading, data } = useGetCurrentLotteryInfo();

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

  if (isLoading)
    return (
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        minH={"80vh"}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );

  return (
    <Box>
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
          <Box textAlign={"center"}>
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
                <Text
                  fontSize={"3xl"}
                  pb={2}
                  fontWeight="bold"
                  color={"#163b56"}
                >
                  {data?.totalReward / 1e18 || 0} {SYMBOL}
                </Text>
                {data && (
                  <AppEndDraw
                    blockEnd={data?.blockEnd}
                    blockStart={data?.blockStart}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
      <LotteryPoolHistory />
      <LotteryLeaderBoard />
    </Box>
  );
}
