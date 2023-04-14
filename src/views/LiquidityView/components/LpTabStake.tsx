import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

const LpTabStake = ({
  optionTab = ["Stake", "UnStake"],
  firstComponent,
  secondComponent,
}: {
  optionTab?: string[];
  firstComponent: JSX.Element;
  secondComponent: JSX.Element;
}) => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box>
      <Flex alignItems={"center"} justifyContent="center" pb={6}>
        {optionTab.map((text, idx) => {
          const style =
            idx % 2 === 0 ? { borderLeftRadius: 8 } : { borderRightRadius: 8 };

          const activeStyle =
            currentTab === idx
              ? { background: "gray.600" }
              : { background: "gray.700" };
          return (
            <Box
              onClick={() => setCurrentTab(idx)}
              key={idx}
              sx={{
                minW: 180,
                textAlign: "center",
                padding: 2,
                cursor: "pointer",
                ...style,
                ...activeStyle,
              }}
            >
              {text}
            </Box>
          );
        })}
      </Flex>

      <Box>{currentTab === 0 && firstComponent}</Box>
      <Box>{currentTab === 1 && secondComponent}</Box>
    </Box>
  );
};
export default LpTabStake;
