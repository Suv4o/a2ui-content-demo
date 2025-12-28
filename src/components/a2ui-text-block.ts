/**
 * A2UI Text Block Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import type { TextBlockProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-text-block")
export class A2UITextBlock extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .text-block {
            line-height: 1.8;
            color: #333;
        }

        .text-block.lead {
            font-size: 1.25rem;
            color: #555;
        }

        .text-block.small {
            font-size: 0.875rem;
            color: #666;
        }

        .text-block h1,
        .text-block h2,
        .text-block h3,
        .text-block h4 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: #1a1a2e;
        }

        .text-block h2 {
            font-size: 1.75rem;
            border-bottom: 2px solid #eee;
            padding-bottom: 0.5rem;
        }

        .text-block h3 {
            font-size: 1.4rem;
        }

        .text-block p {
            margin: 1rem 0;
        }

        .text-block a {
            color: #667eea;
            text-decoration: none;
        }

        .text-block a:hover {
            text-decoration: underline;
        }

        .text-block ul,
        .text-block ol {
            padding-left: 1.5rem;
            margin: 1rem 0;
        }

        .text-block li {
            margin: 0.5rem 0;
        }

        .text-block strong {
            color: #1a1a2e;
        }

        .text-block code {
            background: #f4f4f4;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.9em;
        }
    `;

    @property({ type: Object })
    props: TextBlockProps = { content: "" };

    render() {
        const { content, variant = "body", style } = this.props;
        const htmlContent = marked.parse(content);
        const customStyles = stylePropsToObject(style);

        return html`
            <div class="text-block ${variant}" style=${styleMap(customStyles)}>
                ${unsafeHTML(htmlContent as string)}
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-text-block": A2UITextBlock;
    }
}
