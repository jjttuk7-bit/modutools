import type { ComponentType, ReactNode } from 'react';

export type CategoryId = 'business' | 'qr' | 'submit' | 'thumbnail' | 'image' | 'excel';

export interface ToolMeta {
  id: string;
  path: string;
  name: string;
  desc: string;
  icon: ReactNode;
}

export interface CategoryMeta {
  id: CategoryId;
  path: string;
  name: string;
  shortName: string;
  desc: string;
  tagline: string;
  accent: string;
  accentBg: string;
  icon: ReactNode;
  tools: ToolMeta[];
}

export type LazyToolComponent = ComponentType<Record<string, never>>;
