import { PUBLIC_RPC } from "@/web3Config/contract";
import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

export const onInitProvider: any = () => {
  return new ethers.providers.JsonRpcProvider(PUBLIC_RPC);
};

export const etherSlice = createSlice({
  name: "etherSlice",
  initialState: {
    provider: onInitProvider(),
    singer: onInitProvider(),
    account: "",
  } as any,
  reducers: {
    updateProvider: (state, action) => {
      state.provider = action.payload
        ? new ethers.providers.Web3Provider(action.payload)
        : onInitProvider();
    },
    updateSigner: (state, action) => {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const _singer = provider.getSigner();

      state.signer = action.payload || _singer;
    },
    updateAccount: (state, action) => {
      state.account = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateProvider, updateSigner, updateAccount } =
  etherSlice.actions;

export default etherSlice.reducer;
