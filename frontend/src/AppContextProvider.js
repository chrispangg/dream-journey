import React from 'react';

const AppContext = React.createContext({
  user: null,
  trips: [],
  stays: [],
  activities: [],
});

//this should contained fetched data from the database.

export default AppContext;
