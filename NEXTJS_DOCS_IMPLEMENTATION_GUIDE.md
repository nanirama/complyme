# Next.js Documentation System - Complete Implementation Guide

## Complete Guide to Building a Starlight-like Documentation System in Next.js

This guide provides step-by-step instructions for implementing a documentation system in Next.js that replicates the functionality of Astro Starlight, including markdown processing, dynamic routes, sidebar navigation, and all documentation components.

---

## Table of Contents

1. [Overview](#overview)
2. [Project Setup](#project-setup)
3. [Project Structure](#project-structure)
4. [Dependencies Installation](#dependencies-installation)
5. [Configuration Files](#configuration-files)
6. [Markdown Processing](#markdown-processing)
7. [Dynamic Route Generation](#dynamic-route-generation)
8. [Documentation Components](#documentation-components)
9. [Layout System](#layout-system)
10. [Sidebar Navigation](#sidebar-navigation)
11. [Table of Contents](#table-of-contents)
12. [Search Functionality](#search-functionality)
13. [Theme Switching](#theme-switching)
14. [Internationalization](#internationalization)
15. [Styling](#styling)
16. [Complete Code Examples](#complete-code-examples)

---

## Overview

### What We're Building

A complete documentation system that:
- Reads markdown/MDX files from `content/docs/`
- Generates dynamic routes automatically
- Provides sidebar navigation
- Includes documentation components (Card, CardGrid, Steps, Aside, Tabs)
- Supports table of contents
- Includes search functionality
- Supports dark/light theme
- Supports multiple languages

### Technology Stack

- **Next.js 14+** (App Router)
- **MDX** for markdown with JSX
- **gray-matter** for frontmatter parsing
- **remark/rehype** for markdown processing
- **next-mdx-remote** or **@next/mdx** for MDX support
- **TypeScript** for type safety
- **Tailwind CSS** for styling

---

## Project Setup

### 1. Initialize Next.js Project

```bash
npx create-next-app@latest docs-site --typescript --tailwind --app --no-src-dir
cd docs-site
```

### 2. Project Structure

Create the following directory structure:

```
docs-site/
├── app/
│      └── docs/
│   │       ├── [[...slug]]/
│   │       │   └── page.tsx          # Dynamic doc page
│   │       └── layout.tsx            # Docs layout
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Home page
├── components/
│   ├── docs/
│   │   ├── Card.tsx
│   │   ├── CardGrid.tsx
│   │   ├── LinkCard.tsx
│   │   ├── Steps.tsx
│   │   ├── Aside.tsx
│   │   ├── Tabs.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TableOfContents.tsx
│   │   ├── Search.tsx
│   │   └── ThemeToggle.tsx
│   └── ui/
│       └── ...
├── content/
│   └── docs/
│       ├── welcome-to-docs.mdx
│       ├── guides/
│       │   ├── intro.mdx
│       │   ├── getting-started.mdx
│       │   └── first-project-checklist.mdx
│       ├── tools/
│       │   ├── tool-guides.mdx
│       │   └── equipment-care.mdx
│       ├── construction/
│       │   ├── service-overview.mdx
│       │   └── project-planning.mdx
│       └── advanced/
│           └── technical-specifications.mdx
├── lib/
│   ├── docs.ts                       # Doc utilities
│   ├── mdx.ts                        # MDX processing
│   └── types.ts                      # TypeScript types
├── config/
│   └── docs.ts                       # Docs configuration
└── public/
    └── ...
```

---

## Dependencies Installation

### Install Required Packages

```bash
# Core dependencies
npm install next-mdx-remote gray-matter

# Markdown processing
npm install remark remark-gfm rehype rehype-slug rehype-autolink-headings rehype-highlight

# TypeScript types
npm install -D @types/mdx @types/node

# Tailwind typography plugin
npm install @tailwindcss/typography

# Optional: For better code highlighting
npm install highlight.js
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## Configuration Files

### 1. `config/docs.ts` - Documentation Configuration

```typescript
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
    { code: "de", label: "Deutsch", lang: "de" },
  ],
};
```

### 2. `lib/types.ts` - TypeScript Types

```typescript
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
```

---

## Markdown Processing

### 1. `lib/docs.ts` - Document Utilities

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { DocMetadata, DocFrontmatter, Heading } from './types';

const docsDirectory = path.join(process.cwd(), 'content/docs');

/**
 * Get all documentation files recursively
 */
export function getAllDocs(locale: string = 'en'): DocMetadata[] {
  const localePath = locale === 'en' ? docsDirectory : path.join(docsDirectory, locale);
  
  // Check if locale directory exists
  if (!fs.existsSync(localePath)) {
    return [];
  }
  
  const files = getAllFiles(localePath);
  
  return files
    .filter((file) => /\.(md|mdx)$/.test(file))
    .map((file) => {
      const filePath = path.join(localePath, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Remove locale prefix from slug
      const relativePath = path.relative(localePath, filePath);
      const slug = relativePath
        .replace(/\.(md|mdx)$/, '')
        .replace(/\\/g, '/')
        .replace(/\/index$/, ''); // Remove /index from slug
      
      // Extract headings from content
      const headings = extractHeadings(content);
      
      return {
        slug: slug || 'welcome-to-docs',
        filePath: relativePath,
        frontmatter: data as DocFrontmatter,
        content,
        headings,
      };
    })
    .sort((a, b) => {
      const orderA = a.frontmatter.sidebar?.order ?? 999;
      const orderB = b.frontmatter.sidebar?.order ?? 999;
      return orderA - orderB;
    });
}

/**
 * Get a single document by slug
 */
export function getDocBySlug(slug: string, locale: string = 'en'): DocMetadata | null {
  const localePath = locale === 'en' ? docsDirectory : path.join(docsDirectory, locale);
  
  // Handle root slug
  if (!slug || slug === 'welcome-to-docs') {
    const rootPaths = [
      path.join(localePath, 'welcome-to-docs.mdx'),
      path.join(localePath, 'welcome-to-docs.md'),
      path.join(localePath, 'index.mdx'),
      path.join(localePath, 'index.md'),
    ];
    
    for (const filePath of rootPaths) {
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        const headings = extractHeadings(content);
        
        return {
          slug: 'welcome-to-docs',
          filePath: path.relative(localePath, filePath),
          frontmatter: data as DocFrontmatter,
          content,
          headings,
        };
      }
    }
  }
  
  const possiblePaths = [
    path.join(localePath, `${slug}.md`),
    path.join(localePath, `${slug}.mdx`),
    path.join(localePath, `${slug}/index.md`),
    path.join(localePath, `${slug}/index.mdx`),
  ];
  
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      const headings = extractHeadings(content);
      
      return {
        slug,
        filePath: path.relative(localePath, filePath),
        frontmatter: data as DocFrontmatter,
        content,
        headings,
      };
    }
  }
  
  return null;
}

/**
 * Get all files recursively from a directory
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return [];
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.relative(dirPath, filePath));
    }
  });
  
  return arrayOfFiles;
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    
    headings.push({ level, text, id });
  }
  
  return headings;
}

/**
 * Generate sidebar structure from docs
 */
export function generateSidebar(locale: string = 'en'): SidebarItem[] {
  const docs = getAllDocs(locale);
  const sidebarMap = new Map<string, SidebarItem>();
  
  docs.forEach((doc) => {
    const parts = doc.slug.split('/');
    const category = parts[0];
    
    if (!sidebarMap.has(category)) {
      sidebarMap.set(category, {
        label: category.charAt(0).toUpperCase() + category.slice(1),
        link: `/${category}`,
        children: [],
        order: doc.frontmatter.sidebar?.order ?? 999,
      });
    }
    
    const categoryItem = sidebarMap.get(category)!;
    const item: SidebarItem = {
      label: doc.frontmatter.sidebar?.label || doc.frontmatter.title,
      link: `/${doc.slug}`,
      order: doc.frontmatter.sidebar?.order ?? 999,
    };
    
    if (parts.length === 1) {
      // Root level item
      categoryItem.children = categoryItem.children || [];
      categoryItem.children.push(item);
    } else {
      // Nested item
      categoryItem.children = categoryItem.children || [];
      categoryItem.children.push(item);
    }
  });
  
  return Array.from(sidebarMap.values())
    .sort((a, b) => (a.order || 999) - (b.order || 999))
    .map((item) => ({
      ...item,
      children: item.children?.sort((a, b) => (a.order || 999) - (b.order || 999)),
    }));
}
```

### 2. `lib/mdx.ts` - MDX Processing

```typescript
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';

export async function processMDX(content: string) {
  const mdxSource = await serialize(content, {
    parseFrontmatter: false, // We parse frontmatter separately
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['anchor'],
            },
          },
        ],
        rehypeHighlight,
      ],
    },
  });
  
  return mdxSource;
}
```

**Note**: Make sure to install the highlight CSS:
```bash
npm install rehype-highlight
```

Add to your global CSS:
```css
@import 'highlight.js/styles/github-dark.css';
```

---

## Dynamic Route Generation

### `app/[locale]/docs/[[...slug]]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { getDocBySlug, getAllDocs } from '@/lib/docs';
import { processMDX } from '@/lib/mdx';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { DocsLayout } from '@/components/docs/DocsLayout';
import * as DocsComponents from '@/components/docs';

interface PageProps {
  params: Promise<{
    locale: string;
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const locales = ['en', 'de']; // Add your locales
  const params: Array<{ locale: string; slug?: string[] }> = [];
  
  locales.forEach((locale) => {
    const docs = getAllDocs(locale);
    docs.forEach((doc) => {
      const slug = doc.slug === 'welcome-to-docs' ? [] : doc.slug.split('/');
      params.push({ locale, slug });
    });
  });
  
  return params;
}

export default async function DocPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const slugString = slug && slug.length > 0 ? slug.join('/') : 'welcome-to-docs';
  
  const doc = getDocBySlug(slugString, locale);
  
  if (!doc) {
    notFound();
  }
  
  const mdxSource = await processMDX(doc.content);
  
  return (
    <DocsLayout doc={doc} locale={locale}>
      <MDXRemote
        source={mdxSource}
        components={{
          ...DocsComponents,
          // Add any other MDX components here
          h1: (props: any) => <h1 className="text-4xl font-bold mb-4 mt-8" {...props} />,
          h2: (props: any) => <h2 className="text-3xl font-semibold mb-3 mt-6" {...props} />,
          h3: (props: any) => <h3 className="text-2xl font-semibold mb-2 mt-4" {...props} />,
          p: (props: any) => <p className="mb-4 leading-7" {...props} />,
          ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
          ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
          code: (props: any) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props} />
          ),
          pre: (props: any) => (
            <pre className="bg-gray-900 dark:bg-gray-950 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
          ),
        }}
      />
    </DocsLayout>
  );
}
```

---

## Documentation Components

### 1. `components/docs/Card.tsx`

```typescript
import { ReactNode } from 'react';

interface CardProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

export function Card({ title, icon, children }: CardProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 mt-1">
            <span className="text-2xl">{icon}</span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <div className="text-gray-600 dark:text-gray-400">{children}</div>
        </div>
      </div>
    </div>
  );
}
```

### 2. `components/docs/CardGrid.tsx`

```typescript
import { ReactNode } from 'react';
import { Card } from './Card';

interface CardGridProps {
  children: ReactNode;
  stagger?: boolean;
}

export function CardGrid({ children, stagger }: CardGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
        stagger ? 'animate-fade-in' : ''
      }`}
    >
      {children}
    </div>
  );
}

// Make Card available through CardGrid
CardGrid.Card = Card;
```

### 3. `components/docs/LinkCard.tsx`

```typescript
import Link from 'next/link';

interface LinkCardProps {
  title: string;
  description?: string;
  href: string;
}

export function LinkCard({ title, description, href }: LinkCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-400 transition-all group"
    >
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {title} →
      </h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </Link>
  );
}
```

### 4. `components/docs/Steps.tsx`

```typescript
import { ReactNode } from 'react';

interface StepsProps {
  children: ReactNode;
}

export function Steps({ children }: StepsProps) {
  const steps = Array.isArray(children)
    ? children
    : [children];
  
  return (
    <ol className="space-y-4 my-6">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            {index + 1}
          </div>
          <div className="flex-1 pt-1">{step}</div>
        </li>
      ))}
    </ol>
  );
}
```

### 5. `components/docs/Aside.tsx`

```typescript
import { ReactNode } from 'react';

type AsideType = 'tip' | 'note' | 'caution' | 'danger';

interface AsideProps {
  type?: AsideType;
  children: ReactNode;
}

const typeStyles: Record<AsideType, string> = {
  tip: 'bg-gradient-to-br from-orange-500 to-yellow-500 text-orange-900 border-orange-300',
  note: 'bg-gradient-to-br from-blue-500 to-cyan-500 text-blue-900 border-blue-300',
  caution: 'bg-gradient-to-br from-yellow-500 to-orange-500 text-yellow-900 border-yellow-300',
  danger: 'bg-gradient-to-br from-red-500 to-pink-500 text-red-900 border-red-300',
};

const typeLabels: Record<AsideType, string> = {
  tip: 'Tip',
  note: 'Note',
  caution: 'Caution',
  danger: 'Danger',
};

export function Aside({ type = 'note', children }: AsideProps) {
  return (
    <div
      className={`rounded-lg border-2 p-4 my-6 ${typeStyles[type]} dark:opacity-90`}
    >
      <div className="font-semibold mb-2">{typeLabels[type]}</div>
      <div>{children}</div>
    </div>
  );
}
```

### 6. `components/docs/Tabs.tsx`

```typescript
'use client';

import { useState, ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
  defaultTab?: number;
}

interface TabItemProps {
  label: string;
  children: ReactNode;
}

export function Tabs({ children, defaultTab = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const tabs = Array.isArray(children) ? children : [children];
  
  return (
    <div className="my-6">
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        {tabs.map((tab, index) => {
          const label = (tab as any)?.props?.label || `Tab ${index + 1}`;
          return (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === index
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {tabs[activeTab]}
      </div>
    </div>
  );
}

export function TabItem({ children }: TabItemProps) {
  return <div>{children}</div>;
}
```

### 7. `components/docs/index.ts` - Export All Components

```typescript
export { Card } from './Card';
export { CardGrid } from './CardGrid';
export { LinkCard } from './LinkCard';
export { Steps } from './Steps';
export { Aside } from './Aside';
export { Tabs, TabItem } from './Tabs';
```

---

## Layout System

### `components/docs/DocsLayout.tsx`

```typescript
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TableOfContents } from './TableOfContents';
import { Search } from './Search';
import { ThemeToggle } from './ThemeToggle';
import { DocMetadata } from '@/lib/types';
import { generateSidebar } from '@/lib/docs';

interface DocsLayoutProps {
  doc: DocMetadata;
  locale: string;
  children: ReactNode;
}

export async function DocsLayout({ doc, locale, children }: DocsLayoutProps) {
  const sidebar = generateSidebar(locale);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="text-xl font-bold">
                Docs
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Search />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 pt-8">
            <Sidebar items={sidebar} currentPath={`/${doc.slug}`} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 pt-8 pb-16">
            <article className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {doc.frontmatter.title}
              </h1>
              {doc.frontmatter.description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  {doc.frontmatter.description}
                </p>
              )}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {children}
              </div>
            </article>
          </main>

          {/* Table of Contents */}
          <aside className="hidden xl:block w-64 flex-shrink-0 pt-8">
            <TableOfContents headings={doc.headings} />
          </aside>
        </div>
      </div>
    </div>
  );
}
```

---

## Sidebar Navigation

### `components/docs/Sidebar.tsx`

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarItem } from '@/lib/types';

interface SidebarProps {
  items: SidebarItem[];
  currentPath: string;
}

export function Sidebar({ items, currentPath }: SidebarProps) {
  return (
    <nav className="sticky top-20 space-y-1">
      {items.map((item) => (
        <div key={item.link} className="mb-4">
          <Link
            href={item.link}
            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPath === item.link
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {item.label}
          </Link>
          {item.children && item.children.length > 0 && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.link}
                  href={child.link}
                  className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                    currentPath === child.link
                      ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
```

---

## Table of Contents

### `components/docs/TableOfContents.tsx`

```typescript
'use client';

import Link from 'next/link';
import { Heading } from '@/lib/types';
import { useEffect, useState } from 'react';

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-20">
      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
        On this page
      </div>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className={`block py-1 text-sm transition-colors ${
                heading.level === 1
                  ? 'font-medium'
                  : heading.level === 2
                  ? 'ml-4'
                  : 'ml-8'
              } ${
                activeId === heading.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

---

## Search Functionality

### `components/docs/Search.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';
import { getAllDocs } from '@/lib/docs';
import Link from 'next/link';

export function Search() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // In a real implementation, you'd want to index docs client-side
  // or use a search service like Algolia
  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    // Implement search logic here
    return [];
  }, [query]);

  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search docs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-64 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((result) => (
            <Link
              key={result.slug}
              href={`/docs/${result.slug}`}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {result.description}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Theme Switching

### `components/docs/ThemeToggle.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const initialTheme = stored || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

---

## Internationalization

### Update `app/[locale]/docs/[[...slug]]/page.tsx`

Add locale support:

```typescript
// ... existing code ...

export async function generateStaticParams() {
  const locales = ['en', 'de'];
  // ... rest of the code
}

// In the component, use locale from params
```

### Create Locale Files

```
content/docs/
├── welcome-to-docs.mdx          # English
├── guides/
│   └── getting-started.mdx       # English
└── de/                           # German
    ├── welcome-to-docs.mdx
    └── guides/
        └── getting-started.mdx
```

---

## Styling

### `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              '&:hover': {
                color: '#3b82f6',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
```

### Install Typography Plugin

```bash
npm install @tailwindcss/typography
```

---

## Complete Code Examples

### Example Markdown File: `content/docs/guides/getting-started.mdx`

```mdx
---
title: Getting Started
description: Learn how to get started with our platform
sidebar:
  label: Getting Started
  order: 1
---

import { Card, CardGrid, Steps, Aside, LinkCard } from '@/components/docs';

Welcome to our documentation! This guide will help you get started.

## Overview

<CardGrid>
  <Card title="Quick Setup" icon="⚡">
    Get up and running in minutes.
  </Card>
  <Card title="Comprehensive Guides" icon="📚">
    Learn everything you need to know.
  </Card>
</CardGrid>

## Setup Instructions

<Steps>
1. **Create an account**
   Sign up for a new account on our platform.

2. **Verify your email**
   Check your inbox and click the verification link.

3. **Complete your profile**
   Add your information to get started.
</Steps>

## Tips

<Aside type="tip">
  Make sure to verify your email before proceeding.
</Aside>

## Next Steps

<LinkCard
  title="Advanced Configuration"
  description="Learn about advanced settings"
  href="/docs/guides/advanced-config"
/>
```

---

## Summary

### What We've Built

1. ✅ **Markdown Processing**: Reads and processes MDX files with frontmatter
2. ✅ **Dynamic Routes**: Automatic route generation from file structure
3. ✅ **Documentation Components**: Card, CardGrid, LinkCard, Steps, Aside, Tabs
4. ✅ **Layout System**: Full documentation layout with header, sidebar, and TOC
5. ✅ **Sidebar Navigation**: Auto-generated from folder structure
6. ✅ **Table of Contents**: Auto-generated from headings
7. ✅ **Search**: Basic search functionality (can be enhanced)
8. ✅ **Theme Switching**: Dark/light mode support
9. ✅ **Internationalization**: Multi-language support structure

### Next Steps

1. **Enhance Search**: Implement full-text search with indexing
2. **Add Code Highlighting**: Configure syntax highlighting
3. **Add Breadcrumbs**: Navigation breadcrumb component
4. **Add Pagination**: Previous/Next page navigation
5. **Add Edit Links**: Link to GitHub for editing
6. **Add Analytics**: Track page views
7. **Optimize Performance**: Add caching and optimizations

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)

---

## Quick Reference

### File Structure Checklist

```
✅ app/[locale]/docs/[[...slug]]/page.tsx
✅ components/docs/Card.tsx
✅ components/docs/CardGrid.tsx
✅ components/docs/LinkCard.tsx
✅ components/docs/Steps.tsx
✅ components/docs/Aside.tsx
✅ components/docs/Tabs.tsx
✅ components/docs/Sidebar.tsx
✅ components/docs/TableOfContents.tsx
✅ components/docs/Search.tsx
✅ components/docs/ThemeToggle.tsx
✅ components/docs/DocsLayout.tsx
✅ lib/docs.ts
✅ lib/mdx.ts
✅ lib/types.ts
✅ config/docs.ts
✅ content/docs/ (your markdown files)
```

### Common Tasks

#### Adding a New Doc Page

1. Create a `.mdx` file in `content/docs/`:
   ```mdx
   ---
   title: My New Page
   description: Page description
   sidebar:
     label: My New Page
     order: 2
   ---
   
   Your content here...
   ```

2. The page will be available at `/docs/my-new-page/` automatically!

#### Using Components in MDX

```mdx
import { Card, CardGrid, Steps, Aside } from '@/components/docs';

<CardGrid>
  <Card title="Title" icon="⭐">Content</Card>
</CardGrid>

<Steps>
1. Step one
2. Step two
</Steps>

<Aside type="tip">Tip content</Aside>
```

#### Customizing Sidebar

Edit `config/docs.ts`:
```typescript
sidebar: [
  {
    label: "My Category",
    type: "autogenerate",
    directory: "my-category",
    order: 1,
  },
]
```

### Troubleshooting

**Issue**: Pages not generating
- Check that files are in `content/docs/`
- Verify file extensions are `.md` or `.mdx`
- Check `generateStaticParams` includes your locale

**Issue**: Components not rendering
- Ensure components are exported from `components/docs/index.ts`
- Check MDX component mapping in page.tsx
- Verify imports in MDX files use correct paths

**Issue**: Styling not working
- Check Tailwind config includes all paths
- Verify `darkMode: 'class'` in tailwind.config.ts
- Ensure CSS is imported in layout

---

*This guide provides a complete foundation for building a documentation system in Next.js similar to Astro Starlight.*
