import { useGetCurrentLotteryInfo } from "@/web3Hook/useLottery";
import { Box, Button, Flex, Modal, useDisclosure } from "@chakra-ui/react";
import { providers } from "ethers";
import { useEffect, useState } from "react";
import { AppModalBuyTicket } from "./AppModal/AppModalBuyTicket";
import { AppModalGetTicket } from "./AppModal/AppModalGetTicket";

const useGetCurrentBlock = () => {
  const [currentBlock, setCurrentBlock] = useState(0);

  useEffect(() => {
    const getCurrentBlock = async () => {
      const _currentBlock = await providers
        .getDefaultProvider()
        .getBlockNumber();
      setCurrentBlock(_currentBlock);
    };
    getCurrentBlock();
  }, []);

  return [currentBlock];
};

const BuyTicketsButton = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenModalFree,
    onOpen: _onOpen,
    onClose: _onClose,
  } = useDisclosure();
  const { data: lotteryInfo } = useGetCurrentLotteryInfo();

  const [currentBlock] = useGetCurrentBlock();

  const renderButton = () => {
    if (!lotteryInfo && !currentBlock) return null;

    if (lotteryInfo.status === 1 && lotteryInfo.blockEnd > currentBlock) {
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
    }
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

  const renderButtonClaimFree = () => {
    if (!lotteryInfo && !currentBlock) return null;

    if (lotteryInfo.status === 1 && lotteryInfo.blockEnd > currentBlock) {
      return (
        <Button
          isDisabled
          color="primary"
          borderRadius={10}
          sx={{
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            border: "2px solid #F8BE9D",
          }}
          px={4}
          py={6}
        >
          Claim ticket
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <Flex gap={1} alignItems={"center"} justifyContent={"center"}>
        <Box>{renderButton()}</Box>
        <Box>{renderButtonClaimFree()}</Box>
      </Flex>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <AppModalBuyTicket onClose={onClose} />
      </Modal>

      <Modal
        blockScrollOnMount={false}
        isOpen={isOpenModalFree}
        onClose={_onClose}
      >
        <AppModalGetTicket onClose={onClose} />
      </Modal>
    </>
  );
};

export default BuyTicketsButton;
