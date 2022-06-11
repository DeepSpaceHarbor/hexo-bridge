import React, { useLayoutEffect, useState } from "react";
import Navigation from "../../shared/components/Navigation";
import NavigationSettings from "../NavigationSettings";
import { AxiosRequestConfig } from "axios";
import useAPI from "../../shared/useAPI";
import { Button, ButtonGroup, Card, ControlGroup, Intent, Menu, MenuItem, Spinner } from "@blueprintjs/core";
import GenericError from "../../shared/components/GenericError";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-min-noconflict/ext-searchbox";
import { Notification } from "../../shared/helpers/notification";
import RenameScaffold from "./RenameScaffold";
import DeleteScaffold from "./DeleteScaffold";
import { scaffold } from "./types";
import NewScaffold from "./NewScaffold";
import { Popover2 } from "@blueprintjs/popover2";

// API Config
const getAllScaffolds: AxiosRequestConfig = {
  method: "GET",
  url: "scaffolds/getAllData",
};
const saveScaffoldConfig: AxiosRequestConfig = {
  method: "POST",
  url: "scaffolds/save",
};
const getUserPrefs: AxiosRequestConfig = {
  method: "GET",
  url: "settings/bridge/getAsJson",
};

export default function ScaffoldsPage() {
  const { data: userPrefs } = useAPI(getUserPrefs);
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

          <Popover2
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
          </Popover2>
          <span style={{ flexGrow: 1 }} />
          <Button icon={"floppy-disk"} minimal text={"Save"} onClick={onSave} disabled={!hasNewChanges} />
          <Popover2
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
          </Popover2>
        </ControlGroup>
        <AceEditor
          height="80vh"
          width="99vw"
          style={{ margin: "5px" }}
          mode="yaml"
          theme="xcode"
          onChange={(newContent: string) => {
            setSelectedScaffold({
              ...selectedScaffold,
              content: newContent,
            });
            setHasNewChanges(true);
          }}
          value={selectedScaffold.content}
          fontSize={userPrefs.editorFontSize || 14}
          showPrintMargin={false}
          editorProps={{ $blockScrolling: true }}
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
