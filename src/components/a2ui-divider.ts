/**
 * A2UI Divider Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { DividerProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-divider")
export class A2UIDivider extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 1rem 0;
        }

        hr {
            border: none;
            height: 1px;
            background: #e0e0e0;
            margin: 0;
        }

        hr.solid {
            background: #e0e0e0;
        }

        hr.dashed {
            background: none;
            border-top: 1px dashed #ccc;
        }

        hr.dotted {
            background: none;
            border-top: 1px dotted #ccc;
        }
    `;

    @property({ type: Object })
    props: DividerProps = {};

    render() {
        const { style = "solid", styleProps } = this.props;
        const customStyles = stylePropsToObject(styleProps);

        return html`<hr class="${style}" style=${styleMap(customStyles)} />`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-divider": A2UIDivider;
    }
}
