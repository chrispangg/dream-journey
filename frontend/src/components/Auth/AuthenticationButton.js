import React from "react";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

import { useAuth0 } from "@auth0/auth0-react";

const AuthenticationButton = () => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  console.log("isAuthenticated: ",isAuthenticated)
  console.log("isLoading", isLoading)

  if (isLoading) {
    return <span>Loading!</span>
  }



  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

export default AuthenticationButton;