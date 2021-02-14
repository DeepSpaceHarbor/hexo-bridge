import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AllPostsPage from "./post/AllPostsPage";
import PostEditorPage from "./post/PostEditorPage";
import AllPagesPage from "./page/AllPagesPage";
import PageEditorPage from "./page/PageEditorPage";
import HexoSettingsPage from "./settings/HexoSettingsPage";
import BridgeSettingsPage from "./settings/BridgeSettingsPage";
import ScaffoldsPage from "./settings/scaffolds/ScaffoldsPage";
import DiscoverPluginsPage from "./plugin/discover/DiscoverPluginsPage";
import InstalledPluginsPage from "./plugin/InstalledPluginsPage";
import ScriptsPage from "./plugin/ScriptsPage";
import InstalledThemesPage from "./theme/installed/InstalledThemesPage";
import DiscoverThemesPage from "./theme/discover/DiscoverThemesPage";
import ThemeSettingsPage from "./theme/ThemeSettingsPage";
import FileDirectoryPage from "./file/FileDirectoryPage";

function App() {
  return (
    <Router basename={"bridge"}>
      <Switch>
        <Route exact path={["/", `/post/all`]} component={AllPostsPage} />
        <Route exact path={["/post/edit/:id"]} component={PostEditorPage} />
        <Route exact path={["/page/all"]} component={AllPagesPage} />
        <Route exact path={["/page/edit/:id"]} component={PageEditorPage} />
        <Route exact path={["/setting/hexo"]} component={HexoSettingsPage} />
        <Route exact path={["/setting/bridge"]} component={BridgeSettingsPage} />
        <Route exact path={["/setting/scaffolds"]} component={ScaffoldsPage} />
        <Route exact path={["/plugin/discover"]} component={DiscoverPluginsPage} />
        <Route exact path={["/plugin/installed"]} component={InstalledPluginsPage} />
        <Route exact path={["/plugin/script"]} component={ScriptsPage} />
        <Route exact path={["/theme/installed"]} component={InstalledThemesPage} />
        <Route exact path={["/theme/discover"]} component={DiscoverThemesPage} />
        <Route exact path={["/theme/config"]} component={ThemeSettingsPage} />
        <Route exact path={["/file"]} component={FileDirectoryPage} />
      </Switch>
    </Router>
  );
}

export default App;
