import React from "react";
import { UploadResults } from "./types/types";
import { Callout, Classes, Tag } from "@blueprintjs/core";

export default function UploadStatus({ result }: { result: UploadResults }) {
  function getFailures() {
    if (result.failed > 0) {
      return (
        <>
          <Callout
            title={`${result.failed} ${result.failed === 1 ? "file has " : "files have"} failed.`}
            icon="cross"
            intent="danger"
          >
            {result.failedFiles.map((file: File) => {
              return (
                <Tag interactive minimal key={file.name} style={{ margin: "5px" }}>
                  {file.name}
                </Tag>
              );
            })}
          </Callout>
        </>
      );
    }
    return <></>;
  }

  return (
    <>
      <div className={Classes.DIALOG_BODY}>
        <Callout
          title={`${result.uploaded} ${result.uploaded === 1 ? "file has " : "files have"} been uploaded.`}
          icon="tick-circle"
        />
        {getFailures()}
      </div>
    </>
  );
}
