import { Alert, Dialog, Intent } from "@blueprintjs/core";
import { useEffect, useLayoutEffect, useState } from "react";
import useAPI from "../useAPI";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { StreamLanguage } from "@codemirror/language";
import { linter, Diagnostic, lintGutter } from "@codemirror/lint";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import * as frontMatterHelper from "hexo-front-matter";

type FrontMatterEditorProps = {
  value: string;
  onClose: (newMetadata: string) => void;
  isOpen: boolean;
};

export default function FrontMatterEditor({ value, onClose, isOpen }: FrontMatterEditorProps) {
  const [metaData, setMetadata] = useState("");
  const [errorMarker, setErrorMarker] = useState<Diagnostic>();
  const [canBeClosed, setCanBeClosed] = useState(true);
  useLayoutEffect(() => {
    setMetadata(value.trim());
  }, [value]);

  useEffect(() => {
    validateFrontMatter();
    //eslint-disable-next-line
  }, [metaData]);

  const { data: userPreferences } = useAPI({
    method: "GET",
    url: "settings/bridge/getAsJson",
  });

  function validateFrontMatter(): boolean {
    try {
      frontMatterHelper.parse(metaData, {});
      if (!metaData.trim().endsWith("---")) {
        setErrorMarker({
          from: metaData.length,
          to: metaData.length + 1,
          message: "Front matter must end with ---",
          severity: "error",
        });
        return false;
      }
      setErrorMarker(undefined);
      return true;
    } catch (error: any) {
      setErrorMarker({
        from: error.mark.position,
        to: metaData.indexOf(" ", error.mark.position),
        message: error.message,
        severity: "error",
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

  const yamlLinter = linter((view) => {
    let diagnostics: Diagnostic[] = [];
    if (errorMarker) {
      diagnostics.push(errorMarker);
    }
    return diagnostics;
  });

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
        <CodeMirror
          width="100%"
          height="100%"
          maxHeight="80vh"
          value={metaData}
          style={{
            fontSize: userPreferences.editorFontSize || 14,
          }}
          extensions={[StreamLanguage.define(yaml), EditorView.lineWrapping, yamlLinter, lintGutter()]}
          onChange={(newContent) => {
            setMetadata(newContent);
          }}
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
      </Dialog>
    </>
  );
}
