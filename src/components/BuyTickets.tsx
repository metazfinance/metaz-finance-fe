import { useGetCurrentLotteryInfo } from "@/web3Hook/useLottery";
import { Button, Modal, useDisclosure } from "@chakra-ui/react";
import { AppModalBuyTicket } from "./AppModal/AppModalBuyTicket";

const BuyTicketsButton = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: lotteryInfo } = useGetCurrentLotteryInfo();

  const renderButton = () => {
    if (!lotteryInfo) return null;
    if (lotteryInfo.status === 1)
      return (
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
      );

    if (lotteryInfo.status === 2) {
      <Button
        onClick={onOpen}
        color="primary"
        borderRadius={10}
        sx={{
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          border: "2px solid #F8BE9D",
        }}
        isDisabled
        px={4}
        py={6}
      >
        Lottery ended
      </Button>;
    }
    return null;
  };

  return (
    <>
      {renderButton()}
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <AppModalBuyTicket onClose={onClose} />
      </Modal>
    </>
  );
};

export default BuyTicketsButton;
