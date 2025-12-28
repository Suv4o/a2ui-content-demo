/**
 * A2UI Content Demo - Type Definitions
 *
 * These types represent the A2UI protocol messages and components
 * that flow between the agent (LLM) and the client (renderer).
 */

// ============================================
// A2UI Protocol Types
// ============================================

// Common style properties that any component can accept
export interface StyleProps {
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    borderRadius?: "none" | "small" | "medium" | "large" | "full";
    padding?: "none" | "small" | "medium" | "large";
    fontSize?: "small" | "medium" | "large" | "xlarge";
    fontWeight?: "normal" | "medium" | "semibold" | "bold";
    shadow?: "none" | "small" | "medium" | "large";
    border?: {
        width?: number;
        color?: string;
        style?: "solid" | "dashed" | "dotted";
    };
    gradient?: {
        from: string;
        to: string;
        direction?: "to-right" | "to-left" | "to-bottom" | "to-top" | "diagonal";
    };
}

// A2UI Surface Update - main message from agent
export interface A2UISurfaceUpdate {
    surfaceUpdate: {
        surfaceId: string;
        components: A2UIComponent[];
    };
    dataModelUpdate?: {
        surfaceId: string;
        contents: Array<{ key: string; value: unknown }>;
    };
}

// Individual A2UI component
export interface A2UIComponent {
    id: string;
    component: A2UIComponentType;
}

// Union of all possible component types
export type A2UIComponentType =
    | { HeroSection: HeroSectionProps }
    | { TextBlock: TextBlockProps }
    | { ImageGallery: ImageGalleryProps }
    | { CodeBlock: CodeBlockProps }
    | { Card: CardProps }
    | { Column: ColumnProps }
    | { Row: RowProps }
    | { Callout: CalloutProps }
    | { List: ListProps }
    | { Quote: QuoteProps }
    | { Table: TableProps }
    | { Metadata: MetadataProps }
    | { Divider: DividerProps };

// ============================================
// Component Property Types
// ============================================

export interface HeroSectionProps {
    title: string;
    subtitle?: string;
    imageUrl?: string;
    overlay?: boolean;
    height?: "small" | "medium" | "large" | "full";
    style?: StyleProps;
}

export interface TextBlockProps {
    content: string;
    variant?: "body" | "lead" | "small";
    style?: StyleProps;
}

export interface ImageGalleryProps {
    images: Array<{
        url: string;
        caption?: string;
        alt?: string;
    }>;
    columns?: number;
    lightbox?: boolean;
    style?: StyleProps;
}

export interface CodeBlockProps {
    code: string;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
    style?: StyleProps;
}

export interface CardProps {
    title?: string;
    content?: string;
    imageUrl?: string;
    variant?: "elevated" | "outlined" | "filled";
    style?: StyleProps;
}

export interface ColumnProps {
    children: string[]; // Component IDs
    gap?: "none" | "small" | "medium" | "large";
    align?: "start" | "center" | "end" | "stretch";
    style?: StyleProps;
}

export interface RowProps {
    children: string[]; // Component IDs
    gap?: "none" | "small" | "medium" | "large";
    wrap?: boolean;
    style?: StyleProps;
}

export interface CalloutProps {
    content: string;
    type?: "info" | "warning" | "success" | "tip";
    title?: string;
    style?: StyleProps;
}

export interface ListProps {
    items: string[];
    ordered?: boolean;
    icon?: string;
    style?: StyleProps;
}

export interface QuoteProps {
    text: string;
    author?: string;
    source?: string;
    style?: StyleProps;
}

export interface TableProps {
    headers: string[];
    rows: string[][];
    caption?: string;
    style?: StyleProps;
}

export interface MetadataProps {
    author?: string;
    date?: string;
    tags?: string[];
    readTime?: string;
    style?: StyleProps;
}

export interface DividerProps {
    style?: "solid" | "dashed" | "dotted";
    styleProps?: StyleProps;
}

// ============================================
// Article Types (for content loading)
// ============================================

export interface ArticleMeta {
    title: string;
    author: string;
    date: string;
    heroImage?: string;
    tags?: string[];
    images?: Array<{ url: string; caption: string }>;
}

export interface Article {
    id: string;
    meta: ArticleMeta;
    content: string;
}

export interface ArticleCard {
    id: string;
    title: string;
    author: string;
    date: string;
    excerpt: string;
    thumbnail?: string;
    tags: string[];
}
