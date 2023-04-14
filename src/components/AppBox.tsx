import { Box } from "@chakra-ui/react";

interface AppBoxProps {}

const AppBox = ({ children, ...rest }: TChildren & any) => {
  return (
    <Box
      my={6}
      borderRadius={8}
      bg="gray.900"
      p={5}
      boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
      {...rest}
    >
      {children}
    </Box>
  );
};
export default AppBox;
