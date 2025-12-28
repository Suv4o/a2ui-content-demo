/**
 * Article Card Component
 *
 * Displays an article preview in the list view.
 * When clicked, the article will be sent to the A2UI agent (LLM)
 * to determine its layout.
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { Article } from "../types";
import { extractExcerpt } from "../services/content-parser";

@customElement("article-card")
export class ArticleCard extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
            height: 100%;
            display: flex;
            flex-direction: column;
            border-left: 4px solid #667eea;
        }

        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .thumbnail {
            width: 100%;
            height: 180px;
            object-fit: cover;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .thumbnail.placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }

        .content {
            padding: 1.25rem;
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .ai-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.75rem;
            color: #666;
            background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            margin-bottom: 0.75rem;
            width: fit-content;
        }

        .title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0 0 0.5rem 0;
            color: #1a1a2e;
            line-height: 1.3;
        }

        .meta {
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 0.75rem;
        }

        .excerpt {
            font-size: 0.9rem;
            color: #444;
            line-height: 1.5;
            flex: 1;
        }

        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .tag {
            font-size: 0.75rem;
            background: #e8f4f8;
            color: #0077b6;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
        }
    `;

    @property({ type: Object }) article!: Article;

    private get thumbnail(): string | undefined {
        return this.article.meta.heroImage || this.article.meta.images?.[0]?.url;
    }

    private handleClick() {
        this.dispatchEvent(
            new CustomEvent("article-select", {
                detail: { article: this.article },
                bubbles: true,
                composed: true,
            })
        );
    }

    render() {
        const excerpt = extractExcerpt(this.article.content, 120);

        return html`
            <div class="card" @click=${this.handleClick}>
                ${this.thumbnail
                    ? html`<img class="thumbnail" src=${this.thumbnail} alt="" />`
                    : html`<div class="thumbnail placeholder">🤖</div>`}

                <div class="content">
                    <span class="ai-badge"> 🔮 AI-Driven Layout </span>

                    <h3 class="title">${this.article.meta.title}</h3>

                    <div class="meta">By ${this.article.meta.author} · ${this.article.meta.date}</div>

                    <p class="excerpt">${excerpt}</p>

                    ${this.article.meta.tags?.length
                        ? html`
                              <div class="tags">
                                  ${this.article.meta.tags.map((tag) => html`<span class="tag">${tag}</span>`)}
                              </div>
                          `
                        : null}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "article-card": ArticleCard;
    }
}
