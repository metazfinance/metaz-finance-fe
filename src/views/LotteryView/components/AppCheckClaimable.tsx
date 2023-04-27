import AppButton from "@/components/AppButton";
import { useActionLottery, useGetLotteryInfo } from "@/web3Hook/useLottery";
import {
  Badge,
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

const AppCheckClaimable = ({ currentId }: { currentId: number }) => {
  const { getRewardAccount, getIsClaimable } = useGetLotteryInfo();
  const { claimReward } = useActionLottery();
  const [reward, setReward] = useState(0);
  const [isClaimed, setIsClaimed] = useState(0);
  const { isOpen: isLoading, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (!currentId) return;
    onOpen();
    getRewardAccount(currentId).then((res) => {
      console.log(res);
      setReward(+res);
    });

    getIsClaimable(currentId).then((res) => {
      setIsClaimed(res);
    });
    onClose();
  }, [currentId]);

  const handleClaimReward = useCallback(async () => {
    await claimReward.mutateAsync(currentId);
  }, [currentId]);

  if (isLoading) return <Text>Loading...</Text>;
  return (
    <Box>
      {+reward > 0 ? (
        <Box>
          {isClaimed ? (
            <Badge colorScheme="gray" p={1}>
              Claimed
            </Badge>
          ) : (
            <AppButton
              display="flex"
              gap={2}
              onClick={handleClaimReward}
              isLoading={claimReward.isLoading}
            >
              <Box>Reward:</Box>
              <Text>{+reward / 1e18}</Text>
            </AppButton>
          )}
        </Box>
      ) : (
        <Badge colorScheme="red" p={1}>
          No reward
        </Badge>
      )}
    </Box>
  );
};
export default AppCheckClaimable;
