import React from "react";
import { Alignment, Button, Navbar } from "@blueprintjs/core";
import { Link, useLocation } from "react-router-dom";

export default function NavigationTheme() {
  const location = useLocation();
  return (
    <Navbar className="navigation-bar">
      <Navbar.Group align={Alignment.LEFT}>
        <Link to="/theme/installed">
          <Button minimal icon="ring" text="Installed" outlined={location.pathname === "/theme/installed"} />
        </Link>
        <Link to="/theme/config">
          <Button minimal icon="id-number" text="Settings" outlined={location.pathname === "/theme/config"} />
        </Link>

        <Link to="/theme/discover">
          <Button minimal icon="pulse" text="Discover" outlined={location.pathname === "/theme/discover"} />
        </Link>
      </Navbar.Group>
    </Navbar>
  );
}
