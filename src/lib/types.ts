export interface DocFrontmatter {
  title: string;
  description?: string;
  sidebar?: {
    label?: string;
    order?: number;
  };
  template?: 'splash' | 'doc';
  editUrl?: boolean;
  lastUpdated?: boolean;
  next?: boolean;
  hero?: {
    title: string;
    tagline: string;
    image?: {
      alt: string;
      dark?: string;
      light?: string;
    };
    actions?: Array<{
      text: string;
      icon?: string;
      variant?: 'primary' | 'minimal';
      link: string;
    }>;
  };
}

export interface DocMetadata {
  slug: string;
  filePath: string;
  frontmatter: DocFrontmatter;
  content: string;
  headings: Heading[];
  fileContents: string;
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface SidebarItem {
  label: string;
  link: string;
  children?: SidebarItem[];
  order?: number;
}
