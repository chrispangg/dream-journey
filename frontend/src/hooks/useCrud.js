import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCrud(baseURL, initialState = null, idProp = '_id') {
    const [data, setData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        axios.get(baseURL)
             .then(response => {
                 setIsLoading(false);
                 setData(response.data);
             })
             .catch(err => {
                 setIsLoading(false);
                 console.log("Error in useEffect: " + err);
             });
    }, [baseURL, version]);

    function reFetch() {
        setVersion(version + 1);
    }

    function update(item) {
        return axios.put(`${baseURL}/${item[idProp]}`, item)
                    .then(response => {
                        setData(data.map(eachData => eachData[idProp] === item[idProp] ? { ...eachData, ...item } : eachData));
                    })
                    .catch(err => console.log("Error in update: " + err));
    }

    function create(item) {
        return axios.post(baseURL, item)
                    .then(response => {
                        const newItem = response.data;
                        setData([...data, newItem]);
                    })
                    .catch(err => console.log("Error in create: " + err));
    }

    function deleteItem(id) {
        return axios.delete(`${baseURL}/${id}`)
                    .then(response => {
                        setData(data.filter(item => item[idProp] !== id));
                    })
                    .catch(err => console.log("Error in delete: " + err));
    }

    return { data, isLoading, reFetch, update, create, deleteItem };
}