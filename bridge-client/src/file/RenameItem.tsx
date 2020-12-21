import React, {useState} from "react";
import {Button, Classes, Dialog, InputGroup, Intent} from "@blueprintjs/core";
import useAPI from "../shared/useAPI";
import {Notification} from "../shared/helpers/notification";

interface IRenameItemInfo {
    oldPath: string,
    name: string
}

export default function RenameItem({oldPath, name}: IRenameItemInfo) {
    const [isOpen, setIsOpen] = useState(false);
    const [newPath, setNewPath] = useState(oldPath);

    const {execute: renameItem} = useAPI({
        method: 'POST',
        url: "assets/rename",
        data: {
            oldPath: oldPath,
            newPath: newPath
        }
    }, true);

    async function onRename() {
        try {
            await renameItem();
            window.location.reload();
        } catch (error) {
            console.error("Cannot complete rename action.", error);
            Notification.show({
                message: `Oh no, I can't rename ${name}  😟 `,
                intent: Intent.DANGER,
                icon: "delete"
            });

        }
    }

    return <span onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
    }
    }> <Button minimal rightIcon="new-link"
               onClick={(e: React.MouseEvent) => {
                   setIsOpen(true)
               }}
    />
        <Dialog isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                canOutsideClickClose={false}
                icon="new-link"
                title={`Move or rename: ${name}`}>
            <div className={Classes.DIALOG_BODY}>
                <p>Enter the new path:</p>
                <InputGroup leftIcon="folder-open"
                            type="text"
                            placeholder=""
                            value={newPath}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setNewPath(e.target.value);
                            }}
                            className="new-folder-reset-input-padding"
                />
            </div>
            <div className={Classes.DIALOG_FOOTER}>
        <span className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Save" intent={Intent.PRIMARY} onClick={onRename}/>
        </span>
            </div>
        </Dialog>

    </span>
}