import React from "react";
import {NonIdealState} from "@blueprintjs/core";
import Grid from "../shared/components/Grid";
import {IFileInfo} from "./types/types";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";

export default function FileGrid({files}: { files: IFileInfo[] }) {
    function getGrid() {
        if (files.length === 0) {
            return <NonIdealState icon="folder-open" title="This folder is empty."/>;
        }

        files.sort(function (x: IFileInfo, y: IFileInfo) {
            if (x.isDir === y.isDir) {
                return 0;
            }
            if (x.isDir) {
                return -1;
            }
            return +1
        });
        return <>
            <Grid className="grid file-grid" columns={4}>
                {
                    files.map((file: IFileInfo) => {
                        if (file.isDir) {
                            return <FolderCard file={file} key={file.filePath}/>
                        }
                        return <FileCard file={file} key={file.filePath}/>
                    })
                }
            </Grid>
        </>
    }

    return getGrid();
}