import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Center,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { useRouter } from "next/router";
import SConnectButton from "./SConnectButton";
import Link from "next/link";

const Links = [
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
];
export default function SNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  return (
    <>
      <Box
        px={4}
        position="sticky"
        top={0}
        bg={useColorModeValue("gray.100", "gray.900")}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            width={51}
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />

          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Center justifyContent="flex-start">
                <Image
                  src="/assets/image/logo.png"
                  alt=""
                  width={50}
                  height={50}
                />
              </Center>
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link, idx) => {
                const isActive = router.asPath.startsWith(link.href);

                return (
                  <Link href={link.href} key={idx}>
                    <Text
                      fontSize={14}
                      color={isActive ? "green.900" : "black"}
                    >
                      {link.name}
                    </Text>
                  </Link>
                );
              })}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <SConnectButton />
            {/* <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  size={"sm"}
                  src={
                    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu> */}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => {
                const isActive = router.asPath.startsWith(link.href);

                return (
                  <Link href={link.href}>
                    <Text
                      fontSize={14}
                      color={isActive ? "green.900" : "black"}
                    >
                      {link.name}
                    </Text>
                  </Link>
                );
              })}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
