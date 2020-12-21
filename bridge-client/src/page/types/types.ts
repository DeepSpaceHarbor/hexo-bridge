export type Page = {
    _id: string,
    title: string,
    date: string,
    content: string
}

export interface PageCardProps {
    page: Page,
    selectedPage: Page,
    setSelectedPage: (page: Page) => void
}