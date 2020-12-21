import React from "react";
import {Alignment, Button, Navbar} from "@blueprintjs/core";
import {Link, useLocation} from "react-router-dom";
import Logo from "../shared/controll-panel.png";
import HexoLogo from "../shared/hexo-logo-avatar.svg";

export default function NavigationSettings() {
    const location = useLocation();
    return <Navbar className={"navigation-bar"}>
        <Navbar.Group align={Alignment.LEFT}>
            <Link to="/setting/hexo">
                <Button minimal icon={<img className="navigation-logo" src={HexoLogo} width="20" height="20"
                                           alt={"Hexo logo"}/>} text="Hexo"
                        outlined={location.pathname === "/setting/hexo"}/>
            </Link>
            <Link to="/setting/bridge">
                <Button minimal icon={<img className="navigation-logo" src={Logo} width="20" height="20"
                                           alt={"Bridge logo"}/>} text="Bridge"
                        outlined={location.pathname === "/setting/bridge"}/>
            </Link>
            <Navbar.Divider/>
            <Link to="/setting/scaffolds">
                <Button minimal icon="applications" text="Scaffolds"
                        outlined={location.pathname === "/setting/scaffolds"}/>
            </Link>
        </Navbar.Group>
    </Navbar>
}
