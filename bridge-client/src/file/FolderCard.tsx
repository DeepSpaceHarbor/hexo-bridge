import React, {SyntheticEvent, useState} from "react";
import {IFileInfo} from "./types/types";
import {Alert, Button, Card, Divider, Icon, Intent} from "@blueprintjs/core";
import {Elevation} from "@blueprintjs/core/lib/esm/common/elevation";
import folderIcon from "./icons/folder.png";
import useAPI from "../shared/useAPI";
import {AxiosRequestConfig} from "axios";
import {Notification} from "../shared/helpers/notification";
import RenameItem from "./RenameItem";

const deleteFolderAPI: AxiosRequestConfig = {
    method: 'POST',
    url: "assets/deleteDirectory"
}

export default function FolderCard({file}: { file: IFileInfo }) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const {execute: deleteFolder} = useAPI({
        ...deleteFolderAPI,
        data: {
            directory: file.filePath
        }
    }, true)

    async function onDelete() {
        try {
            await deleteFolder();
            window.location.reload();
        } catch (error) {
            console.error("Unable to delete folder.", error);
            Notification.show({
                message: "Oh no, I can't delete the folder. 😟 ",
                intent: Intent.DANGER,
                icon: "delete"
            });
        }
    }

    return <> <Card className="margin" interactive elevation={Elevation.ZERO}
                    key={file.filePath}
                    onClick={() => {
                        window.location.href = `/bridge/file?dir=${file.filePath}`;
                    }}>
        <a href={`/bridge/file?dir=${file.filePath}`}>
            <b className="break-word">{file.name}</b>
        </a>
        <Divider/>
        <span className="file-info-container">
            <Icon icon={<img width={24} height={24} className="center-horizontal" src={folderIcon} alt="Folder"/>}/>
                                   <span style={{flexGrow: 1}}/>
                                   <RenameItem oldPath={file.filePath} name={file.name}/>
                                   <Button minimal rightIcon="delete"
                                           onClick={(e: React.MouseEvent) => {
                                               setShowDeleteAlert(true)
                                               e.stopPropagation();
                                           }}
                                   />
        </span>
    </Card>
        <Alert isOpen={showDeleteAlert} icon="trash" intent={Intent.DANGER}
               confirmButtonText="Delete" cancelButtonText="Cancel"
               canEscapeKeyCancel={true} canOutsideClickCancel={true}
               onCancel={(event: SyntheticEvent<HTMLElement, Event>) => {
                   setShowDeleteAlert(false);
                   event.stopPropagation();
               }
               }
               onConfirm={() => onDelete()}
        >
            <p>Are you sure that you want to permanently delete <b>{file.name}</b> and its contents? </p>
        </Alert>
    </>


}