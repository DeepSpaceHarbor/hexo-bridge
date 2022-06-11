import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAPI from "../../shared/useAPI";
import { Notification } from "../../shared/helpers/notification";
import { Alert, Button, Intent } from "@blueprintjs/core";

export default function PublishPost({ savePost }: { savePost: () => void }) {
  let { id } = useParams();
  let navigate = useNavigate();

  //Publish post
  const [showPublishAlert, setShowPublishAlert] = useState(false);
  const { loading: isPublishInProgress, execute: publishPost } = useAPI(
    {
      method: "POST",
      url: "posts/publish",
      data: {
        id: id,
      },
    },
    true
  );

  async function onPublish() {
    try {
      savePost();
      const res = await publishPost();
      // @ts-ignore
      navigate(`/post/edit/${res.data._id}`);
      window.location.reload();
    } catch (error) {
      console.error("Unable to publish post.", error);
      Notification.show({ message: "Oh no, I can't publish the post. 😟 ", intent: Intent.DANGER, icon: "delete" });
    }
  }

  return (
    <>
      <Button
        icon="globe"
        text={"Publish"}
        onClick={() => {
          setShowPublishAlert(true);
        }}
      />
      <Alert
        isOpen={showPublishAlert}
        intent={Intent.PRIMARY}
        confirmButtonText={isPublishInProgress ? "Publishing ..." : "Publish"}
        cancelButtonText={"Cancel"}
        onCancel={() => setShowPublishAlert(false)}
        onConfirm={() => onPublish()}
      >
        <p>Are you sure you want to publish this now?</p>
      </Alert>
    </>
  );
}
