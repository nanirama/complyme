export interface DocConfig {
  title: string;
  description: string;
  sidebar: SidebarItem[];
  locales?: LocaleConfig[];
}

export interface SidebarItem {
  label: string;
  type: 'autogenerate' | 'manual';
  directory?: string;
  items?: SidebarItem[];
  link?: string;
  order?: number;
}

export interface LocaleConfig {
  code: string;
  label: string;
  lang: string;
}

export const docsConfig: DocConfig = {
  title: "Documentation",
  description: "Your documentation hub",
  sidebar: [
    {
      label: "Quick Start Guides",
      type: "autogenerate",
      directory: "guides",
      order: 1,
    },
    {
      label: "Tools & Equipment",
      type: "manual",
      items: [
        { label: "Tool Guides", link: "tools/tool-guides", type: "manual" },
        { label: "Equipment Care", link: "tools/equipment-care", type: "manual" },
      ],
      order: 2,
    },
    {
      label: "Construction Services",
      type: "autogenerate",
      directory: "construction",
      order: 3,
    },
    {
      label: "Advanced Topics",
      type: "autogenerate",
      directory: "advanced",
      order: 4,
    },
  ],
  locales: [
    { code: "en", label: "English", lang: "en" },
  ],
};
