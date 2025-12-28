/**
 * Content Parser Service
 *
 * Parses markdown files and extracts:
 * - Frontmatter metadata
 * - Raw content for sending to A2UI agent
 */

import type { Article, ArticleMeta } from "../types";

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(markdown: string): { meta: ArticleMeta; content: string } {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
        return {
            meta: { title: "Untitled", author: "Unknown", date: new Date().toISOString() },
            content: markdown,
        };
    }

    const [, frontmatterStr, content] = match;
    const meta: Record<string, unknown> = {};

    // Simple YAML-like parsing
    const lines = frontmatterStr.split("\n");
    let currentKey = "";
    let inArray = false;
    let arrayItems: unknown[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Check for array item
        if (trimmed.startsWith("- ")) {
            if (inArray) {
                const value = trimmed.slice(2).trim();
                // Check if it's an object item (has key: value on same line)
                if (value.includes(": ")) {
                    const obj: Record<string, string> = {};
                    // Parse object properties
                    let objLine = value;
                    const urlMatch = objLine.match(/url:\s*"([^"]+)"/);
                    const captionMatch = objLine.match(/caption:\s*"([^"]+)"/);
                    if (urlMatch) obj.url = urlMatch[1];
                    if (captionMatch) obj.caption = captionMatch[1];
                    arrayItems.push(obj);
                } else {
                    // Simple string array item
                    arrayItems.push(value.replace(/^["'\[]|["'\]]$/g, ""));
                }
            }
            continue;
        }

        // Check for key: value
        const colonIndex = trimmed.indexOf(":");
        if (colonIndex > 0) {
            // Save previous array if exists
            if (inArray && currentKey) {
                meta[currentKey] = arrayItems;
                arrayItems = [];
                inArray = false;
            }

            currentKey = trimmed.slice(0, colonIndex).trim();
            let value = trimmed.slice(colonIndex + 1).trim();

            if (value === "" || value === "|") {
                // Array or multiline starts on next line
                inArray = true;
                arrayItems = [];
            } else if (value.startsWith("[") && value.endsWith("]")) {
                // Inline array
                meta[currentKey] = value
                    .slice(1, -1)
                    .split(",")
                    .map((s) => s.trim().replace(/^["']|["']$/g, ""));
            } else {
                // Simple value
                meta[currentKey] = value.replace(/^["']|["']$/g, "");
            }
        }
    }

    // Handle trailing array
    if (inArray && currentKey) {
        meta[currentKey] = arrayItems;
    }

    return {
        meta: meta as unknown as ArticleMeta,
        content: content.trim(),
    };
}

/**
 * Parse a markdown file into an Article object
 */
export async function parseArticle(id: string, markdown: string): Promise<Article> {
    const { meta, content } = parseFrontmatter(markdown);

    return {
        id,
        meta,
        content,
    };
}

/**
 * Extract a plain text excerpt from markdown
 */
export function extractExcerpt(markdown: string, maxLength = 150): string {
    // Remove markdown formatting
    const plainText = markdown
        .replace(/^#{1,6}\s+/gm, "") // Remove headings
        .replace(/\*\*|__/g, "") // Remove bold
        .replace(/\*|_/g, "") // Remove italic
        .replace(/`{1,3}[^`]*`{1,3}/g, "") // Remove code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
        .replace(/^>\s*/gm, "") // Remove blockquotes
        .replace(/^[-*+]\s+/gm, "") // Remove list markers
        .replace(/\n+/g, " ") // Collapse newlines
        .trim();

    if (plainText.length <= maxLength) return plainText;
    return plainText.slice(0, maxLength).trim() + "...";
}

/**
 * Load all articles from the public/articles directory
 */
export async function loadArticles(): Promise<Article[]> {
    // In a real app, this would be a server endpoint
    // For this demo, we hardcode the article list
    const articleFiles = [
        "space-exploration",
        "web-components",
        "mountain-photography",
        "healthy-eating-guide",
        "building-ai-chatbot",
        "startup-funding-guide",
        "italian-cooking",
        "digital-art-beginners",
    ];

    const articles: Article[] = [];

    for (const id of articleFiles) {
        try {
            const response = await fetch(`/articles/${id}.md`);
            if (response.ok) {
                const markdown = await response.text();
                const article = await parseArticle(id, markdown);
                articles.push(article);
            }
        } catch (error) {
            console.error(`Failed to load article: ${id}`, error);
        }
    }

    return articles;
}
