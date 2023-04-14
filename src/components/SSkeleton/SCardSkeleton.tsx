import { Box, Skeleton } from "@chakra-ui/react";
import React from "react";

interface SCardSkeletonProps {
  length: number;
}

const SCardSkeleton = ({ length = 3 }: SCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length }).map((_, idx) => {
        return (
          <Skeleton key={idx}>
            <Box minW={360} height={420} mb={10} borderRadius={10}>
              <Box
                border="1px solid #53dee9"
                borderRadius={8}
                overflow="hidden"
              />
            </Box>
          </Skeleton>
        );
      })}
    </>
  );
};
export default SCardSkeleton;
