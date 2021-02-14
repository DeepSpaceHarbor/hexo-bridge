import React from "react";
import Navigation from "../shared/components/Navigation";
import NavigationSettings from "./NavigationSettings";
import { AxiosRequestConfig } from "axios";
import YamlConfigEditor from "../shared/components/YamlConfigEditor";

//API Config
const getHexoConfig: AxiosRequestConfig = {
  method: "GET",
  url: "settings/hexo/get",
};
const saveHexoConfig: AxiosRequestConfig = {
  method: "POST",
  url: "settings/hexo/save",
};

export default function HexoSettingsPage() {
  return (
    <>
      <Navigation />
      <NavigationSettings />
      <YamlConfigEditor getContentConfig={getHexoConfig} saveContentConfig={saveHexoConfig} />
    </>
  );
}
