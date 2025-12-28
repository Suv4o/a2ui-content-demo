/**
 * A2UI Quote Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { QuoteProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-quote")
export class A2UIQuote extends LitElement {
    static styles = css`
    :host {
      display: block;
    }

    .quote {
      position: relative;
      padding: 1.5rem 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .quote::before {
      content: """;
      position: absolute;
      top: 0.5rem;
      left: 1rem;
      font-size: 3rem;
      color: #667eea;
      opacity: 0.3;
      font-family: Georgia, serif;
      line-height: 1;
    }

    .quote-text {
      font-size: 1.1rem;
      font-style: italic;
      color: #333;
      line-height: 1.8;
      margin: 0;
      padding-left: 1.5rem;
    }

    .quote-attribution {
      margin-top: 1rem;
      padding-left: 1.5rem;
      font-size: 0.875rem;
      color: #666;
    }

    .quote-author {
      font-weight: 600;
      color: #444;
    }

    .quote-source {
      font-style: italic;
    }

    .quote-source::before {
      content: ", ";
    }
  `;

    @property({ type: Object })
    props: QuoteProps = { text: "" };

    render() {
        const { text, author, source, style } = this.props;
        const customStyles = stylePropsToObject(style);

        return html`
            <blockquote class="quote" style=${styleMap(customStyles)}>
                <p class="quote-text">${text}</p>
                ${author || source
                    ? html`
                          <div class="quote-attribution">
                              — ${author ? html`<span class="quote-author">${author}</span>` : null}
                              ${source ? html`<span class="quote-source">${source}</span>` : null}
                          </div>
                      `
                    : null}
            </blockquote>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-quote": A2UIQuote;
    }
}
