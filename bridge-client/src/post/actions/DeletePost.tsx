import React, { useState } from "react";
import { Alert, Button, Intent } from "@blueprintjs/core";
import useAPI from "../../shared/useAPI";
import { Notification } from "../../shared/helpers/notification";
import { useNavigate, useParams } from "react-router-dom";

export default function DeletePost() {
  let { id } = useParams();
  let navigate = useNavigate();
  //Delete post
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { loading: isDeleteInProgress, execute: deletePost } = useAPI(
    {
      method: "POST",
      url: "posts/delete",
      data: {
        id: id,
      },
    },
    true
  );

  async function onDelete() {
    try {
      await deletePost();
      navigate("/post/all");
      window.location.reload();
    } catch (error) {
      console.error("Unable to delete post.", error);
      Notification.show({ message: "Oh no, I can't delete the post. 😟 ", intent: Intent.DANGER, icon: "delete" });
    }
  }

  return (
    <>
      <Button
        icon="trash"
        onClick={() => {
          setShowDeleteAlert(true);
        }}
      >
        Delete
      </Button>
      <Alert
        isOpen={showDeleteAlert}
        icon={"trash"}
        intent={Intent.DANGER}
        confirmButtonText={isDeleteInProgress ? "Deleting ..." : "Delete"}
        cancelButtonText={"Cancel"}
        onCancel={() => setShowDeleteAlert(false)}
        onConfirm={() => onDelete()}
      >
        <p>Are you sure that you want to permanently delete this post? </p>
      </Alert>
    </>
  );
}
