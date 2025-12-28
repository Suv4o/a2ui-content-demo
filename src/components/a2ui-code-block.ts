/**
 * A2UI Code Block Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { CodeBlockProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-code-block")
export class A2UICodeBlock extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .code-block {
            background: #1e1e1e;
            border-radius: 8px;
            overflow: hidden;
            font-family: "Fira Code", "Monaco", "Consolas", monospace;
        }

        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1rem;
            background: #2d2d2d;
            border-bottom: 1px solid #404040;
        }

        .code-title {
            color: #888;
            font-size: 0.875rem;
        }

        .code-language {
            color: #888;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .code-content {
            padding: 1rem;
            overflow-x: auto;
            margin: 0;
        }

        pre {
            margin: 0;
            color: #d4d4d4;
            font-size: 0.875rem;
            line-height: 1.6;
        }

        code {
            font-family: inherit;
        }

        .line-numbers {
            display: flex;
        }

        .line-numbers .numbers {
            color: #606060;
            text-align: right;
            padding-right: 1rem;
            margin-right: 1rem;
            border-right: 1px solid #404040;
            user-select: none;
        }

        .line-numbers .code-text {
            flex: 1;
        }

        .copy-btn {
            background: #404040;
            border: none;
            color: #d4d4d4;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.75rem;
        }

        .copy-btn:hover {
            background: #505050;
        }

        /* Basic syntax highlighting */
        .keyword {
            color: #569cd6;
        }
        .string {
            color: #ce9178;
        }
        .comment {
            color: #6a9955;
        }
        .function {
            color: #dcdcaa;
        }
    `;

    @property({ type: Object })
    props: CodeBlockProps = { code: "" };

    render() {
        const { code, language, title, showLineNumbers = false, style } = this.props;
        const lines = code.split("\n");
        const customStyles = stylePropsToObject(style);

        return html`
            <div class="code-block" style=${styleMap(customStyles)}>
                ${title || language
                    ? html`
                          <div class="code-header">
                              <span class="code-title">${title || ""}</span>
                              ${language ? html`<span class="code-language">${language}</span>` : null}
                          </div>
                      `
                    : null}

                <div class="code-content">
                    ${showLineNumbers
                        ? html`
                              <div class="line-numbers">
                                  <div class="numbers">${lines.map((_, i) => html`${i + 1}<br />`)}</div>
                                  <pre class="code-text"><code>${code}</code></pre>
                              </div>
                          `
                        : html`<pre><code>${code}</code></pre>`}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-code-block": A2UICodeBlock;
    }
}
