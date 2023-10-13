import { IAnnotation } from "react-ace";
import { Alert, Callout, Dialog, Intent } from "@blueprintjs/core";
import React, { useEffect, useLayoutEffect, useState } from "react";
import useAPI from "../useAPI";
import CodeEditor from "@uiw/react-textarea-code-editor";

import * as frontMatterHelper from "hexo-front-matter";

type FrontMatterEditorProps = {
  value: string;
  onClose: (newMetadata: string) => void;
  isOpen: boolean;
};

export default function FrontMatterEditor({ value, onClose, isOpen }: FrontMatterEditorProps) {
  const [metaData, setMetadata] = useState("");
  const [errorMarker, setErrorMarker] = useState<IAnnotation>();
  const [canBeClosed, setCanBeClosed] = useState(true);
  useLayoutEffect(() => {
    setMetadata(value.trim());
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
      frontMatterHelper.parse(metaData, {});
      if (!metaData.trim().endsWith("---")) {
        setErrorMarker({
          row: metaData.split("\n").length - 1,
          column: 0,
          text: "Front matter must end with ---",
          type: "error",
        });
        return false;
      }
      setErrorMarker(undefined);
      return true;
    } catch (error: any) {
      setErrorMarker({
        row: error.mark.line,
        column: 0,
        text: error.message,
        type: "error",
      });
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
        style={{
          minWidth: "60%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "1fr",
            gridColumnGap: "0px",
            gridRowGap: "0px",
          }}
        >
          <CodeEditor
            value={metaData}
            language="yaml"
            placeholder="Please enter frontmatter in yaml format."
            onChange={(evn) => setMetadata(evn.target.value.trim())}
            padding={15}
            style={{
              fontSize: userPrefs.editorFontSize || 14,
              fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
            }}
          />
          <Callout
            title={errorMarker ? "Front matter contains errors." : "Front matter is valid."}
            intent={errorMarker ? Intent.DANGER : Intent.SUCCESS}
            icon={errorMarker ? "code" : "endorsed"}
            style={{
              width: "100%",
            }}
          >
            <CodeEditor
              value={errorMarker ? errorMarker?.text : metaData}
              disabled
              language="yaml"
              style={{
                fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              }}
            />
          </Callout>
        </div>
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
      </Dialog>
    </>
  );
}
