import React, { useState } from "react";
import { Button, Dialog } from "@blueprintjs/core";
import uploadIcon from "../icons/upload.png";
import FileSelection from "./FileSelection";
import UploadStatus from "./UploadStatus";
import FileUpload from "./FileUpload";
import { UploadResults } from "./types/types";

enum UploadState {
  selection = "Selection",
  upload = "Upload",
  result = "Results",
}

export default function FileUploadModal({ currentLocation = "" }) {
  const [state, setState] = useState(UploadState.selection);
  const [selectedFilesQueue, setselectedFilesQueue] = useState<File[]>(new Array<File>());
  const [uploadResults, setUploadResults] = useState<UploadResults>({
    uploaded: 0,
    failed: 0,
    failedFiles: [],
  });
  const [isOpen, setIsOpen] = useState(false);

  function startUpload(toUpload: File[]) {
    setState(UploadState.upload);
    setselectedFilesQueue(toUpload);
  }

  function showResults(failedFiles: File[]) {
    const uploadedCount = selectedFilesQueue.length - failedFiles.length;
    const failedCount = failedFiles.length;
    setUploadResults({
      uploaded: uploadedCount,
      failed: failedCount,
      failedFiles: failedFiles,
    });
    setState(UploadState.result);
  }

  function getCurrentState() {
    if (state === UploadState.selection) {
      return <FileSelection currentLocation={currentLocation} uploadFiles={startUpload} />;
    }
    if (state === UploadState.upload) {
      return (
        <FileUpload currentLocation={currentLocation} selectedFiles={selectedFilesQueue} reportStatus={showResults} />
      );
    }
    if (state === UploadState.result) {
      return <UploadStatus result={uploadResults} />;
    }
  }

  return (
    <>
      <Button
        text="Add files"
        rightIcon={<img className={"center-horizontal"} src={uploadIcon} alt="Upload your files" />}
        onClick={() => setIsOpen(true)}
      />
      <Dialog
        isOpen={isOpen}
        onClose={() => {
          if (state === UploadState.result) {
            window.location.reload();
          } else {
            setIsOpen(false);
          }
        }}
        canOutsideClickClose={false}
        icon="folder-open"
        title="Upload your files"
        style={{ backgroundColor: "white" }}
      >
        {getCurrentState()}
      </Dialog>
    </>
  );
}
