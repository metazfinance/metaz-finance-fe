import { WrapperSCardLpPool } from "@/components/SCardLpPool";
import { Box, Text } from "@chakra-ui/react";

const StakeLpView = () => {
  return (
    <Box
      p={{
        base: 4,
        md: 10,
      }}
    >
      <Box>
        <Text textAlign={"center"} fontSize={"3xl"} pb={2} fontWeight="bold">
          Stake LP token
        </Text>
        <WrapperSCardLpPool />
      </Box>
    </Box>
  );
};
export default StakeLpView;
