import React, {useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import useAPI from "../shared/useAPI";
import {Alert, AnchorButton, Button, ButtonGroup, Intent, Popover} from "@blueprintjs/core";
import {Notification} from "../shared/helpers/notification";
import {AxiosRequestConfig} from "axios";
import {RouteParams} from "../shared/types/router";

//API Config
const getSinglePageAPI: AxiosRequestConfig = {
    method: 'POST',
    url: "pages/getSingle"
}

const deletePageAPI: AxiosRequestConfig = {
    method: 'POST',
    url: "pages/delete"
}

export default function PageEditorActionDropdown({savePage}: { savePage: () => void }) {
    let {id} = useParams<RouteParams>();
    let history = useHistory();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const {loading: isLoading, data: page} = useAPI({
        ...getSinglePageAPI,
        data: {
            id: id
        }
    })

    //Delete post
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const {execute: deletePage} = useAPI({
        ...deletePageAPI,
        data: {
            id: id
        }
    }, true)

    async function onDelete() {
        try {
            await deletePage();
            history.push("/page/all");
            window.location.reload();
        } catch (error) {
            console.error("Unable to delete page.", error);
            Notification.show({message: "Oh no, I can't delete the page. 😟 ", intent: Intent.DANGER, icon: "delete"});
        }
    }

    function getCurrentState() {
        if (isLoading) {
            return <></>
        }
        return <>
            <AnchorButton icon="share" text="Preview"
                          href={`/${page.path}`}
                          target="_blank" rel="noopener noreferrer"/>
            <Popover position="bottom" minimal>
                <Button icon="caret-down" onClick={() => setIsDropdownOpen(!isDropdownOpen)}/>
                <ButtonGroup minimal vertical>
                    <Button icon="trash" text="Delete"
                            onClick={() => {
                                setShowDeleteAlert(true);
                            }}/>
                </ButtonGroup>
            </Popover>
            <Alert isOpen={showDeleteAlert} icon="trash" intent={Intent.DANGER}
                   confirmButtonText="Delete" cancelButtonText="Cancel"
                   onOpened={() => setIsDropdownOpen(false)}
                   onCancel={() => setShowDeleteAlert(false)}
                   onConfirm={() => onDelete()}
            >
                <p>Are you sure that you want to permanently delete this page? </p>
            </Alert>
        </>

    }

    return getCurrentState();
}