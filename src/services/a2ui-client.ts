/**
 * A2UI Client Service
 *
 * This service communicates with the A2UI agent (backend) to get
 * UI component descriptions based on content. The agent uses an LLM
 * to analyze the content and decide which components to render.
 */

import type { A2UISurfaceUpdate, ArticleMeta } from "../types.js";

const API_BASE = "http://localhost:3001/api/a2ui";

export class A2UIClient {
    /**
     * Send content to the A2UI agent and get back component descriptions
     * The LLM analyzes the content and returns appropriate UI components
     */
    async render(content: string, meta: ArticleMeta): Promise<A2UISurfaceUpdate> {
        try {
            const response = await fetch(`${API_BASE}/render`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content, meta }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to get A2UI response");
            }

            const data = await response.json();
            return data as A2UISurfaceUpdate;
        } catch (error) {
            console.error("A2UI Client Error:", error);
            // Return a fallback UI if the agent fails
            return this.getFallbackUI(content, meta);
        }
    }

    /**
     * Fallback UI when the agent is unavailable
     * This provides a basic rendering without LLM assistance
     */
    private getFallbackUI(content: string, meta: ArticleMeta): A2UISurfaceUpdate {
        const components: A2UISurfaceUpdate["surfaceUpdate"]["components"] = [
            {
                id: "meta-1",
                component: {
                    Metadata: {
                        author: meta.author,
                        date: meta.date,
                        tags: meta.tags,
                    },
                },
            },
            {
                id: "title-1",
                component: {
                    HeroSection: {
                        title: meta.title,
                        imageUrl: meta.heroImage,
                        height: "medium",
                    },
                },
            },
            {
                id: "content-1",
                component: {
                    TextBlock: {
                        content: content,
                        variant: "body",
                    },
                },
            },
        ];

        return {
            surfaceUpdate: {
                surfaceId: "article-view",
                components,
            },
        };
    }
}

// Export singleton instance
export const a2uiClient = new A2UIClient();
