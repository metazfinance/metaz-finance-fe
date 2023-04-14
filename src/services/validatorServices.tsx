import { validatorApi } from "@/api/validatorApi";
import { useQuery } from "react-query";
export const useValidatorService = () => {
  const queryKey = "get-validator";

  const _data = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      // return [
      //   {
      //     percentage: "0.4169",
      //     rank: 1,
      //     staker: {
      //       address: "0x814ac52e2e6d60C3998688E6EE60784f0418045B",
      //       alias: "",
      //       type: 0,
      //     },
      //     staking: "15787",
      //   },
      //   {
      //     percentage: "0.2861",
      //     rank: 2,
      //     staker: {
      //       address: "0xebeDB77b225C461f4823dA085F087Dc591302937",
      //       alias: "METAZ",
      //       type: 1,
      //     },
      //     staking: "10834.3222225925802473",
      //   },
      //   {
      //     percentage: "0.2641",
      //     rank: 3,
      //     staker: {
      //       address: "0x7afBF17BdB985DcF21c1B620e90fc3f6661FdB40",
      //       alias: "",
      //       type: 0,
      //     },
      //     staking: "10000",
      //   },
      //   {
      //     percentage: "0.033",
      //     rank: 4,
      //     staker: {
      //       address: "0xdE07a2F594a30456C1A4c6B9BF5027A6f3A6ebe9",
      //       alias: "",
      //       type: 0,
      //     },
      //     staking: "1250",
      //   },
      // ];
      const data = await validatorApi.getDetailValidator();
      return data;
    },
    refetchOnWindowFocus: false,
    staleTime: 10000,
  });

  return _data;
};
