export type Theme = {
  name: string;
  description: string;
  link: string;
  preview: string;
  screenshot: string;
  tags: string[];
};

export type InstalledTheme = Theme & {
  isActive: boolean;
};
