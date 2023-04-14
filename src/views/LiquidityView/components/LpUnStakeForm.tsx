import AppBox from "@/components/AppBox";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";

const LpUnStakeForm = () => {
  return (
    <Box>
      <Box>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Image src="/assets/image/cake.svg" alt="" width={30} height={30} />
          </InputLeftElement>
          <Input type="cet" placeholder="METAZ" />
          <InputRightAddon>Max</InputRightAddon>
        </InputGroup>
      </Box>
      <Box py={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Image src="/assets/image/cake.svg" alt="" width={30} height={30} />
          </InputLeftElement>
          <Input type="cet" placeholder="METAZ" />
          <InputRightElement cursor={"pointer"} width="10rem" textAlign="right">
            1 iCET = 1.1104 METAZ
          </InputRightElement>
        </InputGroup>
      </Box>

      <Flex justify={"space-between"} alignItems="center">
        <Box>
          <Text py={2}>Max to UnStake</Text>
          <Text py={2}>Fee</Text>
          <Text py={2}>You will get</Text>
        </Box>

        <Box>
          <Text py={2}>0 METAZ</Text>
          <Text py={2}>0 METAZ</Text>
          <Text py={2}>0 METAZ</Text>
        </Box>
      </Flex>

      <Button w="100%" disabled>
        UnStake
      </Button>
    </Box>
  );
};
export default LpUnStakeForm;
