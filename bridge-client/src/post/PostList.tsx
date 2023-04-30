import React, { useState } from "react";
import { NonIdealState } from "@blueprintjs/core";
import HtmlPreview from "../shared/components/HtmlPreview";
import PostCard from "./PostCard";
import { Post } from "./types/types";

type PostListProps = {
  posts: Post[];
  showCategories: boolean;
  showTags: boolean;
};

const undefinedPost = {
  _id: "",
  title: "",
  date: "",
  published: false,
  content: "",
  categories: [],
  tags: [],
};

export default function PostList({ posts, showCategories, showTags }: PostListProps) {
  const [selectedPost, setSelectedPost] = useState<Post>(undefinedPost);

  function getState() {
    if (posts.length === 0) {
      return (
        <NonIdealState
          icon="path-search"
          title="Sorry, I can't find the post you're looking for."
          description="Don't let this stop you. Click the new post button and write your best story ever."
        />
      );
    }
    return (
      <>
        <div>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              showCategories={showCategories}
              showTags={showTags}
            />
          ))}
        </div>
        <HtmlPreview className="card-preview-panel" code={selectedPost.content} />
      </>
    );
  }

  return getState();
}
