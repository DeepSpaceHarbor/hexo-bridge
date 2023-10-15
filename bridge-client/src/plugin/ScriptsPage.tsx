import Navigation from "../shared/components/Navigation";
import NavigationPlugins from "./NavigationPlugins";
import { useContext, useState } from "react";
import { AxiosRequestConfig } from "axios";
import useAPI from "../shared/useAPI";
import { Button, Dialog, HTMLTable, NonIdealState, Spinner } from "@blueprintjs/core";
import GenericError from "../shared/components/GenericError";
import { Script } from "./types/types";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { UserPreferencesContext } from "../shared/userPreferencesContext";

const scriptsAPI: AxiosRequestConfig = {
  method: "GET",
  url: "plugins/getScripts",
};

export default function ScriptsPage() {
  const userPreferences = useContext(UserPreferencesContext);
  const { loading: isLoading, error, data: allScripts } = useAPI(scriptsAPI);
  const [contentPreview, setContentPreview] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  function getCurrentState() {
    if (isLoading) {
      return <Spinner />;
    }
    if (error) {
      return <GenericError />;
    }
    if (allScripts.length === 0) {
      return (
        <NonIdealState
          icon="folder-open"
          title="The scripts folder is empty."
          description="Looks like you don't use any script plugins on your website."
        />
      );
    }
    return (
      <>
        <HTMLTable className="table" interactive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Path</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {allScripts.map((script: Script) => {
              return (
                <tr key={script.filePath}>
                  <td>{script.name}</td>
                  <td>{script.filePath}</td>
                  <td>
                    <Button
                      text="preview"
                      outlined
                      onClick={() => {
                        setContentPreview(script.content);
                        setShowPreview(true);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </HTMLTable>
        <Dialog
          icon="code-block"
          title="Script preview"
          isOpen={showPreview}
          canOutsideClickClose={false}
          onClose={() => setShowPreview(false)}
          style={{ width: "40vw" }}
        >
          <CodeMirror
            width="fit-parent"
            height="50vh"
            maxHeight="80vh"
            editable={false}
            value={contentPreview}
            theme={userPreferences.editorTheme}
            style={{
              fontSize: userPreferences.editorFontSize || 14,
            }}
            extensions={[javascript(), EditorView.lineWrapping]}
          />
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <NavigationPlugins />
      {getCurrentState()}
    </>
  );
}
