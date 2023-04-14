import { Box, Text } from "@chakra-ui/react";
import React from "react";

interface IndexProps {}

const Index: React.FC = (props: IndexProps) => {
  return (
    <Box
      p={{
        base: 4,
        md: 10,
      }}
    >
      <Text textAlign={"center"} fontWeight="bold" fontSize={"xl"}>
        Welcome to Metaz Finance
      </Text>
    </Box>
  );
};
export default Index;
