import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";

interface ButtonWeb3Props {}

const ButtonWeb3 = () => {
  const loadFn = useDisclosure();
  return (
    <Button
      w={"100%"}
      colorScheme="blue"
      mr={3}
      isLoading={loadFn.isOpen}
      type="submit"
      onClick={() => {
        loadFn.onOpen();
        setTimeout(() => {
          loadFn.onClose();
        }, 2000);
      }}
    >
      Approve
    </Button>
  );
};
export default ButtonWeb3;
