export const CHAIN_ID = 53;

// process.env.NEXT_PUBLIC_CHAIN_ID!;
// || process.env.NEXT_PUBLIC_CHAIN_ID || 53;

export const contractAddress = {
  53: {
    stakingTokenV1: "0x45b16861Bb762BF340C3A18F3FB38dE4ebf9bB7E",
    stakingTokenV2: "0x9f637c8466C827042d247ca64AFaB7b1A315c76A",
    stakingTokenV3: "0x204A209D77B4BE0Cba423dE3a46364966fBb1697",

    lpToken: "0x9b030A3F6Ef4911391B067b65ae4719785B5a2D5",
    stakingLpTokenV1: "0xa612AAe296a28517b9250a0b28a6E2BEF73Db173",
    lotteryV1: "0xE77B3bAc954dE593FF10C9cf59C218aef4Da787a",

    rewardContractStakeValidator: "0x11028621939D02093F809688384e662A06043dB7",
    stakingCetToValidator: "0x0000000000000000000000000000000000001000",
    validator: "0x0A636f08b26272c3C83b6b837835f7e2d11c3984",

    // ERC20: "0xE88c6353035EB391Ef3504901175f615742336Df",
    ERC20: "0xDE2e330A7BbA9363Bc0DD60A669769C51dD27864",
    ERC20_LOTTERY: "0x5872776d48a7338e3600b87C9F60C48BF47Cc0f7",
    CONTRACT_CALCULATOR_REWARD: "0xebeDB77b225C461f4823dA085F087Dc591302937",

    COIN_EX_VALIDATOR: "0xebeDB77b225C461f4823dA085F087Dc591302937",
    multicall: "0x409525b2412c472fe5AAA1bFf2C4E2DA62677946",
  },
  52: {
    stakingTokenV1: process.env.NEXT_PUBLIC_STAKINGV1!, // contract staking
    stakingTokenV2: process.env.NEXT_PUBLIC_STAKINGV2!,
    stakingTokenV3: process.env.NEXT_PUBLIC_STAKINGV3!,

    stakingLpTokenV1: process.env.NEXT_PUBLIC_STAKING_LP_TOKENV1!, // contract stake LP token
    stakingLpTokenV2: process.env.NEXT_PUBLIC_STAKING_LP_TOKENV2!,
    ERC_LP_TOKEN: process.env.NEXT_PUBLIC_ERC_LP_CET_MTZ!, // contract LP token
    ERC_LP_TOKEN_STABLE: process.env.NEXT_PUBLIC_ERC_LP_USDT_MTZ!,

    lotteryV1: process.env.NEXT_PUBLIC_LOTTERY!, // contract lottery

    rewardContractStakeValidator:
      process.env.NEXT_PUBLIC_REWARD_CONTRACT_STAKE_VALIDATOR!, // contract get reward stake validator
    stakingCetToValidator:
      process.env.NEXT_PUBLIC_REWARD_STAKE_CET_TO_VALIDATOR!, // contract stake CET to validator
    validator: process.env.NEXT_PUBLIC_VALIDATOR!, // contract validator

    ERC20: process.env.NEXT_PUBLIC_ERC20!, // contract ERC20 MTZ
    ERC20_LOTTERY: process.env.NEXT_PUBLIC_ERC20_LOTTERY!, // contract ERC20 lottery

    COIN_EX_VALIDATOR: process.env.NEXT_PUBLIC_COIN_EX_VALIDATOR!,
    CONTRACT_CALCULATOR_REWARD:
      process.env.NEXT_PUBLIC_CONTRACT_CALCULATOR_REWARD!,

    multicall: "0x63842f90D8f1BcCAe36eb67C91270e1Df09613a8",
  },

  // 52: {
  //   stakingTokenV1: "0x3Fd44612fA536175cD68143dcCb66c3449C9188A",
  //   stakingTokenV2: "0x44e0ef7A218B9e57d4e8788Daa3c02f8b734ffEC",
  //   stakingTokenV3: "0xB31CD9c0412CdeaD39A30A039cA78dC866a7E6C8",

  //   lpToken: "0xCb4ae3b77e286311Ab86c422E38D22E053ddab04",
  //   stakingLpTokenV1: "0x9040B7798d45c83e92c9b9594Bb30af14eBd877A",
  //   lotteryV1: "0x8C7d481D4980F7734220080c17458De6Eef4E344",

  //   rewardContractStakeValidator: "0x372be3544D6f11A34c0214189223F08a7fbC8f11",

  //   stakingCetToValidator: "0x0000000000000000000000000000000000001000",

  //   ERC20: "0x614EA1546f54192c713d2fcC516E4a74cF282fA0",

  //   COIN_EX_VALIDATOR: "0xebeDB77b225C461f4823dA085F087Dc591302937",
  //   CONTRACT_CALCULATOR_REWARD: "0xed7eeAeFe7f97152EF413809e47404FD58e4E3d7",
  //   multicall: "0x63842f90D8f1BcCAe36eb67C91270e1Df09613a8",
  // },
}[CHAIN_ID] as any;

export const MATH_POW_18_ZERO = "000000000000000000";

export const SYMBOL = "METAZ";
export const SYMBOL_LP = "MTZ/CET";

export const PUBLIC_RPC = {
  53: "https://testnet-rpc.coinex.net",
  52: "https://rpc.coinex.net",
}[CHAIN_ID];

export const BLOCK_PER_SECONDS = 3000;

export const PRICE_TICKET = 0.1;
export const MAX_TICKET_BUY = 5000;
export const MAX_BUY_PER_TX = 100;

export const NEXT_TIME_DRAW = 30 * 60 * 1000;

export const EXPLORE = {
  53: "https://testnet.coinex.net",
  52: "https://www.coinex.net",
}[CHAIN_ID];

export const NONE_ADDRESS = "0x0000000000000000000000000000000000000000";
