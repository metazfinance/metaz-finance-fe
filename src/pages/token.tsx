import { WrapperSCardPool } from "@/components/SCardPool";
import SCardSkeleton from "@/components/SSkeleton/SCardSkeleton";
import { useInfoPoolStakeToken } from "@/web3Hook/useStakeToken";
import { Box, Flex, Text } from "@chakra-ui/react";

export default function Pools() {
  const { isLoading, data } = useInfoPoolStakeToken();
  return (
    <Box
      p={{
        base: 4,
        md: 10,
      }}
    >
      <Text textAlign={"center"} fontSize={"3xl"} pb={2} fontWeight="bold">
        Stake Token
      </Text>
      <Flex
        display={{
          base: "block",
          md: "flex",
        }}
        flexWrap={"wrap"}
        justifyContent={"center"}
        gap={10}
      >
        {isLoading ? (
          <SCardSkeleton length={3} />
        ) : (
          <>
            {data?.map((pool) => (
              <WrapperSCardPool pool={pool} key={pool.contract} />
            ))}
          </>
        )}
      </Flex>
    </Box>
  );
}
