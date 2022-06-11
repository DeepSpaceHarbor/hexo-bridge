import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const qs = require("qs");

export default function useAPI(
  requestConfig: AxiosRequestConfig,
  delayExecution = false
): { loading: boolean; error: any; data: any; execute: () => Promise<AxiosResponse<any, any> | undefined> } {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  async function executeRequest() {
    requestConfig.baseURL = `${process.env.REACT_APP_API || ""}/api/`;
    //Why urlencoded instead of json?
    //https://github.com/axios/axios/issues/1610#issuecomment-492564113
    requestConfig.data = qs.stringify(requestConfig.data);
    try {
      setIsLoading(true);
      const res = await axios(requestConfig);
      setData(res.data);
      setError(null);
      return res;
    } catch (err: any) {
      console.error("useAPI error.", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!delayExecution) {
      executeRequest();
    } // eslint-disable-next-line
  }, []);

  return { loading: isLoading, error: error, data: data, execute: executeRequest };
}
