/**
 * A2UI Hero Section Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { HeroSectionProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-hero")
export class A2UIHero extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .hero {
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .hero.small {
            min-height: 200px;
        }
        .hero.medium {
            min-height: 350px;
        }
        .hero.large {
            min-height: 500px;
        }
        .hero.full {
            min-height: 80vh;
        }

        .hero-image {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
        }

        .hero-content {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 3rem;
            height: 100%;
            min-height: inherit;
        }

        .hero-title {
            font-size: 3rem;
            font-weight: 800;
            margin: 0 0 1rem 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            line-height: 1.2;
        }

        .hero-subtitle {
            font-size: 1.25rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
            .hero-title {
                font-size: 2rem;
            }
            .hero-subtitle {
                font-size: 1rem;
            }
        }
    `;

    @property({ type: Object })
    props: HeroSectionProps = { title: "" };

    render() {
        const { title, subtitle, imageUrl, overlay = true, height = "medium", style } = this.props;
        const customStyles = stylePropsToObject(style);

        return html`
            <div class="hero ${height}" style=${styleMap(customStyles)}>
                ${imageUrl ? html`<img class="hero-image" src="${imageUrl}" alt="${title}" />` : null}
                ${imageUrl && overlay ? html`<div class="hero-overlay"></div>` : null}
                <div class="hero-content">
                    <h1 class="hero-title" style=${style?.textColor ? styleMap({ color: style.textColor }) : ""}>
                        ${title}
                    </h1>
                    ${subtitle ? html`<p class="hero-subtitle">${subtitle}</p>` : null}
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-hero": A2UIHero;
    }
}
