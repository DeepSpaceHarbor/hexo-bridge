import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import useAPI from "../shared/useAPI";
import { Notification } from "../index";
import {
  Button,
  Classes,
  Dialog,
  InputGroup,
  Intent,
  Menu,
  Position,
  MenuItem,
  Card,
  Popover,
} from "@blueprintjs/core";

export default function CreateNewPost() {
  let navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [selectedScaffold, setSelectedScaffold] = useState("post");
  const { data: allScaffolds } = useAPI({
    method: "GET",
    url: "scaffolds/getAllNames",
  });

  const { loading: createPostLoading, execute: createPost } = useAPI(
    {
      method: "POST",
      url: "posts/create",
      data: {
        title: postTitle,
        scaffold: selectedScaffold,
      },
    },
    true
  );

  async function onCreate() {
    try {
      const res = await createPost();
      if (res?.data?._id) {
        navigate(`/post/edit/${res.data._id}`);
        window.location.reload();
      } else {
        throw new Error("New post was created but ID was not received.");
      }
    } catch (error) {
      console.error("Cannot create new post.", error);
      Notification.show({
        message: "Oh no, I can't create new post 😟 ",
        intent: Intent.DANGER,
        icon: "delete",
      });
    }
  }

  function getScaffoldMenuItems() {
    return (
      <Card
        style={{
          padding: "0px",
        }}
      >
        <Menu>
          {allScaffolds.map((scaffold: string) => {
            if (scaffold === "page") {
              // eslint-disable-next-line array-callback-return
              return;
            }
            return (
              <MenuItem
                onClick={() => {
                  setSelectedScaffold(scaffold);
                }}
                text={scaffold}
                key={scaffold}
                active={scaffold === selectedScaffold}
              />
            );
          })}
        </Menu>
      </Card>
    );
  }

  return (
    <>
      <Button
        minimal
        icon="insert"
        text="New post"
        onClick={() => {
          setIsOpen(true);
        }}
      />
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        canOutsideClickClose={false}
        icon="insert"
        title="Create new post"
      >
        <div className={Classes.DIALOG_BODY}>
          <p>Enter a name for the new post:</p>
          <InputGroup
            value={postTitle}
            leftIcon="document"
            placeholder="<Insert post title>"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPostTitle(e.target.value);
            }}
          />

          <Popover content={getScaffoldMenuItems()} position={Position.BOTTOM}>
            <Button
              outlined
              text={`Use scaffold: ${selectedScaffold}`}
              icon="applications"
              style={{ backgroundColor: "white" }}
            />
          </Popover>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <span className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Create post" intent={Intent.PRIMARY} onClick={onCreate} loading={createPostLoading} />
          </span>
        </div>
      </Dialog>
    </>
  );
}
