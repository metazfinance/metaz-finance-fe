import { WrapperCardValidatorPool } from "@/components/SCardValidatorPool";
import DetailValidator from "@/views/Dashboard/DetailValidator";
import { Box, Text } from "@chakra-ui/react";

export default function StakeNative() {
  return (
    <Box
      p={{
        base: 4,
        md: 10,
      }}
    >
      <Box>
        <Text textAlign={"center"} fontSize={"3xl"} pb={2} fontWeight="bold">
          Stake METAZ to validator
        </Text>
        <WrapperCardValidatorPool />
      </Box>
      <DetailValidator />
    </Box>
  );
}
