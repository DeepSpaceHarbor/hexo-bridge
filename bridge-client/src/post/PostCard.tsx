import React from "react";
import {Elevation} from "@blueprintjs/core/lib/esm/common/elevation";
import {Link} from "react-router-dom";
import {Button, Card, Divider, Menu, Popover} from "@blueprintjs/core";
import type {Category, PostCardProps, Tag} from "./types/types";

export default function PostCard({post, selectedPost, setSelectedPost, showCategories, showTags}: PostCardProps) {
    function getCategories() {
        if (!showCategories) {
            return undefined;
        }
        if (post.categories.length === 0) {
            return <Button minimal text={`Categories (${post.categories.length})`}
                           className="force-text-muted"/>
        }
        return <Popover position="right">
            <Button minimal text={`Categories (${post.categories.length})`}
                    className="force-text-muted"/>
            <Menu>
                {
                    post.categories.data.map((category: Category) => {
                        return <Menu.Item key={category.name} text={category.name}/>
                    })
                }
            </Menu>
        </Popover>
    }

    function getTags() {
        if (!showTags) {
            return undefined;
        }
        if (post.tags.length === 0) {
            return <Button minimal text={`Tags (${post.tags.length})`}
                           className="force-text-muted"/>
        }
        return <Popover position="right">
            <Button minimal text={`Tags (${post.tags.length})`}
                    className="force-text-muted"/>
            <Menu>
                {
                    post.tags.data.map((tag: Tag) => {
                        return <Menu.Item key={tag.name} text={tag.name}/>
                    })
                }
            </Menu>
        </Popover>
    }

    return <Card className="card-list-item" interactive elevation={Elevation.ZERO}
                 onClick={() => setSelectedPost(post)}>
        <Link className={post._id === selectedPost._id ? "selected-item" : undefined}
              to={`/post/edit/${post._id}`}>
            <b>{post.title}</b>
        </Link>
        <Divider/>
        <div className="bp3-text-muted" style={{display: "flex"}}>

            <span>
            {new Date(post.date).toLocaleString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })} {post.published ? undefined : <b>[ Draft ] </b>} </span>
            <span style={{flexGrow: 1}}/>
            {getCategories()}
            {getTags()}
        </div>
    </Card>
}