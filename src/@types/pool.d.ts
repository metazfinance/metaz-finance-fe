interface IPool {
  contract: IAddress;
  totalStaked: number;
  totalStakedByAccount: number;
  totalReward: number;
  amountClaimable: number;
  limit: number;
  apy: number;
  endIn: string;
  isOpenStake: boolean;
  maxStake: number;
}

interface IPoolLpStake {
  contract: IAddress;
  yourStaked: number;
  reward: number;
  daily: string;
}

interface IPoolValidatorStake {
  hasStaking: boolean;
  hasUnstake: boolean;
  isShowWithdraw: boolean;
  hasWithdraw: boolean;
  disableWithdraw: boolean;
  isWaitingWithdraw: boolean;
  isWithdraw: boolean;
  hasClaimable: boolean;
  contract: IAddress;
  isStaking: boolean;
  isDisableStake: boolean;
  totalStaking: number;
  totalStakedByAccount: number;
  totalReward: number;
}

interface IPoolLpStake {
  balanceStaked: number;
  reward: number;
  isStakeable: boolean;
  LPtotalStaked: number;
}
