import React from 'react';
import Navbar from './components/Navbar/Navbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Homepage from './pages/Homepage';
import TripDetailsPage from './pages/TripDetailsPage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navbar />
      <Switch>
        <Route path="/" exact>
          <Homepage />
        </Route>
        <Route path="/tripdetails">
          <TripDetailsPage />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
