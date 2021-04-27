import React from 'react';
import App from './App';
import { AppContextProvider } from './AppContextProvider';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth0ProviderWithHistory from './components/Auth/Auth0ProviderWithHistory';

ReactDOM.render(
  <AppContextProvider>
    <Router>
      <Auth0ProviderWithHistory>
        <App />
      </Auth0ProviderWithHistory>
    </Router>
  </AppContextProvider>,
  document.getElementById('root')
);
