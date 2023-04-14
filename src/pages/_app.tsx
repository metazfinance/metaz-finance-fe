import MainLayout from "@/layout/MainLayout";
import "@/styles/globals.css";
import { theme } from "@/themes/theme";
import { Web3Provider } from "@/web3Provider/web3Context";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useIsClient } from "usehooks-ts";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  const isClient = useIsClient();
  useEffect(() => {
    setReady(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      {ready ? (
        <Web3Provider>
          <QueryClientProvider client={new QueryClient()}>
            <ChakraProvider theme={theme}>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </ChakraProvider>
          </QueryClientProvider>
        </Web3Provider>
      ) : null}
    </>
  );
}
