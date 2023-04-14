type TChildren = {
  children: React.ReactNode | JSX.Element;
};

type IAddress = `0x${string}`;

declare global {
  interface Window {
    window: {
      ethereum: any;
    };
  }
}
