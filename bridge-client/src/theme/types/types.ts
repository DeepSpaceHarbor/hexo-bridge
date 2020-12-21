export type Theme = {
    name: string,
    description: string,
    link: string,
    preview: string,
    screenshot: string,
    tags: string[]
}

export type InstalledTheme = Theme & {
    isActive: boolean
}

export interface DiscoverThemeCardProps {
    theme: Theme,
    setLightboxSrc: (src: string) => void,
    setLightboxTitle: any, //TODO: find a way to implement better type for this.
    setLightboxCaption: any, //TODO: find a way to implement better type for this.
    setShowLightbox: (showLightbox: boolean) => void
}

export interface InstalledThemeCardProps {
    theme: InstalledTheme,
    setLightboxSrc: (src: string) => void,
    setLightboxTitle: any, //TODO: find a way to implement better type for this.
    setLightboxCaption: any, //TODO: find a way to implement better type for this.
    setShowLightbox: (showLightbox: boolean) => void
}