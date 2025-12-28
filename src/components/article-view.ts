/**
 * Article View Component
 *
 * THIS IS THE KEY A2UI COMPONENT:
 * It sends article content to the A2UI agent (LLM) which analyzes
 * the content and returns UI components to render.
 *
 * The UI is entirely determined by the LLM - NOT hardcoded rules.
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Article, A2UISurfaceUpdate } from "../types";
import { a2uiClient } from "../services/a2ui-client";

// Import the A2UI renderer
import "./a2ui-renderer";

@customElement("article-view")
export class ArticleView extends LitElement {
    static styles = css`
        :host {
            display: block;
            min-height: 100vh;
            background: white;
        }

        .back-button {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: white;
            border: none;
            padding: 0.75rem 1.25rem;
            border-radius: 25px;
            font-size: 0.9rem;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: transform 0.2s;
        }

        .back-button:hover {
            transform: scale(1.05);
        }

        .article-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 4rem 2rem 6rem;
        }

        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            color: #666;
        }

        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #eee;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .error {
            text-align: center;
            padding: 4rem 2rem;
            color: #c00;
        }

        .a2ui-explanation {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            max-width: 600px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            font-size: 0.85rem;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .a2ui-explanation strong {
            color: #4ecdc4;
        }

        .a2ui-explanation .info {
            margin-top: 0.5rem;
            opacity: 0.85;
            line-height: 1.5;
        }

        .component-count {
            display: inline-block;
            background: #667eea;
            padding: 0.2rem 0.6rem;
            border-radius: 12px;
            font-size: 0.75rem;
            margin-left: 0.5rem;
        }
    `;

    @property({ type: Object }) article!: Article;

    @state() private a2uiResponse: A2UISurfaceUpdate | null = null;
    @state() private loading = true;
    @state() private error: string | null = null;

    async connectedCallback() {
        super.connectedCallback();
        await this.fetchA2UI();
    }

    /**
     * Send article content to A2UI agent (LLM) to get UI components
     */
    private async fetchA2UI() {
        this.loading = true;
        this.error = null;

        try {
            // Send content to the A2UI agent - the LLM decides the UI
            this.a2uiResponse = await a2uiClient.render(this.article.content, this.article.meta);
        } catch (err) {
            this.error = err instanceof Error ? err.message : "Failed to render";
            console.error("A2UI Error:", err);
        }

        this.loading = false;
    }

    private handleBack() {
        this.dispatchEvent(new CustomEvent("back", { bubbles: true, composed: true }));
    }

    render() {
        return html`
            <button class="back-button" @click=${this.handleBack}>← Back to Articles</button>

            ${this.loading
                ? html`
                      <div class="loading">
                          <div class="loading-spinner"></div>
                          <p>🤖 AI is analyzing content and building UI...</p>
                      </div>
                  `
                : this.error
                ? html`
                      <div class="error">
                          <h2>Error</h2>
                          <p>${this.error}</p>
                      </div>
                  `
                : html`
                      <div class="article-container">
                          <a2ui-renderer
                              .components=${this.a2uiResponse?.surfaceUpdate.components || []}
                          ></a2ui-renderer>
                      </div>
                  `}
            ${this.a2uiResponse && !this.loading
                ? html`
                      <div class="a2ui-explanation">
                          <strong>🔮 A2UI Protocol in Action</strong>
                          <span class="component-count">
                              ${this.a2uiResponse.surfaceUpdate.components.length} components
                          </span>
                          <div class="info">
                              The LLM analyzed your article content and decided which UI components to render. No
                              hardcoded rules - the AI made all layout decisions based on content structure, metadata,
                              and context.
                          </div>
                      </div>
                  `
                : null}
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "article-view": ArticleView;
    }
}
