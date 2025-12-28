/**
 * A2UI Table Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { TableProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-table")
export class A2UITable extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .table-wrapper {
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }

        th {
            background: #f5f5f5;
            font-weight: 600;
            text-align: left;
            padding: 0.75rem 1rem;
            border-bottom: 2px solid #ddd;
            color: #333;
        }

        td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #eee;
            color: #555;
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover td {
            background: #f9f9f9;
        }

        caption {
            caption-side: bottom;
            padding: 0.75rem;
            font-size: 0.875rem;
            color: #666;
            font-style: italic;
            text-align: center;
        }
    `;

    @property({ type: Object })
    props: TableProps = { headers: [], rows: [] };

    render() {
        const { headers, rows, caption, style } = this.props;
        const customStyles = stylePropsToObject(style);

        return html`
            <div class="table-wrapper" style=${styleMap(customStyles)}>
                <table>
                    ${caption
                        ? html`<caption>
                              ${caption}
                          </caption>`
                        : null}
                    <thead>
                        <tr>
                            ${headers.map((h) => html`<th>${h}</th>`)}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(
                            (row) => html`
                                <tr>
                                    ${row.map((cell) => html`<td>${cell}</td>`)}
                                </tr>
                            `
                        )}
                    </tbody>
                </table>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-table": A2UITable;
    }
}
