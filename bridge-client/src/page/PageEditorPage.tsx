import React, { useLayoutEffect, useState } from "react";
import Navigation from "../shared/components/Navigation";
import { useParams } from "react-router-dom";
import useAPI from "../shared/useAPI";
import { Button, ButtonGroup, ControlGroup, Divider, InputGroup, Intent, Spinner } from "@blueprintjs/core";
import { parsePageData, validateRequiredPageMetadataFields } from "../shared/helpers/frontMatterParserHelper";
import FrontMatterEditor from "../shared/components/FrontMatterEditor";
import { Notification } from "../index";
import PageEditorActionDropdown from "./PageEditorActionDropdown";
import GenericError from "../shared/components/GenericError";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-min-noconflict/ext-searchbox";
import axios, { AxiosRequestConfig } from "axios";
import { stringify } from "qs";
import * as frontMatterHelper from "hexo-front-matter";

//API Config section
const getSinglePageAPI: AxiosRequestConfig = {
  method: "POST",
  url: "pages/getSingle",
};

const savePageAPI: AxiosRequestConfig = {
  method: "POST",
  url: "pages/save",
};

const updatePageContentAPI: AxiosRequestConfig = {
  method: "POST",
  url: "pages/updateContent",
};

const getUserPrefsAPI: AxiosRequestConfig = {
  method: "GET",
  url: "settings/bridge/getAsJson",
};

export default function PageEditorPage() {
  const { id } = useParams();
  const { data: userPrefs } = useAPI(getUserPrefsAPI);
  //Get page from api
  const {
    loading: isLoading,
    error,
    data: pageData,
  } = useAPI({
    ...getSinglePageAPI,
    data: {
      id: id,
    },
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [metadata, setMetadata] = useState({ title: "", categories: [], tags: [], date: new Date().toISOString() });
  const [content, setContent] = useState("");
  const [showFrontMatterEditor, setShowFrontMatterEditor] = useState(false);
  const { execute: savePage } = useAPI(
    {
      ...savePageAPI,
      data: {
        id: id,
        content: frontMatterHelper.stringify(metadata) + content,
      },
    },
    true
  );

  //Init
  useLayoutEffect(() => {
    if (pageData.raw) {
      const parsedPage = parsePageData(pageData);
      setContent(parsedPage.content);
      setMetadata(parsedPage.meta);
    }
  }, [pageData]);

  async function onSave() {
    try {
      await savePage();
      setHasUnsavedChanges(false);
      Notification.show({
        message: "Saved!",
        intent: Intent.SUCCESS,
        icon: "saved",
      });
    } catch (err) {
      console.error("Unable to save page.", err);
      Notification.show({
        message: "Oh no, I can't save the page. 😟 ",
        intent: Intent.DANGER,
        icon: "delete",
      });
    }
  }

  function getState() {
    if (isLoading) {
      return <Spinner />;
    }
    if (error) {
      return <GenericError />;
    }
    return (
      <>
        <ControlGroup className="margin">
          <InputGroup
            leftIcon="edit"
            placeholder="I ❤️ hexo."
            value={metadata.title}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMetadata({ ...metadata, title: event.target.value });
              setHasUnsavedChanges(true);
            }}
          />
          <Divider />
          <Button
            icon="annotation"
            text="Front matter"
            minimal
            onClick={() => {
              setShowFrontMatterEditor(true);
            }}
          />
          <FrontMatterEditor
            isOpen={showFrontMatterEditor}
            value={frontMatterHelper.stringify(metadata)}
            onClose={(newData) => {
              setShowFrontMatterEditor(false);
              setMetadata(validateRequiredPageMetadataFields(newData));
              setHasUnsavedChanges(true);
            }}
          />
          <span style={{ flexGrow: 1 }} />
          <ButtonGroup minimal>
            <Button text="Save" icon="floppy-disk" onClick={onSave} disabled={!hasUnsavedChanges} />
            <PageEditorActionDropdown savePage={onSave} />
          </ButtonGroup>
        </ControlGroup>
        <div className="code-editor-preview-container">
          <AceEditor
            height="90vh"
            width="100vw"
            mode="markdown"
            theme="xcode"
            wrapEnabled={true}
            value={content}
            onChange={(newContent: string) => {
              setContent(newContent);
              setHasUnsavedChanges(true);
            }}
            fontSize={userPrefs.editorFontSize || 14}
            showPrintMargin={false}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ useWorker: false }}
            commands={[
              {
                // commands is array of key bindings.
                name: "SavePage",
                bindKey: { win: "Ctrl-S", mac: "Ctrl-S" },
                exec: async (editor) => {
                  let requestConfig: AxiosRequestConfig = {
                    ...updatePageContentAPI,
                    data: {
                      id: id,
                      content: editor.getSession().getValue(),
                    },
                  };
                  requestConfig.baseURL = import.meta.env.VITE_API;
                  //Why urlencoded instead of json?
                  //https://github.com/axios/axios/issues/1610#issuecomment-492564113
                  requestConfig.data = stringify(requestConfig.data);
                  try {
                    await axios(requestConfig);
                    Notification.show({
                      message: "Content updated!",
                      intent: Intent.SUCCESS,
                      icon: "saved",
                      timeout: 800,
                    });
                  } catch (err) {
                    console.error("Unable to save page.", err);
                    Notification.show({
                      message: "Oh no, I can't update the content. 😟 ",
                      intent: Intent.DANGER,
                      icon: "delete",
                    });
                  }
                },
              },
            ]}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      {getState()}
    </>
  );
}
