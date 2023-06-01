import { Button, Modal, useDisclosure } from "@chakra-ui/react";
import { AppModalBuyTicket } from "./AppModal/AppModalBuyTicket";

const BuyTicketsButton = () => {
  // const getBuyButtonText = () => {};
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        color="primary"
        borderRadius={10}
        sx={{
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          border: "2px solid #F8BE9D",
        }}
        px={4}
        py={6}
      >
        Get Tickets
      </Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <AppModalBuyTicket onClose={onClose} />
      </Modal>
    </>
  );
};

export default BuyTicketsButton;
