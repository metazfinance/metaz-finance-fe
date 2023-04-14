import { Provider } from "react-redux";
import { store } from "./store";

export const Web3Provider = ({ children }: any) => {
  return <Provider store={store}>{children}</Provider>;
};
