import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Button} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';

const LogoutButton = () => {
  const { logout, user } = useAuth0();
  const { picture } = user;

  return (
      <>
      <Avatar src={picture} />
      <Button style={{color: 'white'}}
          onClick={() =>
              logout({
                returnTo: window.location.origin,
              })
          }
      >
        Log Out
      </Button>
      </>
  );
};

export default LogoutButton;