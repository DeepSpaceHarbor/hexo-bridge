import React, {useState} from "react";
import {Button, Classes, Dialog, InputGroup} from "@blueprintjs/core";
import IScaffold from "./IScaffold";
import {Intent} from "@blueprintjs/core/lib/esm/common/intent";
import {AxiosRequestConfig} from "axios";
import useAPI from "../../shared/useAPI";
import {Notification} from "../../shared/helpers/notification";

const createScaffoldConfig: AxiosRequestConfig = {
    method: 'POST',
    url: 'scaffolds/create'
}

export default function NewScaffold({allScaffolds}: { allScaffolds: IScaffold[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedName, setSelectedName] = useState("");
    const [isNameTaken, setIsNameTaken] = useState(true);
    const {execute: createScaffold} = useAPI({
        ...createScaffoldConfig,
        data: {
            name: selectedName
        }
    }, true)

    async function onCreate() {
        try {
            await createScaffold();
            window.location.reload();
        } catch (error) {
            console.error("Unable to create scaffold.", error);
            Notification.show({
                message: "Oh no, I can't create new scaffold. 😟 ",
                intent: Intent.DANGER,
                icon: "delete"
            });
        }
    }

    return <>
        <Button icon={"insert"} minimal text={"New"} onClick={() => setIsOpen(true)}/>
        <Dialog isOpen={isOpen} title={"Create new scaffold"} canOutsideClickClose={false}
                onClose={() => setIsOpen(false)}
                icon="insert"
        >
            <div className={Classes.DIALOG_BODY}>
                <p>Enter a name for the new scaffold:</p>
                <InputGroup value={selectedName}
                            placeholder="<Insert scaffold name>"
                            onChange={(event: any) => {
                                let newName = event.target.value;
                                setSelectedName(newName)
                                const search = allScaffolds.filter((scaffold: any) => scaffold.name === newName)
                                if (search.length > 0 || newName.trim().length === 0) {
                                    setIsNameTaken(true);
                                } else {
                                    setIsNameTaken(false);
                                }
                            }}
                            fill/>
            </div>

            <div className={Classes.DIALOG_FOOTER}>
        <span className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text={"Create"} intent={Intent.PRIMARY} onClick={onCreate} disabled={isNameTaken}/>
        </span>
            </div>
        </Dialog>
    </>
}