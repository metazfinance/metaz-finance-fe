import { NONE_ADDRESS } from "@/web3Config/contract";
import { useGetLeaderBoard } from "@/web3Hook/useLottery";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
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
            <Box>
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
                    {data?.map((leader, idx) => {
                      if (leader.address === NONE_ADDRESS) return null;
                      return (
                        <Tr key={leader.address + idx}>
                          <Td>
                            <Flex alignItems={"center"}>
                              <Avatar
                                size="sm"
                                name={"METAZ Leader" + leader.address}
                              />

                              <Text ml={2}>{leader.address}</Text>
                            </Flex>
                          </Td>
                          <Td>
                            <Text color="#4daf9e" fontWeight={700}>
                              {leader.ticket} tickets
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
