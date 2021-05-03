import {useEffect, useState} from "react";
import axios from "axios";
import {useAuth0} from "@auth0/auth0-react";

export default function useAccessToken () {
  const [accessToken, setAccessToken] = useState("");
  const {getAccessTokenSilently, loginWithRedirect} = useAuth0();
  const authIsLoading = useAuth0().isLoading;

  async function getAccessToken(){
    try {
      if (accessToken !== "") {
        return accessToken
      } else {
        const accessToken = await getAccessTokenSilently()
        setAccessToken(accessToken);
        return accessToken
      }
    } catch (e) {
      if (e.error === 'login_required' || e.error === 'consent_required') {
        await loginWithRedirect();
      }
      throw e;
    }
  }

  useEffect(() => {
    const makeRequest = async () => {
      const accessToken = await getAccessToken();
      setAccessToken(accessToken);
    }
    if (!authIsLoading) {
      makeRequest();
    }
  }, [authIsLoading]);

  return { getAccessToken }
}


