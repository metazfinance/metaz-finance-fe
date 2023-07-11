import {
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    InputRightAddon,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    Progress,
    Text,
    useDisclosure,
    Wrap,
} from "@chakra-ui/react";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'
import Image from "next/image";
// import { WrapperCardValidatorPool } from "@/components/SCardValidatorPool";
import { useState, useEffect } from "react";
import abi from '@/web3Config/abi/ico.json';
import {
    useGetAccount,
    useGetProvider,
    useGetSinger,
} from "@/web3Provider/hookStore/useGetProvider";
import { ethers } from "ethers";
import { BigNumber } from "ethers";
import { min } from "lodash-es";

// 0xCBb5Bea2589d0f98C077977a080ee79C70aCE8Fc
const contract_address = "0x3b84b4CB4D5731426f6FDD1A382B1C6Af08aC04e";


const CountDown = ({ time }: { time: number }) => {
    const [seconds, setSeconds] = useState(time);
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);

    // useEffect(() => {
    //     setSeconds(time);
    // })

    useEffect(() => {
        const countDown = setInterval(() => {
            if (seconds >= 1) {
                var newtime = seconds - 1;
                setSeconds(newtime)

                setHour(Math.floor(newtime / 3600));
                setMinute(Math.floor(newtime % 3600 / 60));
                setSecond(newtime % 60);
            };
            // if (seconds >= 1) { console.log(newtime) };


        }, 1000);
        return () => clearInterval(countDown);
    })

    return (
        <Flex alignItems={"center"} py={4} gap={1} justifyContent={"center"}>
            <Text fontSize={"md"} fontWeight={700}>
                Sale live
            </Text>

            <Text fontSize={"md"} fontWeight={"700"}>
                {hour >= 10 ? hour : '0' + hour}:{minute >= 10 ? minute : '0' + minute}:{second >= 10 ? second : '0' + second}
            </Text>
        </Flex>
    );
}

const StatusButton = ({ status, time }: { status: number, time: number }) => {
    if (status == 0) return (
        <>
            <Button leftIcon={<InfoIcon />} colorScheme='orange' variant='solid'>
                Up Coming
            </Button>
        </>
    );

    if (status == 1) return (
        <>
            <Button leftIcon={<InfoIcon />} colorScheme='green' variant='solid'>
                <Flex>
                    {/* <Box pl="2px">Sale Live </Box> */}
                    <Box>< CountDown time={time} /></Box>
                </Flex>
            </Button>
        </>
    )

    if (status == 2) return (
        <>
            <Button leftIcon={<InfoIcon />} colorScheme='gray' variant='solid'>
                Sale Ended
            </Button>
        </>
    )
}



