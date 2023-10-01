import { randomTicketNumbers } from "@/utils/ultities";
import {
  useActionLottery2,
  useGetCurrentLotteryInfo2,
} from "@/web3Hook/useLotteryV2";
import {
  useActionLottery,
  useGetCurrentLotteryInfo,
} from "@/web3Hook/useLottery";
import { Box, Button, Flex, Modal, useDisclosure } from "@chakra-ui/react";
import { providers } from "ethers";
import { useEffect, useState } from "react";
import AppButton from "./AppButton";
import { AppModalBuyTicket, AppModalBuyTicket2 } from "./AppModal/AppModalBuyTicket";
import { AppModalGetTicket, AppModalGetTicket2 } from "./AppModal/AppModalGetTicket";

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

export const BuyTicketsButton = ({ }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenModalFree,
    onOpen: _onOpen,
    onClose: _onClose,
  } = useDisclosure();
  const { data: lotteryInfo } = useGetCurrentLotteryInfo();

  const { claimFreeTicket } = useActionLottery();

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

  const handleClaimTicketFree = async () => {
    const tickets = randomTicketNumbers(10);
    await claimFreeTicket.mutateAsync(tickets);
  };
  const renderButtonClaimFree = () => {
    if (!lotteryInfo && !currentBlock) return null;

    if (!lotteryInfo.isTicketFree) return null;

    if (lotteryInfo.status === 1 && lotteryInfo.blockEnd > currentBlock) {
      return (
        <AppButton
          borderRadius={10}
          px={4}
          py={6}
          isLoading={claimFreeTicket.isLoading}
          isDisabled={claimFreeTicket.isLoading}
          onClick={handleClaimTicketFree}
        >
          Claim ticket
        </AppButton>
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

export const BuyTicketsButton2 = ({ }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenModalFree,
    onOpen: _onOpen,
    onClose: _onClose,
  } = useDisclosure();
  const { data: lotteryInfo } = useGetCurrentLotteryInfo2();

  const { claimFreeTicket } = useActionLottery2();

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

  const handleClaimTicketFree = async () => {
    const tickets = randomTicketNumbers(10);
    await claimFreeTicket.mutateAsync(tickets);
  };
  const renderButtonClaimFree = () => {
    if (!lotteryInfo && !currentBlock) return null;

    if (!lotteryInfo.isTicketFree) return null;

    if (lotteryInfo.status === 1 && lotteryInfo.blockEnd > currentBlock) {
      return (
        <AppButton
          borderRadius={10}
          px={4}
          py={6}
          isLoading={claimFreeTicket.isLoading}
          isDisabled={claimFreeTicket.isLoading}
          onClick={handleClaimTicketFree}
        >
          Claim ticket
        </AppButton>
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
        <AppModalBuyTicket2 onClose={onClose} />
      </Modal>

      <Modal
        blockScrollOnMount={false}
        isOpen={isOpenModalFree}
        onClose={_onClose}
      >
        <AppModalGetTicket2 onClose={onClose} />
      </Modal>
    </>
  );
};

