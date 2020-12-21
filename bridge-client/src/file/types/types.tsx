export interface IFileInfo {
    name: string
    filePath: string
    isDir: boolean
}

export interface IDirectoryListing {
    currentDir: string
    separator: string
    files: File[]
}