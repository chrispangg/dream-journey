import React from 'react';
import App from './App';
import { AppContextProvider } from './AppContextProvider';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth0ProviderWithHistory from './components/Auth/Auth0ProviderWithHistory';

ReactDOM.render(
    <Auth0ProviderWithHistory>
      <AppContextProvider>
       <Router>
        <App />
       </Router>
      </AppContextProvider>
    </Auth0ProviderWithHistory>,
  document.getElementById('root')
);
