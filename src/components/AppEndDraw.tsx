import {
  BLOCK_PER_SECONDS,
  NEXT_TIME_DRAW,
  PUBLIC_RPC,
} from "@/web3Config/contract";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import BuyTicketsButton from "./BuyTickets";

interface AppNextDrawProps {
  blockEnd: number;
  blockStart: number;
}

export const AppNextDraw = ({ blockEnd, blockStart }: AppNextDrawProps) => {
  const [timer, setTimer] = useState(0);
  const provider = new ethers.providers.JsonRpcProvider(PUBLIC_RPC);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      // const _currentBlock = await provider.getBlockNumber();
      const block = +blockEnd - +blockStart;
      const time = block * BLOCK_PER_SECONDS;
      const timeCountDown =
        (await provider.getBlock(+blockStart))?.timestamp * 1000 + time;
      setTimer(timeCountDown + NEXT_TIME_DRAW);

      setIsLoading(false);
    }

    getData();
  }, []);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span>🔥🔥🔥</span>;
    } else {
      return (
        <Flex alignItems={"center"} py={4} gap={1} justifyContent={"center"}>
          <Text fontSize={"md"} color={"#eba337"} fontWeight={700}>
            Next draw in
          </Text>

          <Text fontSize={"md"} fontWeight={"700"}>
            {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
          </Text>
        </Flex>
      );
    }
  };

  if (isLoading) {
    return (
      <Text fontSize={"md"} fontWeight={"700"}>
        Loading...
      </Text>
    );
  }

  return (
    <Box>
      {timer && <Countdown date={timer} renderer={renderer} zeroPadDays={2} />}
    </Box>
  );
};

const AppEndDraw = ({ blockEnd, blockStart }: AppNextDrawProps) => {
  const [timer, setTimer] = useState(0);
  const provider = new ethers.providers.JsonRpcProvider(PUBLIC_RPC);

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const block = +blockEnd - +blockStart;
    const time = block * BLOCK_PER_SECONDS;

    async function getData() {
      setIsLoading(true);
      const timeCountDown =
        (await provider.getBlock(+blockStart))?.timestamp * 1000 + time;
      setTimer(timeCountDown);
      setIsLoading(false);
    }

    getData();
  }, []);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <AppNextDraw blockEnd={blockEnd} blockStart={blockStart} />;
    } else {
      return (
        <Flex alignItems={"center"} py={4} gap={1} justifyContent={"center"}>
          <Text fontSize={"md"} color={"#eba337"} fontWeight={700}>
            Draw end in
          </Text>

          <Text fontSize={"md"} fontWeight={"700"}>
            {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
          </Text>
        </Flex>
      );
    }
  };

  if (isLoading) {
    return (
      <Text fontSize={"md"} fontWeight={"700"}>
        Loading...
      </Text>
    );
  }

  return (
    <Box>
      {timer && <Countdown date={timer} renderer={renderer} zeroPadDays={2} />}

      {timer > Date.now() && (
        <Box>
          <BuyTicketsButton />
        </Box>
      )}
    </Box>
  );
};

export default AppEndDraw;
