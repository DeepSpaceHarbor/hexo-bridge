import { useEffect, useState } from "react";
import axios, { AxiosPromise, AxiosRequestConfig } from "axios";

const qs = require("qs");

export default function useAPI(
  requestConfig: AxiosRequestConfig,
  delayExecution = false
): { loading: boolean; error: any; data: any; execute: () => AxiosPromise } {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  async function executeRequest() {
    requestConfig.baseURL = "/api/";
    //Why urlencoded instead of json?
    //https://github.com/axios/axios/issues/1610#issuecomment-492564113
    requestConfig.data = qs.stringify(requestConfig.data);
    return axios(requestConfig);
  }

  useEffect(() => {
    if (!delayExecution) {
      const initiateRequest = async () => {
        try {
          setIsLoading(true);
          setError(null);
          setData([]);

          const res = await executeRequest();
          setData(res.data);
        } catch (error: any) {
          console.error("useAPI error.", error);
          setError(error);
        } finally {
          setIsLoading(false);
        }
      };
      initiateRequest();
    } // eslint-disable-next-line
  }, []);

  return { loading: isLoading, error: error, data: data, execute: executeRequest };
}
