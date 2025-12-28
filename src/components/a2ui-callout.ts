/**
 * A2UI Callout Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import type { CalloutProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-callout")
export class A2UICallout extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .callout {
            padding: 1rem 1.25rem;
            border-radius: 8px;
            border-left: 4px solid;
        }

        .callout.info {
            background: #e7f3ff;
            border-color: #2196f3;
        }

        .callout.warning {
            background: #fff8e1;
            border-color: #ff9800;
        }

        .callout.success {
            background: #e8f5e9;
            border-color: #4caf50;
        }

        .callout.tip {
            background: #f3e5f5;
            border-color: #9c27b0;
        }

        .callout-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .callout.info .callout-title {
            color: #1565c0;
        }
        .callout.warning .callout-title {
            color: #e65100;
        }
        .callout.success .callout-title {
            color: #2e7d32;
        }
        .callout.tip .callout-title {
            color: #6a1b9a;
        }

        .callout-icon {
            font-size: 1.2rem;
        }

        .callout-content {
            line-height: 1.6;
        }

        .callout-content p {
            margin: 0.5rem 0;
        }

        .callout-content p:first-child {
            margin-top: 0;
        }

        .callout-content p:last-child {
            margin-bottom: 0;
        }
    `;

    @property({ type: Object })
    props: CalloutProps = { content: "" };

    private getIcon(type: string): string {
        switch (type) {
            case "info":
                return "ℹ️";
            case "warning":
                return "⚠️";
            case "success":
                return "✅";
            case "tip":
                return "💡";
            default:
                return "📝";
        }
    }

    render() {
        const { content, type = "info", title, style } = this.props;
        const htmlContent = marked.parse(content);
        const customStyles = stylePropsToObject(style);

        return html`
            <div class="callout ${type}" style=${styleMap(customStyles)}>
                ${title
                    ? html`
                          <div class="callout-title">
                              <span class="callout-icon">${this.getIcon(type)}</span>
                              ${title}
                          </div>
                      `
                    : null}
                <div class="callout-content">${unsafeHTML(htmlContent as string)}</div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-callout": A2UICallout;
    }
}
