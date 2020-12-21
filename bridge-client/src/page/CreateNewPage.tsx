import React, {useState} from "react";
import {Button, Classes, Dialog, InputGroup, Intent} from "@blueprintjs/core";
import useAPI from "../shared/useAPI";
import {Notification} from "../shared/helpers/notification";
import {useHistory} from "react-router-dom";

export default function CreateNewPage() {
    let history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState("");
    const {execute: createPage} = useAPI({
        method: 'POST',
        url: "pages/create",
        data: {
            title: pageTitle,
        }
    }, true);

    async function onCreate() {
        try {
            const res = await createPage();
            // @ts-ignore
            history.push(`/page/edit/${res.data._id}`);
            window.location.reload();
        } catch (error) {
            console.error("Cannot create new page.", error);
            Notification.show({
                message: "Oh no, I can't create new page 😟 ",
                intent: Intent.DANGER,
                icon: "delete"
            });

        }
    }

    return <>
        <Button minimal icon="insert" text="New page"
                onClick={() => setIsOpen(true)}/>
        <Dialog isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                canOutsideClickClose={false}
                icon="insert"
                title="Create new page">
            <div className={Classes.DIALOG_BODY}>
                <p>Enter a name for the new page:</p>
                <InputGroup leftIcon="duplicate" placeholder="<Insert page name>"
                            value={pageTitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setPageTitle(e.target.value);
                            }}
                />
            </div>
            <div className={Classes.DIALOG_FOOTER}>
        <span className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Create page" intent={Intent.PRIMARY} onClick={onCreate}/>
        </span>
            </div>
        </Dialog>
    </>
}