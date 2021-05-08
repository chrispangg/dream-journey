import { useState, useEffect } from 'react';
import useAccessToken from "./useAccessToken";
import sendRequestWithAuth from "../libs/requestLib";

/**
 * A custom hook which fetches data from the given URL. Includes functionality to determine
 * whether the data is still being loaded or not.
 */
export default function useGet(url, initialState = null) {
  const [data, setData] = useState(initialState);
  const [isLoading, setLoading] = useState(false);
  const [fetch, setFetch] = useState(false);
  const { getAccessToken } = useAccessToken();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const token = await getAccessToken();
      await sendRequestWithAuth('GET', url, null, token, setLoading, setData);
    }
    fetchData();
  }, [url, fetch]);

  const refetch = () => {
    setFetch(!fetch);
  };

  return { data, isLoading, refetch };
}
