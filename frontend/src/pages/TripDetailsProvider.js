import React from 'react';
import useGet from '../hooks/useGet';
import axios from 'axios';

const TripDetailsContext = React.createContext({
  stays: [],
  activities: [],
});

function TripDetailsContextProvider({ children }) {
  // Set up the app to fetch stays from a REST API
  const { data: stays, isLoading: isStaysLoading, refetch } = useGet('/api/stays', []);

  let geocoderRef = 'aaa';

  function setGeocoderRef(ref) {
    geocoderRef = ref;
    console.log(geocoderRef);
  }

  async function addStay(stay) {
    await axios.post('/api/stays', stay);
    refetch();
  }

  async function deleteStay(stayId) {
    await axios.delete(`/api/stays/${stayId}`);
    refetch();
  }

  async function updateStay(stay) {
    await axios.put(`/api/stays/${stay._id}`, stay);
    refetch();
  }

  // The context value that will be supplied to any descendants of this component.
  const context = {
    geocoderRef,
    setGeocoderRef,
    stays,
    isStaysLoading,
    addStay,
    deleteStay,
    updateStay,
  };

  // Wraps the given child components in a Provider for the above context.
  return <TripDetailsContext.Provider value={context}>{children}</TripDetailsContext.Provider>;
}

export { TripDetailsContext, TripDetailsContextProvider };
