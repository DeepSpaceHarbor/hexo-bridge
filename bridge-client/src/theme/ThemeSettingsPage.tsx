import React from "react";
import Navigation from "../shared/components/Navigation";
import { AxiosRequestConfig } from "axios";
import NavigationTheme from "./NavigationTheme";
import YamlConfigEditor from "../shared/components/YamlConfigEditor";

//API Config
const getThemeConfig: AxiosRequestConfig = {
  method: "GET",
  url: "theme/getConfig",
};
const saveThemeConfig: AxiosRequestConfig = {
  method: "POST",
  url: "theme/saveConfig",
};

export default function ThemeSettingsPage() {
  return (
    <>
      <Navigation />
      <NavigationTheme />
      <YamlConfigEditor getContentConfig={getThemeConfig} saveContentConfig={saveThemeConfig} />
    </>
  );
}
