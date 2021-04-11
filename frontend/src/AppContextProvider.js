import React from 'react';
import useCrud from './hooks/useCrud';

const AppContext = React.createContext({
    trips: []
  });

  //this should contained fetched data from the databaes.
  function AppContextProvider({ children }) {
    const {
      data: trips,
      isLoading: tripsLoading,
      create: createTrips,
      reFetch: refetchTrips,
      update: updateTrips,
      delete: deleteTrips
    } = useCrud('/api/trips', []);

    const context = {
      trips,
      tripsLoading,
      createTrips,
      refetchTrips,
      updateTrips,
      deleteTrips
    };

    return (
      <AppContext.Provider value={ context }>
        { children }
      </AppContext.Provider>
    );
  }
  
  export { AppContext, AppContextProvider };