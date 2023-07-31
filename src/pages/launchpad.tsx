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
    Span,
    Progress,
    Text,
    useDisclosure,
    Wrap,
    Center,
} from "@chakra-ui/react";
import { Badge, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, } from "@chakra-ui/react";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'
import Image from "next/image";

import { useState, useEffect } from "react";
import abi from '@/web3Config/abi/ico.json';
import {
    useGetAccount,
    useGetProvider,
    useGetSinger,
} from "@/web3Provider/hookStore/useGetProvider";

import AppBox from "@/components/AppBox";
import { useValidatorService } from "@/services/validatorServices";


import { ethers } from "ethers";
import { BigNumber } from "ethers";
import { min } from "lodash-es";

// 0xCBb5Bea2589d0f98C077977a080ee79C70aCE8Fc
// 0x978C25c94Ea2cF39729BeE21D041b23f69e972Ac mainnet
const contract_address = "0x28eeaB30479b2f48E88562aBa5aBdA9054272FE8";


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
                Start in 01/08/2023
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

const TxTab = () => {
    const data = ["0x2abAe215854a02EdC40166A474D01AFEbC1ac0B3", "0xF21e3bCd572dE116Ac9567B808e9bc1a8384Aa2A", "0xdE07a2F594a30456C1A4c6B9BF5027A6f3A6ebe9", "0x7E2A4224387CEff731Fd5BbcCe0ddC42e9115fdd", "0xF2a13d60638565954DaddF95b3D0F20A68f08874", "0x0bC09df9dEaaaFE1165c719Ef6219886E93495a3", "0x0496f150bF61C990e11c0c7D488c148a7248B62f", "0x6eB88996B030b622A9343E459A4aaD5c9039b850", "0x814ac52e2e6d60C3998688E6EE60784f0418045B", "0x0AF60e463D736A40Ad50233eF1a13570EFe3B763", "0x668cC3cb8AfCb876d0eA822D40669368c17b0849", "0x0d425E21974979dfD1c2502dB265c649A4cce7d1", "0x7afBF17BdB985DcF21c1B620e90fc3f6661FdB40", "0x5323EfC0B5efB138339eEB5b1Bf4a44a391177d5", "0x214F6aa977327a38A2eda30c546210e0C0384a8C", "0xe5c1A4c332383AA3af37f58Ee0a3f9C4e2A05A69", "0x8f0B83f339FDc9D3844cB1e4a51a0b66C319CDf9", "0x06B4446a2102ffBB395dd96EdcF34762d26D8f2F", "0xAA0AB0870aD24c9c9E7538E9edD889C12B647459", "0x7dcC5e3cF57B07e3794e7bB3118ebbF78A86c989", "0xA5eE8ca8693fAF00c34B30A49002dB190D307381", "0x4358f2F84ed68713A7dFb0600710530f053ca04B", "0xC7ef115A0AbC524113E3c72f0b9B02a832a9B98e", "0x04ac8516CA7D4977d6b55EacF3274b6a6A5179c5", "0x9cDBC98A47d0Cd7571F06EEDb468e0FC43b8dbC0", "0x9a97a9724090266E66d4D15e1b337CF22264a2f4", "0xA1747384b75332af11a9815253e170b5525f6f8d", "0x8127fAf1494C6f6f584516F51A5375E0dd9E4eD8", "0x2F7831c48Ba5170f41881a80DE09fa94aFA2A0B4", "0xF7245dd4854553Cd9c6B6Db0B19c550a1CdEd243", "0x91EB166afEed020948979E16bAF44D0fffCeC7D9", "0x35C6A223833aa6fBBC5a29142cA69f619AD7B9D2", "0x4d55f0a4CbCA289ECBf917a1bB90E1644F973552", "0x6F953156fb183c24f8f521955c3307545dC28431", "0x4c4bf3f983c71c0347f107E59e9BBF0D6444C7Cd", "0xA23cbE56C9864c0cC0D882EC947eCC16F1126075", "0x7EE379Cdac22340C13449316C4ef3bbFEB3c6f8C", "0xc6942F903F7Ead1b4add7E6DE527057e3B4350B2", "0x828d0Fbb69586F18Ee16bca5d92BC0D06Dbb6F47", "0x3C41a81ec09dE27A661ecB7c90468dF06A4eCa2f", "0xb62e42743511Bd791a783E2823A7915982da2413", "0x1262BAB409E5ad7659a399ecEAe7DDE795067D93", "0x814BB1889fF584c098C1fC28104EfAE97D83350a", "0x4cb340BDA443A40b562f5A24A8205a3F04822923", "0x76becAD5365288235e2FBBfd3cD6201D8920E75f", "0xbE2184Ef29B93e29f66E0502b000D8322D9a4e80", "0xEaF1bcf2A09215C076E98415CB81db736713Fd17", "0xA1f426d5d2b93ee5035976a0689393b1E7d3161E", "0xfEeB5d2866d561adAa59Ad7f6837ac6dBc5Bcf2b", "0x967310cD694Cd228898dFB428D2dD7798b69fb7f", "0xD6726EA03d096Ea378beC4066C173d9Fc39E918E", "0x559604318a993d910c2B6CB0b98BA670Bc4E2026", "0xC254D7233f05a40467B23045dE35092E20D65949", "0x01935450d221f0151B31C6e62534fc911725b5AD", "0x06E0D5B1Cd49eACe23d4cC38624c02898F5232ba", "0xCfc2463AeE6F5100117c9bEab253d075faDFb58E", "0x75c4B27b804A6ee39a37Ee6430669074cbd85f8A", "0xB52A901C012f0eFEF55C0fe32032383d813EC601", "0x8e6D0Ca11037b6a9e3dFe237DC888E24C19f8208", "0xD5E058Fb15A93f8C2544e8A08B72e841108bbb90", "0xCfC86a03E54fDAfD3B4C2bb002A6411dd18edb50", "0x1D6c819698db898b3d2989ACE3617d227A5d0799", "0x80915C87d35DEa2A50D6376201893AaCf1841524", "0xD9e49B3ed59C4BB8AB65bAB455F24647719ea620", "0x0Ac3110DF817D892B439F8A9ea371ba603D9028a", "0x732fD6B239DeeFd66a95077B1FE492e0052Ed620", "0x758b551229C96af7E3A9c8b90565e3e666B86D28", "0x1A14D07e4acbabDB28b7c20C32A5706c03bD1039", "0xbeAeaCd8962B9abDf52378B61e9a07BA3F19a4c1", "0xA7F581eE97bBf568ECC63dcCD2D30B09CA708488", "0xD308083387c79d699369B2Ea582Cf51C95245Eca", "0x55Fd27feFF2f7ea2FB52E25B0151b87e9D1E97C7", "0x6B357D0587Cc92975B91B400Cc77Ab783cD0f899", "0x3Fe172caC6A2E683F987C340A6997E1dE277016c", "0x065E3297c2cc9735027Fe717E7fe4467078915C0", "0xF89953cD51d64Ab7378BA940FE78CA63bDCe8c8c", "0x68045296D6FaCadB1bedb683401264590f9b503B", "0x0d425E21974979dfD1c2502dB265c649A4cce7d1", "0xF21e3bCd572dE116Ac9567B808e9bc1a8384Aa2A", "0x2A83eD6f6a66A617d91e894BB7f930Ef1ecCb983", "0x7E2A4224387CEff731Fd5BbcCe0ddC42e9115fdd", "0x7afBF17BdB985DcF21c1B620e90fc3f6661FdB40", "0x8f0B83f339FDc9D3844cB1e4a51a0b66C319CDf9", "0xF2a13d60638565954DaddF95b3D0F20A68f08874", "0xA5eE8ca8693fAF00c34B30A49002dB190D307381", "0xAA0AB0870aD24c9c9E7538E9edD889C12B647459", "0x2abAe215854a02EdC40166A474D01AFEbC1ac0B3", "0x214F6aa977327a38A2eda30c546210e0C0384a8C", "0x810c7b03a867D124bCaccFd1D08bF00d836bfA9C", "0xBc3E2aE58C21A8c85e3718ca6C070387DB49fbeF", "0xf6e61941428EF5bD5DaE3C4e6e866e2f484B8c87", "0xab631F0BCA1e0539ec73Ed87314121670B20BaB7", "0x7E183fBBf70158075eD8E0976Fd5B303fb3bA68b", "0x4CFD46A2224bcb3E080d9079573dceCEA7942E4D", "0xf3f6a35E75DF82559b050CcCAf7FB6C3Db32B00d", "0xbc9e842A458dC2446c223c60BD164d2FC6D8Eb8A", "0xb5A18750A8Be122FA708feD238bDa0403c6E9994", "0xcf936A19DE97401C5280AE440520F707ED94eB01", "0xDa66357E6EA63C8EBe62944B15969A1c0f4cc10b", "0x4f09D8284B11C5fE6340D4b79D78F4b2384c3E2e", "0x7E75798c5054f6F6bE640e520b9b838649099D0b", "0x21eAB05461f19763C053486603D8C8aB74f2E9A5", "0x3172f454A2A5FF943D7118248A780c3Af9DBb89e", "0x4675c52E4b2152Dc6Da54f5F96728D70723f8304", "0xCB67D6E17bF60F160B592897584d213eAB702685", "0x6De82D04605874924C451121612034b7Adae8F65", "0xC8eB21Ae565E7d27c5592D55F1e58676FD469301", "0x680303e972DD80ba851968dDeDd2fB80683D8A0B", "0xE0298a349960DF7585c1c51b30337CdAC93b446a", "0x0AF60e463D736A40Ad50233eF1a13570EFe3B763", "0x814ac52e2e6d60C3998688E6EE60784f0418045B", "0x5323EfC0B5efB138339eEB5b1Bf4a44a391177d5", "0xA031B6c360A850C766A4047EA3764bcbc679C441", "0x668cC3cb8AfCb876d0eA822D40669368c17b0849", "0xdE07a2F594a30456C1A4c6B9BF5027A6f3A6ebe9", "0x7E5122f0F7259d522332821154f16C8Efb85eb28", "0xb85d3f8DEcF90822298d2852a05AB43d66D4C433", "0x20e1D511Ae2cD8C53d682D739E297792Ca3C7e14", "0x5FfB6cfaF408C6c551f5439EFBE0805e448EF5FB", "0x20e1D511Ae2cD8C53d682D739E297792Ca3C7e14"];

    return (
        <div id="whitelist" style={{ display: "flex", justifyContent: "center" }}>
            <Box
                my={6}
                borderRadius={8}
                bg="gray.900"
                p={5}
                boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
                width={[375, 450]}
            >
                <Text fontWeight={"bold"}>
                    Whitelist addresses
                </Text>
                <TableContainer
                    sx={{
                        fontSize: 12,
                    }}
                >
                    <Table variant="striped" colorScheme="teal">
                        <Thead>
                            <Tr>
                                <Th>ID</Th>
                                <Th>Address</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data &&
                                data.map(
                                    (currElement, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>{index + 1}</Td>
                                                <Td>{currElement}</Td>
                                            </Tr>
                                        );
                                    }
                                )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </div>

    );
};