export default function IDO() {
    const totalCET = 5000;
    const tokenForSale = 2500;
    const maxAllo = 500;
    const minAllo = 10;

    const [isLoading, setIsLoading] = useState();
    const [input, setInput] = useState(0);
    const [exceedAlert, setExceedAlert] = useState(false);

    const [status, setStatus] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isWL, setIsWL] = useState(false);
    const [maxAlloRemain, setMaxAlloRemain] = useState(0);

    const [totalCetDeposited, setTotalCETDeposited] = useState(0);
    const [userBalance, setUserBalance] = useState(0);
    const [userAmountForWithdrawl, setUserAmountForWithdrawl] = useState(0);
    const [userClaimed, setUserClaimed] = useState(0);

    const provider = new ethers.providers.JsonRpcProvider("https://testnet-rpc.coinex.net");
    const contract_instance = new ethers.Contract(contract_address, abi, provider);

    async function queryData() {
        const _provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const _signer = await _provider.getSigner();
        const addr = await _signer.getAddress();

        const currentBlock = await provider.getBlockNumber();
        const timestamp = (await provider.getBlock(currentBlock)).timestamp;

        const data = await contract_instance.query(addr);


        const _startTime = data[1].toNumber();
        const _duration = data[2].toNumber();
        const _wl = data[3]
        // const _userBalance = data[4].toBigInt();

        setTotalCETDeposited(data[0].div(BigNumber.from("1000000000000000000")).toNumber());
        setUserBalance(data[4].div(BigNumber.from("1000000000000000000")).toNumber());
        setUserClaimed(data[5].div(BigNumber.from("1000000000000000000")).toNumber())
        setUserAmountForWithdrawl(data[6].div(BigNumber.from("1000000000000000000")).toNumber())


        if (_startTime == 0) {
            setStatus(0);
        } else if (_startTime + _duration > timestamp) {
            setStatus(1);
            setDuration(_startTime + _duration - timestamp);
        } else {
            setStatus(2);
        }
        setIsWL(_wl);

    };

    async function Buy() {
        const _provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const _signer = await _provider.getSigner();
        const addr = await _signer.getAddress();


        const contract_instance = new ethers.Contract(contract_address, abi, _signer);

        if (input == 0) return;
        if (input > maxAlloRemain) {
            setExceedAlert(true);
            return;
        }

        try {
            await contract_instance.deposit({ value: ethers.utils.parseUnits(String(input), "ether") });
            await queryMaxAllo();
        } catch (error) {

        }


    }

    async function Claim() {
        const _provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const _signer = await _provider.getSigner();
        const addr = await _signer.getAddress();

        const contract_instance = new ethers.Contract(contract_address, abi, _signer);
        try {
            await contract_instance.claim();
        } catch (error) {

        }

        await queryData();

    }

    async function queryMaxAllo() {
        const _provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const _signer = await _provider.getSigner();
        const addr = await _signer.getAddress();

        const balance = await provider.getBalance(addr)
        const totalAlloRemain = totalCET - totalCetDeposited;
        const maxAlloUser = maxAllo - userBalance * 2;

        console.log(maxAlloUser)

        setMaxAlloRemain(Math.min.apply(null, [balance, totalAlloRemain, maxAlloUser]))
    }

    async function setMaxInput() {
        setExceedAlert(false);
        setInput(maxAlloRemain);
    }

    useEffect(() => {
        queryData();
        const refetch = setInterval(() => {
            queryData();
            queryMaxAllo();
        }, 2000);
        return () => clearInterval(refetch);
    })

    return (
        <>
            <Box
                p={{
                    base: 4,
                    md: 10,
                }}
            >
                <Box>
                    <Text textAlign={"center"} fontSize={"3xl"} pb={2} fontWeight="bold">
                        METAZ ICO
                    </Text>
                    <Box>
                        <Flex
                            display={{
                                md: "flex",
                                base: "block",
                            }}
                            justifyContent={"center"}
                            gap={10}
                        >
                            <Box>
                                <Box
                                    minW={{
                                        base: 300,
                                        md: 420,
                                    }}
                                    mb={10}
                                >
                                    <Box border="0.2em solid #24cccd" borderRadius={8} overflow="hidden">
                                        <Flex
                                            p={5}
                                            justifyContent={"space-between"}
                                            alignItems="center"
                                            background={"green.800"}
                                        >
                                            <Box>
                                                <Image
                                                    src="/assets/image/logo.png"
                                                    alt="METAZ"
                                                    width={50}
                                                    height={50}
                                                />
                                            </Box>
                                            <Box>
                                                {/* <Text fontSize={13} noOfLines={[1, 2]} overflow='true' style={{ width: "250px", }}>
                                                METAZ is a node staking mining pool
                                                on CSC (CoinEx Smart Chain).
                                            </Text> */}
                                                <StatusButton status={status} time={duration} />
                                            </Box>

                                        </Flex>
                                        <Box p={5}>
                                            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                <Box>Token Address</Box>
                                                <Link href="https://www.coinex.net/token/0x978C25c94Ea2cF39729BeE21D041b23f69e972Ac" target="_blank">
                                                    <Box color={"blue"}>0x978C25c94...3f69e972Ac</Box>
                                                </Link>
                                            </Flex>
                                            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                <Box>Token Name</Box>
                                                <Box>METAZ Finance</Box>
                                            </Flex>
                                            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                <Box>Token Symbol</Box>
                                                <Box>MTZ</Box>
                                            </Flex>

                                            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                <Box>Token for sale</Box>
                                                <Box>
                                                    {tokenForSale} MTZ
                                                </Box>
                                            </Flex>

                                            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                <Box>Total CET raise</Box>
                                                <Box>
                                                    {totalCET} CET
                                                </Box>
                                            </Flex>

                                            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                <Box>Min Buy</Box>
                                                <Box>
                                                    {minAllo} CET
                                                </Box>
                                            </Flex>

                                            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                <Box>Max Buy</Box>
                                                <Box>
                                                    {maxAllo} CET
                                                </Box>
                                            </Flex>

                                            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                <Box>Linear Vesting in</Box>
                                                <Box>
                                                    5 months
                                                </Box>
                                            </Flex>
                                            {/* <GroupAction /> */}

                                            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                <Text >Progress {(totalCetDeposited / totalCET * 100).toFixed(2)}%</Text>
                                            </Flex>
                                            <Progress hasStripe value={totalCetDeposited / totalCET * 100} />
                                            <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                <Box fontSize="10px" >{totalCetDeposited} CET</Box>
                                                <Box fontSize="10px">
                                                    {totalCET} CET
                                                </Box>
                                            </Flex>

                                            <Box >
                                                {/* <Box border="0.2em solid #24cccd" borderRadius={8} overflow="hidden"> */}
                                                <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                    <Box>You purchased</Box>
                                                    <Box>
                                                        {userBalance * 2} CET
                                                    </Box>
                                                </Flex>
                                                <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                    <Box>Your MTZ Remain </Box>
                                                    <Box>
                                                        {userBalance - userClaimed} MTZ
                                                    </Box>
                                                </Flex>
                                                <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                    <Box>Claimed </Box>
                                                    <Box>
                                                        {userClaimed} MTZ
                                                    </Box>
                                                </Flex>
                                                <Flex justifyContent={"space-between"} alignItems="center" pt={2} hidden={(status != 1)}>
                                                    <Box>
                                                        <InputGroup hidden={!isWL}>
                                                            <Input
                                                                placeholder='0.0'
                                                                type="number"
                                                                value={input}
                                                                onChange={(event) => {
                                                                    setInput(Number(event.target.value));
                                                                    setExceedAlert(false);
                                                                }} />
                                                            <InputRightElement width='4.5rem'>
                                                                <Button size='sm' onClick={setMaxInput} backgroundColor={"white!important"}>
                                                                    Max
                                                                </Button>
                                                            </InputRightElement>
                                                        </InputGroup>

                                                        <Text fontSize={11} color="red" hidden={!exceedAlert}>Allocation Exceed</Text>

                                                    </Box>

                                                    <Box>
                                                        <Button colorScheme='blue' variant='solid' onClick={Buy} disabled={!isWL} fontSize="12px" >
                                                            {isWL ? "Buy with CET" : "You are not in Whitelist"}
                                                        </Button>
                                                    </Box>
                                                </Flex>
                                                <Flex justifyContent={"space-between"} alignItems="center" pt={2}>
                                                    <Button colorScheme='blue' variant='solid' hidden={status != 2} isDisabled={userAmountForWithdrawl == 0} onClick={Claim}>
                                                        {userAmountForWithdrawl == 0 ? "0 MTZ for claim" : "Claim " + String(userAmountForWithdrawl) + " MTZ"}
                                                    </Button>
                                                </Flex>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Flex>
                    </Box>

                </Box >
                {/* <DetailValidator /> */}


            </Box >
            <Alert status='error' hidden={true}>
                <AlertIcon />
                <AlertTitle>Transaction Failed!</AlertTitle>
            </Alert>
        </>

    );
}
