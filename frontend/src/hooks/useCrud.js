import { useState, useEffect } from 'react';
import axios from 'axios';
import {useAuth0} from "@auth0/auth0-react";

export default function useCrud(baseURL, initialState = null, idProp = '_id') {
    const [data, setData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [version, setVersion] = useState(0);
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
          loginWithRedirect();
        }
        throw e;
      }
    }


  useEffect(() => {
        console.log("Calling useEffect in useCrud")
        const makeRequest = async () => {
            const accessToken = await getAccessToken();
            setIsLoading(true);
            var options = {
              method: 'GET',
              url: baseURL,
              headers: {authorization: `Bearer ${accessToken}`}
            };
            axios.request(options)
                .then(response => {
                  setIsLoading(false);
                  setData(response.data);
                })
                .catch(err => {
                  setIsLoading(false);
                  console.log("Error in useEffect: " + err);
                });
        }
    if (!authIsLoading) {
      makeRequest();
    }
    }, [baseURL, version, authIsLoading]);

    function reFetch() {
        setVersion(version + 1);
    }

    async function update(item) {
      const accessToken = await getAccessToken();
      var options = {
        method: 'PUT',
        url: `${baseURL}/${item[idProp]}`,
        data: item,
        headers: {authorization: `Bearer ${accessToken}`}
      };
        return axios.request(options)
                    .then(response => {
                        setData(data.map(eachData => eachData[idProp] === item[idProp] ? { ...eachData, ...item } : eachData));
                    })
                    .catch(err => console.log("Error in update: " + err));
    }

    async function create(item) {
      const accessToken = await getAccessToken();
      var options = {
        method: 'POST',
        url: baseURL,
        data: item,
        headers: {authorization: `Bearer ${accessToken}`}
      };
        return axios.request(options)
                    .then(response => {
                        const newItem = response.data;
                        setData([...data, newItem]);
                    })
                    .catch(err => console.log("Error in create: " + err));
    }

    async function deleteItem(id) {
      const accessToken = await getAccessToken();
      var options = {
        method: 'DELETE',
        url: `${baseURL}/${id}`,
        headers: {authorization: `Bearer ${accessToken}`}
      };
        return axios.request(options)
                    .then(response => {
                        setData(data.filter(item => item[idProp] !== id));
                    })
                    .catch(err => console.log("Error in delete: " + err));
    }

    return { data, isLoading, reFetch, update, create, deleteItem };
}