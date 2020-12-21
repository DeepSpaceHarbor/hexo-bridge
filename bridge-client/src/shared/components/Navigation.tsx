import React from 'react';
import {Alignment, AnchorButton, Button, Navbar} from "@blueprintjs/core";
import {Link, useLocation} from "react-router-dom";
import Logo from "../controll-panel.png"
import CreateNewPage from "../../page/CreateNewPage";
import CreateNewPost from "../../post/CreateNewPost";

export default function Navigation() {
    const location = useLocation();

    function getNewPageOrPost() {
        if (location.pathname.startsWith("/post")) {
            return <CreateNewPost/>
        }
        if (location.pathname.startsWith("/page")) {
            return <CreateNewPage/>
        }
        return <></>
    }

    return <> <Navbar className="navigation-bar">
        <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>
                <Link to="/post/all">
                    <img className="navigation-logo" src={Logo} alt="Bridge | hexo admin panel"/>
                </Link>
            </Navbar.Heading>
            <Link to="/post/all">
                <Button minimal icon="document" text="Posts" outlined={location.pathname === "/post/all" || location.pathname === "/"}/>
            </Link>
            <Link to="/page/all">
                <Button minimal icon="duplicate" text="Pages" outlined={location.pathname === "/page/all"}/>
            </Link>

            <AnchorButton href="/bridge/file?dir=files" minimal icon="folder-open" text="Files"
                          outlined={location.pathname.startsWith("/file")}/>

            <Link to="/theme/installed">
                <Button minimal icon="control" text="Theme" outlined={location.pathname.startsWith("/theme/")}/>
            </Link>
            <Link to="/plugin/installed">
                <Button minimal icon="console" text="Plugins" outlined={location.pathname.startsWith("/plugin/")}/>
            </Link>
            <Link to="/setting/hexo">
                <Button minimal icon="settings" text="Settings" outlined={location.pathname.startsWith("/setting/")}/>
            </Link>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
            {getNewPageOrPost()}
            <Navbar.Divider/>
            <AnchorButton href="/" minimal icon="share" text="My site" target="_blank"/>
        </Navbar.Group>
    </Navbar>
    </>


}