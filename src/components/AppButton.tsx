import { Button } from "@chakra-ui/react";
import React from "react";

const AppButton = ({
  children,
  onClick,
  colorScheme,
  ...rest
}: TChildren & {
  onClick: () => void;
} & any) => {
  return (
    <Button
      w="100%"
      bg="green.900"
      color={"white"}
      _hover={{
        bg: "green.900",
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Button>
  );
};
export default AppButton;
