import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AuthenticationButton from "../Auth/AuthenticationButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Travelmate
        </Typography>
        <Link style={{ textDecoration: 'none', color: 'white' }} to="/">
          <Button color="inherit">Home Page</Button>
        </Link>
        <Link
          style={{ textDecoration: 'none', color: 'white' }}
          to="/tripdetails"
        >
          <Button color="inherit">Trip Details Page</Button>
        </Link>
        <AuthenticationButton/>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
