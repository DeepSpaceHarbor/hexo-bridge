import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAPI from "../shared/useAPI";
import { Alert, AnchorButton, Button, ButtonGroup, Card, Intent } from "@blueprintjs/core";
import { Notification } from "../index";
import { AxiosRequestConfig } from "axios";
import { Popover2 } from "@blueprintjs/popover2";

//API Config
const getSinglePageAPI: AxiosRequestConfig = {
  method: "POST",
  url: "pages/getSingle",
};

const deletePageAPI: AxiosRequestConfig = {
  method: "POST",
  url: "pages/delete",
};

export default function PageEditorActionDropdown({ savePage }: { savePage: () => void }) {
  let { id } = useParams();
  let navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { loading: isLoading, data: page } = useAPI({
    ...getSinglePageAPI,
    data: {
      id: id,
    },
  });

  //Delete page
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { loading: isDeleteInProgress, execute: deletePage } = useAPI(
    {
      ...deletePageAPI,
      data: {
        id: id,
      },
    },
    true
  );

  async function onDelete() {
    try {
      await deletePage();
      navigate("/page/all");
      window.location.reload();
    } catch (error) {
      console.error("Unable to delete page.", error);
      Notification.show({ message: "Oh no, I can't delete the page. 😟 ", intent: Intent.DANGER, icon: "delete" });
    }
  }

  function getCurrentState() {
    if (isLoading) {
      return <></>;
    }
    return (
      <>
        <AnchorButton icon="share" text="Preview" href={`/${page.path}`} target="_blank" rel="noopener noreferrer" />
        <Popover2
          position="bottom"
          content={
            <Card
              style={{
                padding: "0px",
              }}
            >
              <ButtonGroup minimal vertical>
                <Button
                  icon="trash"
                  text="Delete"
                  onClick={() => {
                    setShowDeleteAlert(true);
                  }}
                />
              </ButtonGroup>
            </Card>
          }
        >
          <Button icon="caret-down" onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
        </Popover2>
        <Alert
          isOpen={showDeleteAlert}
          icon="trash"
          intent={Intent.DANGER}
          confirmButtonText={isDeleteInProgress ? "Deleting ..." : "Delete"}
          cancelButtonText="Cancel"
          onOpened={() => setIsDropdownOpen(false)}
          onCancel={() => setShowDeleteAlert(false)}
          onConfirm={() => onDelete()}
        >
          <p>Are you sure that you want to permanently delete this page? </p>
        </Alert>
      </>
    );
  }

  return getCurrentState();
}
