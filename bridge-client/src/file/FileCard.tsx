import React, { SyntheticEvent, useState } from "react";
import { FileInfo } from "./types/types";
import { Alert, Button, Card, Divider, Elevation, Icon, Intent } from "@blueprintjs/core";
import getIconForFile from "./getIconForFile";
import { Notification } from "../index";
import { AxiosRequestConfig } from "axios";
import useAPI from "../shared/useAPI";
import RenameItem from "./RenameItem";
import { isImage } from "./fileTypeDetection/isImage";

const deleteFileAPI: AxiosRequestConfig = {
  method: "POST",
  url: "assets/deleteFile",
};

export default function FileCard({ file }: { file: FileInfo }) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { execute: deleteFile } = useAPI(
    {
      ...deleteFileAPI,
      data: {
        filePath: file.filePath,
      },
    },
    true
  );

  async function onDelete() {
    try {
      await deleteFile();
      window.location.reload();
    } catch (error) {
      console.error("Unable to delete this file.", error);
      Notification.show({
        message: "Oh no, I can't delete the file. 😟 ",
        intent: Intent.DANGER,
        icon: "delete",
      });
    }
  }

  return (
    <>
      {" "}
      <Card
        className="margin"
        interactive
        elevation={Elevation.ZERO}
        key={file.filePath}
        onClick={(e) => {
          let mdText = "";
          if (isImage(file.filePath)) {
            mdText = `![${file.name}](/${file.filePath})`;
          } else {
            mdText = `[${file.name}](/${file.filePath})`;
          }
          navigator.clipboard.writeText(mdText).then(() => {
            Notification.show({
              message: `Markdown code for ${file.name} has been copied to clipboard.`,
              intent: Intent.SUCCESS,
              icon: "clipboard",
              timeout: 2500,
            });
          });
        }}
      >
        <a href={`/${file.filePath}`} target="_blank" rel="noopener noreferrer">
          <b className="break-word">{file.name}</b>
        </a>
        <Divider />
        <span className="file-info-container">
          <Icon
            icon={
              <img width={24} height={24} className="center-horizontal" src={getIconForFile(file)} alt="File icon" />
            }
          />
          <span style={{ flexGrow: 1 }} />
          <RenameItem oldPath={file.filePath} name={file.name} />
          <Button
            minimal
            rightIcon="delete"
            onClick={(e: React.MouseEvent) => {
              setShowDeleteAlert(true);
              e.stopPropagation();
            }}
          />
        </span>
      </Card>
      <Alert
        isOpen={showDeleteAlert}
        icon="trash"
        intent={Intent.DANGER}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        canEscapeKeyCancel={true}
        canOutsideClickCancel={true}
        onCancel={(event: SyntheticEvent<HTMLElement, Event>) => {
          setShowDeleteAlert(false);
          event.stopPropagation();
        }}
        onConfirm={() => onDelete()}
      >
        <p>
          Are you sure that you want to permanently delete <b>{file.name}</b>?
        </p>
      </Alert>
    </>
  );
}
