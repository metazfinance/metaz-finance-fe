import AppBox from "@/components/AppBox";
import { Box, Flex, Text } from "@chakra-ui/react";
import LpStakeForm from "./components/LpStakeForm";
import LpTabStake from "./components/LpTabStake";
import LpUnStakeForm from "./components/LpUnStakeForm";

const LiquidityView = () => {
  return (
    <Box>
      <Text textAlign={"center"} fontSize={"3xl"} pb={2} fontWeight="bold">
        Stake METAZ for liquidity
      </Text>

      <AppBox>
        <Flex justifyContent={"space-between"}>
          <Box>
            <Box>Wallet balance</Box>
            <Box>0 METAZ</Box>
          </Box>

          <Box>
            <Box>My Staked Amount</Box>
            <Box>0 iCET = 0 METAZ</Box>
          </Box>
          <Box>
            <Box>APR</Box>
            <Box>20%</Box>
          </Box>
        </Flex>
      </AppBox>

      <Flex gap={10}>
        <AppBox w={320}>
          <Box py={4}>
            <Text>Staked METAZ</Text>
            <Text>12,333,054.4140</Text>
          </Box>

          <Box py={4}>
            <Text>Issued iCET </Text>
            <Text>11,106,242.9170</Text>
          </Box>
          <Box py={4}>
            <Text>Rate </Text>
            <Text>1 iCET = 1.1104 METAZ</Text>
          </Box>
        </AppBox>

        <AppBox flex={1} my={6} borderRadius={8} bg="gray.900" p={10}>
          <LpTabStake
            firstComponent={<LpStakeForm />}
            secondComponent={<LpUnStakeForm />}
          />
        </AppBox>
      </Flex>
    </Box>
  );
};

export default LiquidityView;
