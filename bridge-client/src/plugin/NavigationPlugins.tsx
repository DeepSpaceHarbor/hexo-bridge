import { Link, useLocation } from "react-router-dom";
import { Alignment, Button, Navbar } from "@blueprintjs/core";
import React from "react";

export default function NavigationPlugins() {
  const location = useLocation();
  return (
    <Navbar className="navigation-bar">
      <Navbar.Group align={Alignment.LEFT}>
        <Link to="/plugin/installed">
          <Button minimal icon="ring" text="Installed" outlined={location.pathname === "/plugin/installed"} />
        </Link>
        <Link to="/plugin/script">
          <Button minimal icon="code-block" text="Scripts" outlined={location.pathname === "/plugin/script"} />
        </Link>
        <Link to="/plugin/discover">
          <Button minimal icon="pulse" text="Discover" outlined={location.pathname === "/plugin/discover"} />
        </Link>
      </Navbar.Group>
    </Navbar>
  );
}
