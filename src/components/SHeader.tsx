import { Box, Center, Divider, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import SConnectButton from "./SConnectButton";

const SHeader = () => {
  const router = useRouter();

  return (
    <Box>
      <Box p={2}>
        <Flex justifyContent={"space-between"} alignItems="center">
          <Box flex={1}>
            <Center justifyContent="flex-start">
              <Image
                src="/assets/image/logo.png"
                alt=""
                width={50}
                height={50}
              />
            </Center>
          </Box>
          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Flex gap={5}>
              {[
                {
                  name: "Stake CET",
                  href: "/validator",
                },
                {
                  name: "Stake METAZ",
                  href: "/token",
                },
                {
                  name: "Lottery",
                  href: "/lottery",
                },
              ].map((item, idx) => {
                const isActive = router.asPath.startsWith(item.href);

                return (
                  <Box key={idx}>
                    <Link href={item.href}>
                      <Text
                        fontSize={14}
                        color={isActive ? "green.900" : "black"}
                      >
                        {item.name}
                      </Text>
                    </Link>
                  </Box>
                );
              })}
            </Flex>
          </Box>
          <Box>
            <SConnectButton />
          </Box>
        </Flex>
      </Box>
      <Divider orientation="horizontal" />
    </Box>
  );
};
export default SHeader;
