/**
 * A2UI Image Gallery Component
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { ImageGalleryProps } from "../types.js";
import { stylePropsToObject } from "../utils/style-utils.js";

@customElement("a2ui-image-gallery")
export class A2UIImageGallery extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        .gallery {
            display: grid;
            gap: 1rem;
        }

        .gallery.cols-1 {
            grid-template-columns: 1fr;
        }
        .gallery.cols-2 {
            grid-template-columns: repeat(2, 1fr);
        }
        .gallery.cols-3 {
            grid-template-columns: repeat(3, 1fr);
        }
        .gallery.cols-4 {
            grid-template-columns: repeat(4, 1fr);
        }

        @media (max-width: 768px) {
            .gallery.cols-3,
            .gallery.cols-4 {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 480px) {
            .gallery {
                grid-template-columns: 1fr !important;
            }
        }

        .gallery-item {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .gallery-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .gallery-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            display: block;
        }

        .gallery-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1rem;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
            color: white;
            font-size: 0.875rem;
        }

        /* Lightbox */
        .lightbox {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 2rem;
        }

        .lightbox img {
            max-width: 90vw;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 8px;
        }

        .lightbox-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .lightbox-caption {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            text-align: center;
            max-width: 80%;
        }
    `;

    @property({ type: Object })
    props: ImageGalleryProps = { images: [] };

    @state()
    private lightboxImage: { url: string; caption?: string } | null = null;

    render() {
        const { images, columns = 3, lightbox = true, style } = this.props;
        const customStyles = stylePropsToObject(style);

        return html`
            <div class="gallery cols-${columns}" style=${styleMap(customStyles)}>
                ${images.map(
                    (img) => html`
                        <div class="gallery-item" @click=${() => lightbox && this.openLightbox(img)}>
                            <img src="${img.url}" alt="${img.alt || img.caption || ""}" />
                            ${img.caption ? html`<div class="gallery-caption">${img.caption}</div>` : null}
                        </div>
                    `
                )}
            </div>

            ${this.lightboxImage
                ? html`
                      <div class="lightbox" @click=${this.closeLightbox}>
                          <button class="lightbox-close" @click=${this.closeLightbox}>×</button>
                          <img src="${this.lightboxImage.url}" alt="" />
                          ${this.lightboxImage.caption
                              ? html`<div class="lightbox-caption">${this.lightboxImage.caption}</div>`
                              : null}
                      </div>
                  `
                : null}
        `;
    }

    private openLightbox(img: { url: string; caption?: string }) {
        this.lightboxImage = img;
    }

    private closeLightbox() {
        this.lightboxImage = null;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "a2ui-image-gallery": A2UIImageGallery;
    }
}
