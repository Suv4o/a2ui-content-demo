/**
 * A2UI Component Renderer
 *
 * This is the core A2UI rendering component. It receives A2UI JSON
 * from the agent and renders the appropriate Lit components.
 * The UI is entirely determined by the LLM's analysis of the content.
 */

import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import type { A2UIComponent, A2UIComponentType } from "../types.js";

// Import individual component renderers
import "./a2ui-hero.js";
import "./a2ui-text-block.js";
import "./a2ui-image-gallery.js";
import "./a2ui-code-block.js";
import "./a2ui-card.js";
import "./a2ui-callout.js";
import "./a2ui-list.js";
import "./a2ui-quote.js";
import "./a2ui-table.js";
import "./a2ui-metadata.js";
import "./a2ui-divider.js";

@customElement("a2ui-renderer")
export class A2UIRenderer extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .a2ui-surface {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .a2ui-row {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .a2ui-column {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            flex: 1;
        }

        .error {
            padding: 1rem;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 8px;
            color: #c00;
        }
    `;

    @property({ type: Array })
    components: A2UIComponent[] = [];

    // Store components by ID for layout references
    private componentMap = new Map<string, A2UIComponent>();

    render() {
        // Build component map for layout references
        this.componentMap.clear();
        this.components.forEach((c) => this.componentMap.set(c.id, c));

        return html` <div class="a2ui-surface">${this.components.map((c) => this.renderComponent(c))}</div> `;
    }

    private renderComponent(component: A2UIComponent): TemplateResult {
        const { id, component: comp } = component;

        // Get the component type (first key in the object)
        const type = Object.keys(comp)[0] as keyof A2UIComponentType;
        const props = (comp as Record<string, unknown>)[type];

        switch (type) {
            case "HeroSection":
                return html`<a2ui-hero .props=${props}></a2ui-hero>`;

            case "TextBlock":
                return html`<a2ui-text-block .props=${props}></a2ui-text-block>`;

            case "ImageGallery":
                return html`<a2ui-image-gallery .props=${props}></a2ui-image-gallery>`;

            case "CodeBlock":
                return html`<a2ui-code-block .props=${props}></a2ui-code-block>`;

            case "Card":
                return html`<a2ui-card .props=${props}></a2ui-card>`;

            case "Callout":
                return html`<a2ui-callout .props=${props}></a2ui-callout>`;

            case "List":
                return html`<a2ui-list .props=${props}></a2ui-list>`;

            case "Quote":
                return html`<a2ui-quote .props=${props}></a2ui-quote>`;

            case "Table":
                return html`<a2ui-table .props=${props}></a2ui-table>`;

            case "Metadata":
                return html`<a2ui-metadata .props=${props}></a2ui-metadata>`;

            case "Divider":
                return html`<a2ui-divider .props=${props}></a2ui-divider>`;

            case "Row":
                return this.renderRow(props as { children: string[]; gap?: string });

            case "Column":
                return this.renderColumn(props as { children: string[]; gap?: string });

            default:
                return html`<div class="error">Unknown component: ${type}</div>`;
        }
    }

    private renderRow(props: { children: string[]; gap?: string }): TemplateResult {
        const children = props.children
            .map((id) => this.componentMap.get(id))
            .filter((c): c is A2UIComponent => c !== undefined);

        return html`
            <div class="a2ui-row" style="gap: ${this.getGapSize(props.gap)}">
                ${children.map((c) => this.renderComponent(c))}
            </div>
        `;
    }

    private renderColumn(props: { children: string[]; gap?: string }): TemplateResult {
        const children = props.children
            .map((id) => this.componentMap.get(id))
            .filter((c): c is A2UIComponent => c !== undefined);

        return html`
            <div class="a2ui-column" style="gap: ${this.getGapSize(props.gap)}">
                ${children.map((c) => this.renderComponent(c))}
            </div>
        `;
    }

    private getGapSize(gap?: string): string {
        switch (gap) {
            case "none":
                return "0";
            case "small":
                return "0.5rem";
            case "large":
                return "2rem";
            default:
                return "1rem";
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-renderer": A2UIRenderer;
    }
}
