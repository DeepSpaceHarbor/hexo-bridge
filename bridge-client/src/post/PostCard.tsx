import React from "react";
import { Elevation, MenuItem, Button, Card, Divider, Menu } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import type { Post } from "./types/types";
import { Popover2 } from "@blueprintjs/popover2";

type PostCardProps = {
  post: Post;
  selectedPost: Post;
  setSelectedPost: (post: Post) => void;
  showCategories: boolean;
  showTags: boolean;
};

export default function PostCard({ post, selectedPost, setSelectedPost, showCategories, showTags }: PostCardProps) {
  function getCategories() {
    if (!showCategories) {
      return undefined;
    }
    if (post.categories.length === 0) {
      return <Button minimal text={`Categories (${post.categories.length})`} className="force-text-muted" />;
    }
    return (
      <Popover2
        position="right"
        content={
          <Card
            style={{
              padding: "0px",
            }}
          >
            <Menu>
              {post.categories.map((category: string) => {
                return <MenuItem key={category} text={category} />;
              })}
            </Menu>
          </Card>
        }
      >
        <Button minimal text={`Categories (${post.categories.length})`} className="force-text-muted" />
      </Popover2>
    );
  }

  function getTags() {
    if (!showTags) {
      return undefined;
    }
    if (post.tags.length === 0) {
      return <Button minimal text={`Tags (0)`} className="force-text-muted" />;
    }
    return (
      <Popover2
        position="right"
        content={
          <Card
            style={{
              padding: "0px",
            }}
          >
            <Menu>
              {post.tags.map((tag: string) => {
                return <MenuItem key={tag} text={tag} />;
              })}
            </Menu>
          </Card>
        }
      >
        <Button minimal text={`Tags (${post.tags.length})`} className="force-text-muted" />
      </Popover2>
    );
  }

  return (
    <Card className="card-list-item" interactive elevation={Elevation.ZERO} onClick={() => setSelectedPost(post)}>
      <Link className={post._id === selectedPost._id ? "selected-item" : undefined} to={`/post/edit/${post._id}`}>
        <b>{post.title}</b>
      </Link>
      <Divider />
      <div className="bp4-text-muted" style={{ display: "flex" }}>
        <span>
          {new Date(post.date).toLocaleString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          {post.published ? undefined : <b>[ Draft ] </b>}{" "}
        </span>
        <span style={{ flexGrow: 1 }} />
        {getCategories()}
        {getTags()}
      </div>
    </Card>
  );
}
