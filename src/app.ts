/**
 * A2UI Content Demo - Main Application
 *
 * Demonstrates A2UI protocol: Content → LLM → UI Components
 * The LLM analyzes content and decides which UI components to render.
 */

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { Article } from "./types";
import { loadArticles } from "./services/content-parser";

// Import components
import "./components/article-card";
import "./components/article-view";

@customElement("a2ui-demo-app")
export class A2UIDemoApp extends LitElement {
    static styles = css`
        :host {
            display: block;
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
        }

        .home {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .logo {
            font-size: 3rem;
            margin-bottom: 0.5rem;
        }

        .title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1a1a2e;
            margin: 0 0 0.5rem 0;
        }

        .subtitle {
            font-size: 1.1rem;
            color: #666;
            margin: 0 0 1.5rem 0;
        }

        .concept-banner {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .concept-banner h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
        }

        .concept-banner p {
            margin: 0;
            opacity: 0.9;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
        }

        .loading {
            text-align: center;
            padding: 4rem 2rem;
            color: #666;
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #eee;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        footer {
            text-align: center;
            padding: 2rem;
            color: #888;
            font-size: 0.85rem;
        }

        footer a {
            color: #667eea;
            text-decoration: none;
        }
    `;

    @state() private articles: Article[] = [];
    @state() private selectedArticle: Article | null = null;
    @state() private loading = true;

    async connectedCallback() {
        super.connectedCallback();
        await this.loadContent();
    }

    private async loadContent() {
        this.loading = true;
        try {
            this.articles = await loadArticles();
        } catch (error) {
            console.error("Failed to load articles:", error);
        }
        this.loading = false;
    }

    private handleArticleSelect(e: CustomEvent<{ article: Article }>) {
        this.selectedArticle = e.detail.article;
    }

    private handleBack() {
        this.selectedArticle = null;
    }

    render() {
        if (this.selectedArticle) {
            return html` <article-view .article=${this.selectedArticle} @back=${this.handleBack}></article-view> `;
        }

        return html`
            <div class="home">
                <header class="header">
                    <div class="logo">🎨</div>
                    <h1 class="title">A2UI Content Demo</h1>
                    <p class="subtitle">UI driven by content, not user input</p>

                    <div class="concept-banner">
                        <h3>🔮 A2UI Protocol Demo</h3>
                        <p>
                            Click any article below. The content will be sent to an
                            <strong>LLM (Gemini)</strong> which analyzes it and returns
                            <strong>A2UI component JSON</strong> describing how to render the UI. <br /><br />
                            <strong>No hardcoded rules. The AI decides the layout.</strong>
                        </p>
                    </div>
                </header>

                ${this.loading
                    ? html`
                          <div class="loading">
                              <div class="loading-spinner"></div>
                              <p>Loading articles...</p>
                          </div>
                      `
                    : html`
                          <div class="articles-grid">
                              ${this.articles.map(
                                  (article) => html`
                                      <article-card
                                          .article=${article}
                                          @article-select=${this.handleArticleSelect}
                                      ></article-card>
                                  `
                              )}
                          </div>
                      `}

                <footer>
                    <p>
                        Built with <a href="https://lit.dev">Lit</a> • Inspired by
                        <a href="https://a2ui.org">A2UI Protocol</a>
                    </p>
                </footer>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-demo-app": A2UIDemoApp;
    }
}
