import React, { useState } from "react";
import { Button, Classes, Dialog, InputGroup } from "@blueprintjs/core";
import { Intent } from "@blueprintjs/core/lib/esm/common/intent";
import { AxiosRequestConfig } from "axios";
import useAPI from "../../shared/useAPI";
import { Notification } from "../../index";
import { scaffold } from "./types";

type RenameScaffoldProps = {
  selectedScaffold: scaffold;
  allScaffolds: [];
};

const renameScaffoldConfig: AxiosRequestConfig = {
  method: "POST",
  url: "scaffolds/rename",
};

export default function RenameScaffold({ selectedScaffold, allScaffolds }: RenameScaffoldProps) {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isNameTaken, setIsNameTaken] = useState(true);
  const [selectedName, setSelectedName] = useState(selectedScaffold.name);
  const { execute: renameScaffold } = useAPI(
    {
      ...renameScaffoldConfig,
      data: {
        name: selectedScaffold.name,
        newName: selectedName,
      },
    },
    true
  );

  async function onRename() {
    try {
      await renameScaffold();
      window.location.reload();
    } catch (error) {
      console.error("Unable to rename scaffold.", error);
      Notification.show({
        message: "Oh no, I can't rename the scaffold. 😟 ",
        intent: Intent.DANGER,
        icon: "delete",
      });
    }
  }

  return (
    <>
      <Button
        icon={"edit"}
        text={"Rename"}
        minimal
        onClick={() => setIsRenameModalOpen(true)}
        disabled={selectedScaffold.name === "post" || selectedScaffold.name === "page"}
      />
      <Dialog
        isOpen={isRenameModalOpen}
        title={"Rename scaffold"}
        canOutsideClickClose={false}
        onClose={() => setIsRenameModalOpen(false)}
      >
        <div className={Classes.DIALOG_BODY}>
          <InputGroup
            value={selectedName}
            onChange={(event: any) => {
              let newName = event.target.value;
              setSelectedName(newName);
              const search = allScaffolds.filter((scaffold: any) => scaffold.name === newName);
              if (search.length > 0 || newName.trim().length === 0) {
                setIsNameTaken(true);
              } else {
                setIsNameTaken(false);
              }
            }}
            fill
          />
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <span className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text={"Rename"} intent={Intent.PRIMARY} onClick={onRename} disabled={isNameTaken} />
          </span>
        </div>
      </Dialog>
    </>
  );
}
