import { useValidatorService } from "@/services/validatorServices";
import { getBalanceLocalString } from "@/utils/ultities";
import {
  Badge,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import React from "react";

interface TxTabProps {}

const TxTab = (props: TxTabProps) => {
  const { data, isLoading } = useValidatorService();

  return (
    <TableContainer
      sx={{
        fontSize: 12,
      }}
    >
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Tx Hash</Th>
            <Th>Delegator Address</Th>
            <Th>Amount ( METAZ )</Th>
            <Th>REWARD ESTIMATION</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            data.map(
              (
                elm: {
                  rank: number;
                  staking: string;
                  percentage: string;
                  staker: { address: string; alias: string };
                },
                idx
              ) => {
                return (
                  <Tr key={elm.rank + idx}>
                    <Td>{elm.rank}</Td>
                    <Td>{elm.staker.alias || elm.staker.address}</Td>
                    <Td>{(+elm.staking).toFixed(2)}</Td>
                    <Td>{(Number(elm.percentage) * 100).toFixed(2)}</Td>
                  </Tr>
                );
              }
            )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
export default TxTab;
