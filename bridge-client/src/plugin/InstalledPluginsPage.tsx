import Navigation from "../shared/components/Navigation";
import React from "react";
import NavigationPlugins from "./NavigationPlugins";
import {HTMLTable, Spinner} from "@blueprintjs/core";
import {AxiosRequestConfig} from "axios";
import useAPI from "../shared/useAPI";
import GenericError from "../shared/components/GenericError";
import {InstalledPlugin} from "./types/types";

const installedAddonsAPI: AxiosRequestConfig = {
    method: 'GET',
    url: 'plugins/getInstalled'
}

export default function InstalledPluginsPage() {
    const {loading: isLoading, error, data: allAddons} = useAPI(installedAddonsAPI);

    function getCurrentState() {
        if (isLoading) {
            return <Spinner/>
        }
        if (error) {
            return <GenericError/>
        }

        return <>
            <HTMLTable className="table" interactive>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Version</th>
                </tr>
                </thead>
                <tbody>
                {
                    allAddons.map((plugin: InstalledPlugin) => {
                        return <tr key={plugin.name}>
                            {plugin.link ?
                                <td><a target="_blank" rel="noopener noreferrer" href={plugin.link}>{plugin.name}</a>
                                </td> : <td>{plugin.name}</td>}
                            <td>{plugin.description}</td>
                            <td>{plugin.version}</td>
                        </tr>
                    })
                }

                </tbody>
            </HTMLTable>
        </>
    }

    return <>
        <Navigation/>
        <NavigationPlugins/>
        {getCurrentState()}
    </>

}