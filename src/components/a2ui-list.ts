/**
 * A2UI List Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { ListProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-list")
export class A2UIList extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        ul,
        ol {
            margin: 0;
            padding-left: 1.5rem;
        }

        .custom-icon {
            list-style: none;
            padding-left: 0;
        }

        li {
            margin: 0.5rem 0;
            line-height: 1.6;
            color: #333;
        }

        .custom-icon li {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .icon {
            flex-shrink: 0;
        }
    `;

    @property({ type: Object })
    props: ListProps = { items: [] };

    render() {
        const { items, ordered = false, icon, style } = this.props;
        const customStyles = stylePropsToObject(style);

        if (icon) {
            return html`
                <ul class="custom-icon" style=${styleMap(customStyles)}>
                    ${items.map(
                        (item) => html`
                            <li>
                                <span class="icon">${icon}</span>
                                <span>${item}</span>
                            </li>
                        `
                    )}
                </ul>
            `;
        }

        if (ordered) {
            return html`
                <ol style=${styleMap(customStyles)}>
                    ${items.map((item) => html`<li>${item}</li>`)}
                </ol>
            `;
        }

        return html`
            <ul style=${styleMap(customStyles)}>
                ${items.map((item) => html`<li>${item}</li>`)}
            </ul>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-list": A2UIList;
    }
}
