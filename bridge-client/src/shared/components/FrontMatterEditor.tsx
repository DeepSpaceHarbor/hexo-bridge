import React, { useLayoutEffect, useState } from "react";
import { Alert, Dialog, Intent } from "@blueprintjs/core";
import Editor from "@monaco-editor/react";
import useAPI from "../useAPI";
const frontMatterHelper = require("hexo-front-matter");

type FrontMatterEditorProps = {
  value: string;
  onClose: (newMetadata: string) => void;
  isOpen: boolean;
};

export default function FrontMatterEditor({ value, onClose, isOpen }: FrontMatterEditorProps) {
  const [metaData, setMetaData] = useState("");
  const [canBeClosed, setCanBeClosed] = useState(true);

  useLayoutEffect(() => {
    setMetaData(value);
  }, [value]);

  const { data: userPrefs } = useAPI({
    method: "GET",
    url: "settings/bridge/getAsJson",
  });

  function getErrorMarkers(content: string) {
    try {
      frontMatterHelper.parse(content);
      if (!content.trim().endsWith("---")) {
        return [
          {
            startLineNumber: content.split("\n").length - 1,
            endLineNumber: content.split("\n").length - 1,
            startColumn: 0,
            endColumn: 0,
            message: "Front matter must end with ---",
            severity: 8,
          },
        ];
      }
      return [];
    } catch (error: any) {
      return [
        {
          startLineNumber: error.mark.line + 1,
          endLineNumber: error.mark.line + 1,
          startColumn: error.mark.column + 1,
          endColumn: error.mark.column + 1,
          message: error.message,
          severity: 8,
        },
      ];
    }
  }

  function onCloseEditor() {
    const isMetadataValid = getErrorMarkers(metaData).length === 0;
    if (isMetadataValid) {
      setCanBeClosed(true);
      onClose(metaData);
    } else {
      setCanBeClosed(false);
    }
  }

  return (
    <Dialog
      icon="annotation"
      title="Front matter editor"
      isOpen={isOpen}
      canOutsideClickClose={false}
      onClose={onCloseEditor}
      style={{ width: "50vw" }}
    >
      <Editor
        width={"fit-parent"}
        height={"50vh"}
        language="yaml"
        defaultValue={metaData}
        options={{
          theme: "Xcode_default",
          minimap: { enabled: false },
          contextmenu: false,
          fontSize: userPrefs.editorFontSize || 14,
        }}
        onMount={function handleEditorDidMount(editor, monaco) {
          editor.onDidChangeModelContent((e) => {
            const newContent = editor.getValue();
            setMetaData(newContent);
            const errorMarkers = getErrorMarkers(newContent);
            monaco.editor.setModelMarkers(editor.getModel()!, "Bridge", [...errorMarkers]);
          });
        }}
      />
      <Alert
        isOpen={!canBeClosed}
        intent={Intent.PRIMARY}
        icon="error"
        confirmButtonText="Go back"
        cancelButtonText="Discard changes"
        onCancel={() => {
          setMetaData(value);
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
  );
}
