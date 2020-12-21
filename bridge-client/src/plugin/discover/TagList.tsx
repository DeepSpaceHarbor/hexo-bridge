import React from "react";
import {Menu, MenuItem} from "@blueprintjs/core";
import {TagListProps} from "../types/types";


export default function TagList({allAddons, selected, onChange}: TagListProps) {
    return <Menu className="tag-list margin">{
        Object.keys(allAddons).sort(function (a, b) {
            // @ts-ignore
            return allAddons[b].count - allAddons[a].count
        }).map((tag: any) => {
            return <MenuItem key={tag} text={`${tag} (${allAddons[tag].count})`}
                             active={selected === tag}
                             onClick={() => onChange(tag)}
            />
        })
    }
    </Menu>
}