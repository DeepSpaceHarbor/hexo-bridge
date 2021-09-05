import AceEditor, { IAnnotation } from "react-ace";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-min-noconflict/ext-searchbox";
import { Alert, Dialog, Intent } from "@blueprintjs/core";
import React, { useEffect, useLayoutEffect, useState } from "react";
import useAPI from "../useAPI";

const frontMatterHelper = require("hexo-front-matter");

type FrontMatterEditorProps = {
  value: string;
  onClose: (newMetadata: string) => void;
  isOpen: boolean;
};

export default function FrontMatterEditor({ value, onClose, isOpen }: FrontMatterEditorProps) {
  const [metaData, setMetadata] = useState("");
  const [errorMarkers, setErrorMarkers] = useState<IAnnotation[]>([]);
  const [canBeClosed, setCanBeClosed] = useState(true);
  useLayoutEffect(() => {
    setMetadata(value);
  }, [value]);

  useEffect(() => {
    validateFrontMatter();
    //eslint-disable-next-line
  }, [metaData]);

  const { data: userPrefs } = useAPI({
    method: "GET",
    url: "settings/bridge/getAsJson",
  });

  function validateFrontMatter(): boolean {
    try {
      frontMatterHelper.parse(metaData);
      if (!metaData.trim().endsWith("---")) {
        setErrorMarkers([
          {
            row: metaData.split("\n").length - 1,
            column: 0,
            text: "Front matter must end with ---",
            type: "error",
          },
        ]);
        return false;
      }
      setErrorMarkers([]);
      return true;
    } catch (error: any) {
      setErrorMarkers([
        {
          row: error.mark.line,
          column: 0,
          text: error.message,
          type: "error",
        },
      ]);
      return false;
    }
  }

  function onCloseEditor() {
    const isMetadataValid = validateFrontMatter();
    if (isMetadataValid) {
      setCanBeClosed(true);
      onClose(metaData);
    } else {
      setCanBeClosed(false);
    }
  }

  return (
    <>
      <Dialog
        icon="annotation"
        title="Front matter editor"
        isOpen={isOpen}
        canOutsideClickClose={false}
        onClose={onCloseEditor}
        style={{ width: "40vw" }}
      >
        <AceEditor
          height="50vh"
          width="fit-parent"
          style={{ marginBottom: "-12px" }}
          mode="yaml"
          theme="xcode"
          annotations={errorMarkers}
          onChange={(newContent: string) => {
            setMetadata(newContent.trim());
          }}
          value={metaData}
          fontSize={userPrefs.editorFontSize || 14}
          showPrintMargin={false}
          editorProps={{ $blockScrolling: true }}
        />
        <Alert
          isOpen={!canBeClosed}
          intent={Intent.PRIMARY}
          icon="error"
          confirmButtonText="Go back"
          cancelButtonText="Discard changes"
          onCancel={() => {
            setMetadata(value);
            setCanBeClosed(true);
            onClose(value);
          }}
          onConfirm={() => setCanBeClosed(true)}
        >
          <p>
            <b>Front matter contains errors.</b>
          </p>
          <p>You can go back and correct these errors, or discard the changes.</p>
        </Alert>
      </Dialog>{" "}
    </>
  );
}
