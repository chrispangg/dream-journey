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
import AuthenticationButton from '../Auth/AuthenticationButton';

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
        <Link
          style={{ textDecoration: 'none', color: 'white' }}
          to="/"
          className={classes.title}
        >
          <Typography variant="h6">DreamJourney</Typography>
        </Link>
        <AuthenticationButton />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
