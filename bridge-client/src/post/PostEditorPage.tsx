import React, { useContext, useLayoutEffect, useState } from "react";
import Navigation from "../shared/components/Navigation";
import { useParams } from "react-router-dom";
import useAPI from "../shared/useAPI";
import {
  Button,
  ButtonGroup,
  Card,
  ControlGroup,
  Divider,
  InputGroup,
  Intent,
  Spinner,
  Popover,
} from "@blueprintjs/core";
import PostEditorActionDropdown from "./PostEditorActionDropdown";
import { Notification } from "../index";
import { DatePicker3 } from "@blueprintjs/datetime2";
import FrontMatterEditor from "../shared/components/FrontMatterEditor";
import { parsePostData, validateRequiredPostMetadataFields } from "../shared/helpers/frontMatterParserHelper";
import GenericError from "../shared/components/GenericError";
import { AxiosRequestConfig } from "axios";
import * as frontMatterHelper from "hexo-front-matter";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { UserPreferencesContext } from "../shared/userPreferencesContext";

//API Config
const getSinglePostAPI: AxiosRequestConfig = {
  method: "POST",
  url: "posts/getSingle",
};

const savePostAPI: AxiosRequestConfig = {
  method: "POST",
  url: "posts/save",
};

export default function PostEditorPage() {
  const { id } = useParams();
  const userPreferences = useContext(UserPreferencesContext);
  //Get post from api, setup code editor, preview & parse front matter for metadata.
  const {
    loading: isLoading,
    error,
    data: postData,
  } = useAPI({
    ...getSinglePostAPI,
    data: {
      id: id,
    },
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [metadata, setMetadata] = useState({ title: "", categories: [], tags: [], date: new Date().toISOString() });
  const [content, setContent] = useState("");
  const [showFrontMatterEditor, setShowFrontMatterEditor] = useState(false);
  const { execute: savePost } = useAPI(
    {
      ...savePostAPI,
      data: {
        id: id,
        content: frontMatterHelper.stringify(metadata) + content,
      },
    },
    true
  );

  //Parse post from api
  useLayoutEffect(() => {
    if (postData.raw) {
      const parsedPost = parsePostData(postData);
      setContent(parsedPost.content);
      setMetadata(parsedPost.meta);
    }
  }, [postData]);

  async function onSave() {
    try {
      await savePost();
      setHasUnsavedChanges(false);
      Notification.show({
        message: "Saved!",
        intent: Intent.SUCCESS,
        icon: "saved",
      });
    } catch (err) {
      console.error("Unable to save post.", err);
      Notification.show({
        message: "Oh no, I can't save the post. 😟 ",
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
          <ButtonGroup minimal>
            <Button
              icon="property"
              onClick={() => {
                setShowFrontMatterEditor(true);
              }}
            >
              Categories ({metadata.categories.length})
            </Button>
            <Button
              icon="tag"
              onClick={() => {
                setShowFrontMatterEditor(true);
              }}
            >
              Tags ({metadata.tags.length})
            </Button>
            <Popover
              autoFocus={false}
              content={
                <Card
                  style={{
                    padding: "0px",
                  }}
                >
                  <DatePicker3
                    value={new Date(metadata.date)}
                    onChange={(selectedDate: Date | null, isUserChange: boolean) => {
                      if (isUserChange) {
                        setMetadata({ ...metadata, date: selectedDate?.toISOString() ?? "" });
                        setHasUnsavedChanges(true);
                      }
                    }}
                  />
                </Card>
              }
            >
              <Button icon="calendar">
                {new Date(metadata.date).toLocaleString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Button>
            </Popover>
            <Divider />
            <Button
              icon="annotation"
              text={"Front matter"}
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
                setMetadata(validateRequiredPostMetadataFields(newData));
                setHasUnsavedChanges(true);
              }}
            />
          </ButtonGroup>
          <span style={{ flexGrow: 1 }} />
          <ButtonGroup minimal>
            <Button icon="floppy-disk" text="Save" onClick={onSave} disabled={!hasUnsavedChanges} />
            <PostEditorActionDropdown savePost={onSave} />
          </ButtonGroup>
        </ControlGroup>
        <div className="code-editor-preview-container">
          <CodeMirror
            width="99vmax"
            height="90vh"
            theme={userPreferences.editorTheme}
            style={{
              fontSize: userPreferences.editorFontSize,
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
