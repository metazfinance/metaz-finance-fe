import { BLOCK_PER_SECONDS, PUBLIC_RPC } from "@/web3Config/contract";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import BuyTicketsButton from "./BuyTickets";

interface AppNextDrawProps {
  blockEnd: number;
  blockStart: number;
}

const AppNextDraw = ({ blockEnd, blockStart }: AppNextDrawProps) => {
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
      return <span>Lottery ended</span>;
    } else {
      return (
        <span>
          {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
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
      <Flex alignItems={"center"} py={4} gap={1} justifyContent={"center"}>
        <Text fontSize={"md"} color={"#eba337"} fontWeight={700}>
          Draw end in
        </Text>

        <Text fontSize={"md"} fontWeight={"700"}>
          {timer && (
            <Countdown date={timer} renderer={renderer} zeroPadDays={2} />
          )}
        </Text>
      </Flex>

      {timer > Date.now() && (
        <Box>
          <BuyTicketsButton />
        </Box>
      )}
    </Box>
  );
};
export default AppNextDraw;
