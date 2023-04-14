import { ethers } from "ethers";
import { multicallAbi } from "./abi";
import { contractAddress } from "./contract";

export interface Call {
  address: string;
  name: string;
  params?: any[];
}

export const multicall = async <T = any>(
  abi: any,
  calls: Call[],
  provider: any
): Promise<T> => {
  try {
    let itf: any;
    const multi = new ethers.Contract(
      contractAddress.multicall, // contract multicall
      multicallAbi,
      provider
    );

    if (abi.encodeFunctionData) {
      itf = abi;
    } else {
      itf = new ethers.utils.Interface(abi);
    }

    const calldata = calls.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);
    const { returnData } = await multi.aggregate(calldata);

    const res = returnData.map((call: any, i: number) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );

    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};
