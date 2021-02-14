import React, { useState } from "react";
import useAPI from "../../shared/useAPI";
import { Notification } from "../../shared/helpers/notification";
import { Alert, Button, Intent } from "@blueprintjs/core";
import { useHistory, useParams } from "react-router-dom";
import { RouteParams } from "../../shared/types/router";

export default function UnpublishPost({ savePost }: { savePost: () => void }) {
  let { id } = useParams<RouteParams>();
  let history = useHistory();
  //Unpublish post
  const [showUnpublishAlert, setShowUnpublishAlert] = useState(false);
  const { execute: unpublishPost } = useAPI(
    {
      method: "POST",
      url: "posts/draft",
      data: {
        id: id,
      },
    },
    true
  );

  async function onUnpublish() {
    try {
      await savePost();
      const res = await unpublishPost();
      // @ts-ignore
      history.push(`/post/edit/${res.data._id}`);
      window.location.reload();
    } catch (error) {
      console.error("Unable to unpublish post.", error);
      Notification.show({
        message: "Oh no, I can't unpublish the post. 😟 ",
        intent: Intent.DANGER,
        icon: "delete",
      });
    }
  }

  return (
    <>
      <Button
        icon="pause"
        text={"Unpublish"}
        onClick={() => {
          setShowUnpublishAlert(true);
        }}
      />
      <Alert
        isOpen={showUnpublishAlert}
        intent={Intent.PRIMARY}
        confirmButtonText={"Unpublish"}
        cancelButtonText={"Cancel"}
        onCancel={() => setShowUnpublishAlert(false)}
        onConfirm={() => onUnpublish()}
      >
        <p>
          <b>Are you sure you want to unpublish this post?</b>
        </p>
        <p>
          Drafts can be seen and edited through the admin panel, but only published posts are available on your website.
        </p>
      </Alert>
    </>
  );
}
