import { axiosClient } from "./axiosClient";

export const validatorApi = {
  async getDetailValidator(): Promise<any> {
    const res = await axiosClient.get('/');
    return res.data;
  },
};
