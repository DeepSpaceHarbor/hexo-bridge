import React, {useEffect, useState} from "react";
import {Button, Callout, ControlGroup, Intent, Spinner} from "@blueprintjs/core";
import GenericError from "./GenericError";
import {AxiosRequestConfig} from "axios";
import useAPI from "../useAPI";
import {Notification} from "../helpers/notification";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/mode-yaml";
import 'ace-builds/src-min-noconflict/ext-searchbox';


interface IYamlConfigEditorProps {
    getContentConfig: AxiosRequestConfig
    saveContentConfig: AxiosRequestConfig
}

const yamlValidation: AxiosRequestConfig = {
    method: 'POST',
    url: "settings/validateYaml",
}
const getUserPrefs: AxiosRequestConfig = {
    method: 'GET',
    url: 'settings/bridge/getAsJson'
}

export default function YamlConfigEditor(props: IYamlConfigEditorProps) {
    const {data: userPrefs} = useAPI(getUserPrefs);
    const {loading: isLoading, error, data: configData} = useAPI(props.getContentConfig);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [config, setConfig] = useState("");
    const {execute: saveConfig} = useAPI({
        ...props.saveContentConfig,
        data: {
            config: config
        }
    }, true)

    //Init
    useEffect(() => {
        setConfig(configData.config)
    }, [configData])

    //Setup yaml verification
    const {execute: verifyYaml} = useAPI({
        ...yamlValidation,
        data: {
            config: config
        }
    }, true)

    const [errorMarkers, setErrorMarkers] = useState([]);
    useEffect(() => {
        const validate = async () => {
            const res = await verifyYaml();
            // @ts-ignore
            if (res.data.error.length === 0) {
                setErrorMarkers([]);
            } else {
                // @ts-ignore

                setErrorMarkers([{
                    // @ts-ignore
                    row: res.data.error.mark.line,
                    // @ts-ignore
                    column: 0,
                    // @ts-ignore
                    text: res.data.error.message,
                    // @ts-ignore
                    type: 'error'
                }])
            }
        }
        validate();
        //eslint-disable-next-line
    }, [config])

    async function onSave() {
        try {
            await saveConfig();
            Notification.show({
                message: "The config has been saved! ",
                intent: Intent.SUCCESS,
                icon: "saved"
            });
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Unable to save config.", error);
            Notification.show({
                message: "Oh no, I can't save the config. 😟 ",
                intent: Intent.DANGER,
                icon: "delete"
            });
        }
    }

    function getCurrentState() {
        if (isLoading) {
            return <Spinner/>
        }
        if (error) {
            return <GenericError/>
        }
        return <>
            <ControlGroup style={{margin: "5px"}}>
                <Callout style={{maxWidth: "fit-content"}} icon="info-sign"><b>Filename:</b> {configData.fileName}
                </Callout>
                <span style={{flexGrow: 1}}/>
                <Button icon="floppy-disk" minimal text="Save"
                        disabled={!hasUnsavedChanges || errorMarkers.length !== 0}
                        onClick={onSave}
                />
            </ControlGroup>
            <AceEditor height="80vh" width="99vw" style={{margin: "5px"}}
                       mode="yaml" theme="xcode"
                       annotations={errorMarkers}
                       onChange={(newContent: string) => {
                           setConfig(newContent);
                           setHasUnsavedChanges(true);
                       }} value={config}
                       fontSize={userPrefs.editorFontSize || 14}
                       showPrintMargin={false}
                       editorProps={{$blockScrolling: true}}
            />
        </>
    }

    return getCurrentState();
}