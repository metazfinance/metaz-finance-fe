import { useGetLeaderBoard } from "@/web3Hook/useLottery";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export default function LotteryLeaderBoard() {
  const { data, isLoading } = useGetLeaderBoard();

  return (
    <section>
      <Box
        py={4}
        sx={{
          background:
            "linear-gradient(rgb(67, 69, 117) 0%, rgb(102, 87, 141) 100%)",
        }}
        p={{
          base: 4,
          md: 10,
        }}
      >
        <Text
          fontSize={"3xl"}
          textAlign={"center"}
          color={"white"}
          pb={5}
          fontWeight="bold"
        >
          Dashboard
        </Text>

        <Box
          borderRadius={10}
          overflow={"hidden"}
          my={4}
          p={4}
          maxW={{
            base: "100%",
            md: "80%",
          }}
          margin={"0 auto"}
          color={"#000"}
          sx={{
            background: "#FBE1D3",
          }}
        >
          <Box p={4}>
            <Flex gap={5} alignItems={"center"}>
              <Text fontWeight={"bold"}>Leader board</Text>
            </Flex>
          </Box>

          <Box
            m={3}
            p={4}
            bg="white"
            color={"#000"}
            borderRadius={10}
            border="1px solid #F8BE9D"
          >
            <Box display={{ base: "none", md: "block" }}>
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>
                        <Text>Players</Text>
                      </Th>
                      <Th textAlign={"left"}>
                        <Text fontSize={12}>Purchase</Text>
                      </Th>

                      <Th textAlign={"left"}>
                        <Text fontSize={12}>Tx</Text>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.leaderBoardList?.map((address, idx) => {
                      if (
                        address === "0x0000000000000000000000000000000000000000"
                      )
                        return null;
                      return (
                        <Tr key={address + idx}>
                          <Td>
                            <Flex alignItems={"center"}>
                              <Avatar
                                size="sm"
                                name={"METAZ Leader" + address}
                              />

                              <Text ml={2}>{address}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Text color="#4daf9e" fontWeight={700}>
                              20 tickets
                            </Text>
                          </Td>

                          <Td>
                            <Text color="#4daf9e" fontWeight={700}>
                              <ExternalLinkIcon />
                            </Text>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Box>
    </section>
  );
}