export default function IDO() {
    const totalCET = 700000 * 2;
    const tokenForSale = 700000;
    const maxAllo = 50000;
    const minAllo = 1000;

    // const totalCET = 2500 * 2;
    // const tokenForSale = 2500;
    // const maxAllo = 500;
    // const minAllo = 10;


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
    const [timeToNextClaim, setTimeToNextClaim] = useState(0);


    // const provider = new ethers.providers.JsonRpcProvider("https://testnet-rpc.coinex.net");
    const provider = new ethers.providers.JsonRpcProvider("https://rpc3.coinex.net");
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

        // console.log(maxAlloUser)

        setMaxAlloRemain(Math.min.apply(null, [balance, totalAlloRemain, maxAlloUser]))
    }

    async function queryTimeToNextClaim() {
        const _provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const _signer = await _provider.getSigner();
        const addr = await _signer.getAddress();

        const currentBlock = await provider.getBlockNumber();
        const timestamp = (await provider.getBlock(currentBlock)).timestamp;

        let startTime = await contract_instance.startTime();
        let duration = await contract_instance.duration();

        startTime = startTime.toNumber();
        duration = duration.toNumber();

        // console.log(maxAlloUser)
        const _30days = 3600 * 24 * 30;
        setTimeToNextClaim(30 - Math.floor((timestamp - startTime - duration) / 24 / 3600 % 30));
        // console.log(timestamp);
        // console.log(startTime);
        // console.log(duration);
    }

    async function setMaxInput() {
        setExceedAlert(false);
        setInput(maxAlloRemain);
    }

    useEffect(() => {
        queryData();
        queryTimeToNextClaim();
        const refetch = setInterval(() => {
            queryData();
            queryMaxAllo();
        }, 2000);
        return () => clearInterval(refetch);
    },)

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
                        METAZ Launchpad
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
                                                        {userBalance - userClaimed == 0 ? "0 MTZ remain" : userAmountForWithdrawl == 0 ? "Next claim in " + (timeToNextClaim.toString()) + " days" : "Claim " + String(userAmountForWithdrawl) + " MTZ"}
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
            <TxTab></TxTab>




            {/* 
            <Alert status='error' hidden={true}>
                <AlertIcon />
                <AlertTitle>Transaction Failed!</AlertTitle>
            </Alert> */}
        </>

    );
}
