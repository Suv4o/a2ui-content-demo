/**
 * A2UI Card Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import type { CardProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-card")
export class A2UICard extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .card {
            border-radius: 12px;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
            transform: translateY(-2px);
        }

        .card.elevated {
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .card.elevated:hover {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .card.outlined {
            background: white;
            border: 1px solid #e0e0e0;
        }

        .card.filled {
            background: #f5f5f5;
        }

        .card-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .card-content {
            padding: 1.5rem;
        }

        .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 0 0 0.75rem 0;
            color: #1a1a2e;
        }

        .card-body {
            color: #666;
            line-height: 1.6;
        }

        .card-body p {
            margin: 0.5rem 0;
        }

        .card-body p:first-child {
            margin-top: 0;
        }

        .card-body p:last-child {
            margin-bottom: 0;
        }
    `;

    @property({ type: Object })
    props: CardProps = {};

    render() {
        const { title, content, imageUrl, variant = "elevated", style } = this.props;
        const htmlContent = content ? marked.parse(content) : "";
        const customStyles = stylePropsToObject(style);

        return html`
            <div class="card ${variant}" style=${styleMap(customStyles)}>
                ${imageUrl ? html`<img class="card-image" src="${imageUrl}" alt="${title || ""}" />` : null}
                <div class="card-content">
                    ${title ? html`<h3 class="card-title">${title}</h3>` : null}
                    ${content ? html`<div class="card-body">${unsafeHTML(htmlContent as string)}</div>` : null}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-card": A2UICard;
    }
}
