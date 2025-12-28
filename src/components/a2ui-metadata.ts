/**
 * A2UI Metadata Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { MetadataProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-metadata")
export class A2UIMetadata extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .metadata {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
            color: #666;
            font-size: 0.9rem;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.4rem;
        }

        .meta-icon {
            opacity: 0.7;
        }

        .meta-label {
            font-weight: 500;
            color: #444;
        }

        .tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .tag {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
        }

        .divider {
            width: 1px;
            height: 1rem;
            background: #ddd;
        }
    `;

    @property({ type: Object })
    props: MetadataProps = {};

    render() {
        const { author, date, tags, readTime, style } = this.props;
        const formattedDate = date ? this.formatDate(date) : null;
        const customStyles = stylePropsToObject(style);

        return html`
            <div class="metadata" style=${styleMap(customStyles)}>
                ${author
                    ? html`
                          <div class="meta-item">
                              <span class="meta-icon">✍️</span>
                              <span class="meta-label">${author}</span>
                          </div>
                      `
                    : null}
                ${formattedDate
                    ? html`
                          ${author ? html`<span class="divider"></span>` : null}
                          <div class="meta-item">
                              <span class="meta-icon">📅</span>
                              <span>${formattedDate}</span>
                          </div>
                      `
                    : null}
                ${readTime
                    ? html`
                          <span class="divider"></span>
                          <div class="meta-item">
                              <span class="meta-icon">⏱️</span>
                              <span>${readTime}</span>
                          </div>
                      `
                    : null}
                ${tags && tags.length > 0
                    ? html`
                          <span class="divider"></span>
                          <div class="tags">${tags.map((tag) => html`<span class="tag">${tag}</span>`)}</div>
                      `
                    : null}
            </div>
        `;
    }

    private formatDate(dateStr: string): string {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-metadata": A2UIMetadata;
    }
}
