import SCardLpPool from "@/components/SCardLpPool";
import { WrapperSCardPool } from "@/components/SCardPool";
import { Box, Flex, Text } from "@chakra-ui/react";

export default function StakeNative() {
  return (
    <Box>
      <Text textAlign={"center"} fontSize={"3xl"} pb={2} fontWeight="bold">
        Stake LP Token
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
        <SCardLpPool />
      </Flex>
    </Box>
  );
}
