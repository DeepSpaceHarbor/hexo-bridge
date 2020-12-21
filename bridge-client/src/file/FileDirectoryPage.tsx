import React, {useEffect, useState} from "react";
import Navigation from "../shared/components/Navigation";
import FileGrid from "./FileGrid";
import {AxiosRequestConfig} from "axios";
import useAPI from "../shared/useAPI";
import {Breadcrumb, Breadcrumbs, ButtonGroup, IBreadcrumbProps, Spinner} from "@blueprintjs/core";
import GenericError from "../shared/components/GenericError";
import folderOpenIcon from "./icons/folder-open-small.png";
import queryString from 'query-string'
import {useLocation} from "react-router-dom";
import FileUploadModal from "./upload/FileUploadModal";
import NewFolder from "./NewFolder";

const discoverFilesAPI: AxiosRequestConfig = {
    method: 'POST',
    url: 'assets/getAll'
}

export default function FileDirectoryPage() {
    const queryStringParams = queryString.parse(useLocation().search)
    const {loading: isLoading, error, data: allFiles} = useAPI({
        ...discoverFilesAPI,
        data: {
            directory: queryStringParams.dir
        }
    });
    const [currentDir, setCurrentDir] = useState<IBreadcrumbProps[]>([]);


    useEffect(
        () => {
            if (allFiles.currentDir) {
                const pathParts = allFiles.currentDir.split(allFiles.separator);
                let dir: IBreadcrumbProps[] = [];
                // @ts-ignore
                for (let key in [...Array(pathParts.length).keys()]) {
                    dir.push({
                        href: `/bridge/file?dir=${pathParts.slice(0, Number(key) + 1).join(allFiles.separator)}`,
                        icon: <img className={"center-horizontal margin-right"} src={folderOpenIcon}
                                   alt={`${pathParts[key]} folder`}/>,
                        text: pathParts[key]
                    })
                }
                setCurrentDir(dir);
            }
        }, [allFiles.currentDir, allFiles.separator]
    )

    function renderCurrentBreadcrumb({text, ...restProps}: IBreadcrumbProps) {
        // customize rendering of last breadcrumb
        return <Breadcrumb {...restProps} > {text} </Breadcrumb>;
    }

    function getCurrentState() {
        if (isLoading) {
            return <Spinner/>
        }
        if (error) {
            return <GenericError/>
        }
        return <>
            <div style={{display: "flex"}}>
                <Breadcrumbs className="margin padding-left"
                             currentBreadcrumbRenderer={renderCurrentBreadcrumb}
                             items={currentDir}
                />
                <span style={{flexGrow: 1}}/>
                <div className="margin">
                    <ButtonGroup>
                        <FileUploadModal currentLocation={allFiles.currentDir}/>
                        <NewFolder currentDir={allFiles.currentDir} separator={allFiles.separator}/>
                    </ButtonGroup>
                </div>
            </div>
            <FileGrid files={allFiles.files}/>
        </>
    }

    return <>
        <Navigation/>
        {getCurrentState()}
    </>

}