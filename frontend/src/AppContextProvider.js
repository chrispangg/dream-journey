import React from 'react';

const AppContext = React.createContext({
      mapConfig: {
            lat: -74.5,
            long: 40,
            zoom: 9,
      }
  });

  export default AppContext;