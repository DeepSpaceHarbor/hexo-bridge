import React, { useContext, useLayoutEffect, useState } from "react";
import Navigation from "../shared/components/Navigation";
import { useParams } from "react-router-dom";
import useAPI from "../shared/useAPI";
import { Button, ButtonGroup, ControlGroup, Divider, InputGroup, Intent, Spinner } from "@blueprintjs/core";
import { parsePageData, validateRequiredPageMetadataFields } from "../shared/helpers/frontMatterParserHelper";
import FrontMatterEditor from "../shared/components/FrontMatterEditor";
import { Notification } from "../index";
import PageEditorActionDropdown from "./PageEditorActionDropdown";
import GenericError from "../shared/components/GenericError";
import { AxiosRequestConfig } from "axios";
import * as frontMatterHelper from "hexo-front-matter";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { UserPreferencesContext } from "../shared/userPreferencesContext";

//API Config section
const getSinglePageAPI: AxiosRequestConfig = {
  method: "POST",
  url: "pages/getSingle",
};

const savePageAPI: AxiosRequestConfig = {
  method: "POST",
  url: "pages/save",
};

export default function PageEditorPage() {
  const { id } = useParams();
  const userPreferences = useContext(UserPreferencesContext);
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
          <CodeMirror
            width="99vmax"
            height="90vh"
            theme={userPreferences.editorTheme}
            style={{
              fontSize: userPreferences.editorFontSize || 14,
            }}
            extensions={[markdown({ base: markdownLanguage, codeLanguages: languages }), EditorView.lineWrapping]}
            value={content}
            onChange={(newContent) => {
              setContent(newContent.trim());
              setHasUnsavedChanges(true);
            }}
            onKeyDown={(event) => {
              if (event.ctrlKey && event.key === "s") {
                event.preventDefault();
                onSave();
              }
            }}
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
