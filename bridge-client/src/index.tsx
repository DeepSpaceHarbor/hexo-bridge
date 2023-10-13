import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "normalize.css/normalize.css";
import "@blueprintjs/core//lib/css/blueprint.css";

import "@blueprintjs/datetime2/lib/css/blueprint-datetime2.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { OverlayToaster, Position, Toaster } from "@blueprintjs/core";

const root = createRoot(document.getElementById("app")!);
root.render(
  <BrowserRouter basename={"bridge"}>
    <Routes>
      <Route index element={<AllPostsPage />} />
      <Route path="/" element={<AllPostsPage />} />
      <Route path={`post`} element={<AllPostsPage />} />
      <Route path={`post/edit/:id`} element={<PostEditorPage />} />
      <Route path={`post/all`} element={<AllPostsPage />} />
      <Route path={"/page/all"} element={<AllPagesPage />} />
      <Route path={"/page/edit/:id"} element={<PageEditorPage />} />
      <Route path={"/setting/hexo"} element={<HexoSettingsPage />} />
      <Route path={"/setting/bridge"} element={<BridgeSettingsPage />} />
      <Route path={"/setting/scaffolds"} element={<ScaffoldsPage />} />
      <Route path={"/plugin/discover"} element={<DiscoverPluginsPage />} />
      <Route path={"/plugin/installed"} element={<InstalledPluginsPage />} />
      <Route path={"/plugin/script"} element={<ScriptsPage />} />
      <Route path={"/theme/installed"} element={<InstalledThemesPage />} />
      <Route path={"/theme/discover"} element={<DiscoverThemesPage />} />
      <Route path={"/theme/config"} element={<ThemeSettingsPage />} />
      <Route path={"/file"} element={<FileDirectoryPage />} />
    </Routes>
  </BrowserRouter>
);

export let Notification = OverlayToaster.create({
  className: "toaster",
  position: Position.TOP,
});
