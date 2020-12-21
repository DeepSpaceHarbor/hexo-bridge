import {IFileInfo} from "./types/types";
import defaultFile from "./icons/fileTypes/file-default.png";
import imageFile from "./icons/fileTypes/file-image.svg";
import textFile from "./icons/fileTypes/file-text.svg";
import videoFile from "./icons/fileTypes/file-video.svg";
import audioFile from "./icons/fileTypes/file-audio.png";
import pdfFile from "./icons/fileTypes/file-pdf.png";
import wordFile from "./icons/fileTypes/file-word.svg";
import excelFile from "./icons/fileTypes/file-excel.svg";
import sqlFile from "./icons/fileTypes/file-sql.png";
import jsonFile from "./icons/fileTypes/file-json.png";
import archiveFile from "./icons/fileTypes/file-archive.png";
import emailFile from "./icons/fileTypes/file-email.png";

const isImage = require('is-image');
const isTextPath = require('is-text-path');
const isVideo = require('is-video');
const isAudio = require('is-audio');

export default function getIcon(file: IFileInfo) {

    if (file.filePath.endsWith(".pdf")) {
        return pdfFile;
    }

    if (file.filePath.endsWith(".doc") || file.filePath.endsWith(".docx")) {
        return wordFile;
    }

    if (file.filePath.endsWith(".xls") || file.filePath.endsWith(".xlsx")) {
        return excelFile;
    }

    if (file.filePath.endsWith(".zip") || file.filePath.endsWith(".rar")
        || file.filePath.endsWith(".7z") || file.filePath.endsWith(".tar")
        || file.filePath.endsWith(".gz") || file.filePath.endsWith(".sfx")) {
        return archiveFile;
    }

    if (file.filePath.endsWith(".eml") || file.filePath.endsWith(".mbox")) {
        return emailFile;
    }

    if (file.filePath.endsWith(".sql")) {
        return sqlFile;
    }

    if (file.filePath.endsWith(".json")) {
        return jsonFile;
    }

    if (isImage(file.filePath)) {
        return imageFile;
    }
    if (isTextPath(file.filePath)) {
        return textFile;
    }
    if (isVideo(file.filePath)) {
        return videoFile;
    }

    if (isAudio(file.filePath)) {
        return audioFile;
    }

    return defaultFile;
}