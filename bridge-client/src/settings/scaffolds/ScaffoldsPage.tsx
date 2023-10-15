import React, { useLayoutEffect, useState } from "react";
import Navigation from "../../shared/components/Navigation";
import NavigationSettings from "../NavigationSettings";
import { AxiosRequestConfig } from "axios";
import useAPI from "../../shared/useAPI";
import { Button, ButtonGroup, Card, ControlGroup, Intent, Menu, MenuItem, Spinner, Popover } from "@blueprintjs/core";
import GenericError from "../../shared/components/GenericError";
import { Notification } from "../../index";
import RenameScaffold from "./RenameScaffold";
import DeleteScaffold from "./DeleteScaffold";
import { scaffold } from "./types";
import NewScaffold from "./NewScaffold";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { StreamLanguage } from "@codemirror/language";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";

// API Config
const getAllScaffolds: AxiosRequestConfig = {
  method: "GET",
  url: "scaffolds/getAllData",
};
const saveScaffoldConfig: AxiosRequestConfig = {
  method: "POST",
  url: "scaffolds/save",
};
const getUserPreferences: AxiosRequestConfig = {
  method: "GET",
  url: "settings/bridge/getAsJson",
};

export default function ScaffoldsPage() {
  const { data: userPreferences } = useAPI(getUserPreferences);
  const [hasNewChanges, setHasNewChanges] = useState(false);
  const { loading: isLoading, error, data: allScaffolds } = useAPI(getAllScaffolds);
  const [selectedScaffold, setSelectedScaffold] = useState<scaffold>({
    name: "",
    content: "",
    fileName: "",
  });
  const { execute: saveScaffold } = useAPI(
    {
      ...saveScaffoldConfig,
      data: {
        name: selectedScaffold.name,
        content: selectedScaffold.content,
      },
    },
    true
  );

  //Init
  useLayoutEffect(() => {
    if (allScaffolds.length > 0) {
      setSelectedScaffold(allScaffolds[0]);
    }
  }, [allScaffolds]);

  async function onSave() {
    try {
      await saveScaffold();
      Notification.show({
        message: "The scaffold has been saved! ",
        intent: Intent.SUCCESS,
        icon: "saved",
      });
      setHasNewChanges(false);
    } catch (error) {
      console.error("Unable to save scaffold.", error);

      Notification.show({
        message: "Oh no, I can't save the scaffold. 😟 ",
        intent: Intent.DANGER,
        icon: "delete",
      });
    }
  }

  function getCurrentState() {
    if (isLoading) {
      return <Spinner />;
    }
    if (error) {
      return <GenericError />;
    }
    return (
      <>
        <ControlGroup style={{ margin: "5px" }}>
          <NewScaffold allScaffolds={allScaffolds} />

          <Popover
            position={"bottom"}
            content={
              <Card
                style={{
                  padding: "0px",
                }}
              >
                <Menu>
                  {allScaffolds.map((scaffold: any) => (
                    <MenuItem
                      text={scaffold.name}
                      onClick={() => {
                        setSelectedScaffold(scaffold);
                        setHasNewChanges(false);
                      }}
                      active={scaffold.name === selectedScaffold.name}
                      key={scaffold.name}
                    />
                  ))}
                </Menu>
              </Card>
            }
          >
            <ButtonGroup>
              <Button icon={"applications"} minimal>
                Selected: {selectedScaffold.name}{" "}
              </Button>
              <Button icon="caret-down" minimal />
            </ButtonGroup>
          </Popover>
          <span style={{ flexGrow: 1 }} />
          <Button icon={"floppy-disk"} minimal text={"Save"} onClick={onSave} disabled={!hasNewChanges} />
          <Popover
            position={"bottom"}
            content={
              <Card
                style={{
                  padding: "0px",
                }}
              >
                <ButtonGroup minimal vertical>
                  <RenameScaffold selectedScaffold={selectedScaffold} allScaffolds={allScaffolds} />
                  <DeleteScaffold selectedScaffold={selectedScaffold} />
                </ButtonGroup>
              </Card>
            }
          >
            <Button icon="caret-down" minimal />
          </Popover>
        </ControlGroup>
        <CodeMirror
          width="99vw"
          height="83vh"
          value={selectedScaffold.content}
          style={{
            fontSize: userPreferences.editorFontSize || 14,
          }}
          extensions={[StreamLanguage.define(yaml), EditorView.lineWrapping]}
          onChange={(newContent) => {
            setSelectedScaffold({
              ...selectedScaffold,
              content: newContent,
            });
            setHasNewChanges(true);
          }}
        />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <NavigationSettings />
      {getCurrentState()}
    </>
  );
}
