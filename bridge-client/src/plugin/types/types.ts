export type Plugin = {
    name: string,
    description: string,
    link: string,
    tags: string[]
}

export type InstalledPlugin = Plugin & {
    link?: string,
    version: number
}

export type TagsAndPluginsList = {
    count: number,
    plugins: Plugin[]
}

export interface TagListProps {
    allAddons: TagsAndPluginsList[],
    selected: string,
    onChange: (newTag: string) => void
}

export type Script = {
    name: string,
    filePath: string,
    content: string
}