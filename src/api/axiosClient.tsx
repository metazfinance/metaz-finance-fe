import axios from "axios";
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false,
});
export const getClient = (baseURL: string) => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 40000,
  });

  instance.interceptors.request.use(
    function (config: any) {
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.headers["Content-Type'"] = "application/json";

      // config.headers.apiKey = process.env.NEXT_PUBLIC_API_KEY;

      return { ...config };
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      return response.data;
    },
    async function (error) {
      if (error?.response?.status === 401) {
        // handleLogout()
      } else {
        return Promise.reject(error.response?.data);
      }
    }
  );

  return instance;
};

export const axiosClient = getClient("https://testapi2.click/");
