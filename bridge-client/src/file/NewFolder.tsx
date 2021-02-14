import React, { useState } from "react";
import folderIcon from "./icons/folder-small.png";
import { Button, Classes, Dialog, InputGroup, Intent } from "@blueprintjs/core";
import useAPI from "../shared/useAPI";
import { Notification } from "../shared/helpers/notification";

type NewFolderProps = {
  currentDir: string;
  separator: string;
};

export default function NewFolder({ currentDir, separator }: NewFolderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newDirectory, setNewDirectory] = useState("");

  const { execute: createFolder } = useAPI(
    {
      method: "POST",
      url: "assets/createDirectory",
      data: {
        directory: `${currentDir}${separator}${newDirectory}`,
      },
    },
    true
  );

  async function onCreate() {
    try {
      await createFolder();
      window.location.reload();
    } catch (error) {
      console.error("Cannot create new folder.", error);
      Notification.show({
        message: "Oh no, I can't create new folder 😟 ",
        intent: Intent.DANGER,
        icon: "delete",
      });
    }
  }

  return (
    <>
      <Button
        text="New folder"
        rightIcon={<img className={"center-horizontal"} src={folderIcon} alt="Create new folder" />}
        onClick={() => setIsOpen(true)}
      />
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        canOutsideClickClose={false}
        icon={<img className={"center-horizontal  padding-right"} src={folderIcon} alt="Create new folder" />}
        title="Create new folder"
      >
        <div className={Classes.DIALOG_BODY}>
          <p>Enter a name for the new folder:</p>
          <InputGroup
            leftIcon="folder-open"
            type="text"
            placeholder=""
            value={newDirectory}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNewDirectory(e.target.value);
            }}
            className="new-folder-reset-input-padding"
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <span className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Create folder" intent={Intent.PRIMARY} onClick={onCreate} />
          </span>
        </div>
      </Dialog>
    </>
  );
}
