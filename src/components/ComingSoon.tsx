import { Heading } from "@chakra-ui/react";
import React from "react";

interface ComingSoonProps {}

const ComingSoon: React.FC = (props: ComingSoonProps) => {
  return (
    <div>
      <Heading as="h1" size="3xl" textAlign={"center"} pt={4}>
        Coming soon
      </Heading>
    </div>
  );
};
export default ComingSoon;
