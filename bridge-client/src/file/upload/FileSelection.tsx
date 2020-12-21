import React, {useState} from "react";
import {Button, Classes, Intent, Tag} from "@blueprintjs/core";
import Dropzone, {FileRejection} from "react-dropzone";
import dropZoneIllustration from "../ilustrations/file-upload-dropzone.svg";
import {Notification} from "../../shared/helpers/notification";

interface FileSelectionProps {
    currentLocation: string
    uploadFiles: (files: any[]) => void
}


export default function FileSelection({currentLocation, uploadFiles}: FileSelectionProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>(new Array<File>());

    function onDrop(acceptedFiles: File[]) {
        const newFiles = acceptedFiles.filter((file: File) => {
            return !selectedFiles.some((acceptedFile) => {
                return acceptedFile.name === file.name;
            })
        })
        setSelectedFiles([...selectedFiles, ...newFiles]);
    }

    function onDropRejected(fileRejections: FileRejection[]) {
        fileRejections.forEach((rejectedItem: FileRejection) => {
            Notification.show({
                message: `Rejected: ${rejectedItem.file.name}. ${rejectedItem.errors[0].message}.`,
                intent: Intent.DANGER,
                icon: "delete"
            });
        })
    }

    return <>
        <div className={Classes.DIALOG_BODY}>
            <Dropzone onDrop={onDrop}
                      onDropRejected={onDropRejected}
                      maxSize={523239424}
                      multiple
            >
                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps()} >
                        <input {...getInputProps()} />
                        <h4 className="bp3-heading bp3-text-overflow-ellipsis">Drop here to upload in
                            /{currentLocation}</h4>
                        <img src={dropZoneIllustration} style={{maxWidth: "100%"}} alt="Drop here to upload files."/>
                    </div>
                )}
            </Dropzone>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
            {selectedFiles.length > 0 && <h4 className="bp3-heading">Selected files: </h4>}
            {
                selectedFiles.map((file: File) => {
                    return <Tag interactive minimal
                                key={file.name}
                                style={{margin: "5px"}}
                                onRemove={() => {
                                    const removeIndex = selectedFiles.findIndex(item => item.name === file.name);
                                    let elements = [...selectedFiles];
                                    elements.splice(removeIndex, 1);
                                    setSelectedFiles(elements);
                                }}>
                        {file.name}
                    </Tag>
                })
            }
            <span className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Upload" intent={Intent.PRIMARY}
                    disabled={selectedFiles.length === 0}
                    onClick={() => {
                        uploadFiles(selectedFiles)
                    }}/>
        </span>
        </div>
    </>

}