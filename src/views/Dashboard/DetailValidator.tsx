import AppBox from "@/components/AppBox";
import { useValidatorService } from "@/services/validatorServices";
import { Box, Text } from "@chakra-ui/react";
import TxTab from "./TxTab";

interface DetailValidatorProps {}

const DetailValidator = (props: DetailValidatorProps) => {
  const { data, isLoading } = useValidatorService();
  if (isLoading && !data) return <div>Loading...</div>;
  return (
    <Box>
      <Box>
        <AppBox>
          <Text fontWeight={"bold"}>
            {data?.length} address(es) are staking on this node
          </Text>

          <TxTab />
        </AppBox>
      </Box>
    </Box>
  );
};
export default DetailValidator;
