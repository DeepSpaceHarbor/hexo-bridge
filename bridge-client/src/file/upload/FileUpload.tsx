import React, {useEffect, useState} from "react";
import axios from "axios";
import {Classes, ProgressBar} from "@blueprintjs/core";

interface FileUploadProps {
    currentLocation: string
    selectedFiles: File[],
    reportStatus: (failedFiles: File[]) => void
}

export default function FileUpload({currentLocation, selectedFiles, reportStatus}: FileUploadProps) {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentUploadName, setCurrentUploadName] = useState("");

    useEffect(() => {
        if (selectedFiles.length > 0) {
            upload();
        }
        // eslint-disable-next-line
    }, [selectedFiles]);

    async function upload() {
        let withErrors = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            setUploadProgress((i + 1) / selectedFiles.length);
            setCurrentUploadName(selectedFiles[i].name);
            const photoFormData = new FormData();
            photoFormData.append("file", selectedFiles[i]);
            photoFormData.append("directory", currentLocation);
            try {
                await axios({
                    method: "POST",
                    url: "http://localhost:4000/api/assets/upload",
                    data: photoFormData,
                    headers: {
                        'Content-Type': 'multipart/form-data"'
                    }
                })
            } catch (e) {
                console.log("Upload error:", e);
                withErrors.push(selectedFiles[i]);
            }
        }
        reportStatus(withErrors);
    }

    return <>
        <div className={Classes.DIALOG_BODY}>
            <ProgressBar value={uploadProgress}/>
            <p className="padding-top">{currentUploadName}</p>
        </div>
    </>
}