import { useParams } from "react-router-dom";
import useAPI from "../shared/useAPI";
import { AnchorButton, Button, ButtonGroup, Popover } from "@blueprintjs/core";
import React from "react";
import DeletePost from "./actions/DeletePost";
import PublishPost from "./actions/PublishPost";
import UnpublishPost from "./actions/UnpublishPost";
import { RouteParams } from "../shared/types/router";

export default function PostEditorActionDropdown({ savePost }: { savePost: () => void }) {
  let { id } = useParams<RouteParams>();

  const { data: post } = useAPI({
    method: "POST",
    url: "posts/getSingle",
    data: {
      id: id,
    },
  });

  return (
    <>
      {post.published ? (
        <AnchorButton icon="share" text={"Preview"} href={`/${post.path}`} target="_blank" rel="noopener noreferrer" />
      ) : (
        <PublishPost savePost={savePost} />
      )}
      <Popover position={"bottom"} minimal>
        <Button icon="caret-down" />
        <ButtonGroup minimal vertical>
          {post.published ? <UnpublishPost savePost={savePost} /> : undefined}
          <DeletePost />
        </ButtonGroup>
      </Popover>
    </>
  );
}
