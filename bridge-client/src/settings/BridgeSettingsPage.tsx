import React from "react";
import Navigation from "../shared/components/Navigation";
import NavigationSettings from "./NavigationSettings";
import {AxiosRequestConfig} from "axios";
import YamlConfigEditor from "../shared/components/YamlConfigEditor";

//API Config
const getBridgeConfig: AxiosRequestConfig = {
    method: 'GET',
    url: "settings/bridge/get"
}
const saveBridgeConfig: AxiosRequestConfig = {
    method: 'POST',
    url: "settings/bridge/save"
}

export default function BridgeSettingsPage() {


    return <>
        <Navigation/>
        <NavigationSettings/>
        <YamlConfigEditor getContentConfig={getBridgeConfig} saveContentConfig={saveBridgeConfig}/>
    </>

}