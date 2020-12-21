import React, {useState} from "react";
import {Alert, Button, Intent} from "@blueprintjs/core";
import IScaffold from "./IScaffold";
import {AxiosRequestConfig} from "axios";
import useAPI from "../../shared/useAPI";
import {Notification} from "../../shared/helpers/notification";

const deleteScaffoldConfig: AxiosRequestConfig = {
    method: 'POST',
    url: 'scaffolds/delete'
}

export default function DeleteScaffold({selectedScaffold}: { selectedScaffold: IScaffold }) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const {execute: deleteScaffold} = useAPI({
        ...deleteScaffoldConfig,
        data: {
            name: selectedScaffold.name
        }
    }, true);

    async function onDelete() {
        try {
            await deleteScaffold();
            window.location.reload();
        } catch (error) {
            console.error("Unable to delete scaffold.", error);
            Notification.show({
                message: "Oh no, I can't delete the scaffold. 😟 ",
                intent: Intent.DANGER,
                icon: "delete"
            });
        }
    }

    return <>
        <Button icon={"trash"} text={"Delete"} minimal
                disabled={selectedScaffold.name === "post" || selectedScaffold.name === "page"}
                onClick={() => setShowDeleteAlert(true)}
        />
        <Alert isOpen={showDeleteAlert} icon={"trash"} intent={Intent.DANGER}
               confirmButtonText={"Delete"} cancelButtonText={"Cancel"}
               onCancel={() => setShowDeleteAlert(false)}
               onConfirm={() => onDelete()}
        >
            <p>Are you sure that you want to permanently delete this scaffold? </p>
        </Alert>
    </>
}