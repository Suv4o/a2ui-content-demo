/**
 * A2UI Style Utilities
 *
 * Helper functions to convert StyleProps to CSS styles
 */

import type { StyleProps } from "../types.js";

/**
 * Border radius value mapping
 */
const BORDER_RADIUS_MAP: Record<string, string> = {
    none: "0",
    small: "4px",
    medium: "8px",
    large: "16px",
    full: "9999px",
};

/**
 * Padding value mapping
 */
const PADDING_MAP: Record<string, string> = {
    none: "0",
    small: "0.5rem",
    medium: "1rem",
    large: "2rem",
};

/**
 * Font size value mapping
 */
const FONT_SIZE_MAP: Record<string, string> = {
    small: "0.875rem",
    medium: "1rem",
    large: "1.25rem",
    xlarge: "1.5rem",
};

/**
 * Font weight value mapping
 */
const FONT_WEIGHT_MAP: Record<string, string> = {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
};

/**
 * Shadow value mapping
 */
const SHADOW_MAP: Record<string, string> = {
    none: "none",
    small: "0 2px 4px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 12px rgba(0, 0, 0, 0.15)",
    large: "0 8px 24px rgba(0, 0, 0, 0.2)",
};

/**
 * Gradient direction mapping
 */
const GRADIENT_DIRECTION_MAP: Record<string, string> = {
    "to-right": "to right",
    "to-left": "to left",
    "to-bottom": "to bottom",
    "to-top": "to top",
    diagonal: "135deg",
};

/**
 * Converts StyleProps to a CSS style string
 */
export function stylePropsToCSS(style?: StyleProps): string {
    if (!style) return "";

    const styles: string[] = [];

    // Background color or gradient
    if (style.gradient) {
        const direction = GRADIENT_DIRECTION_MAP[style.gradient.direction || "diagonal"];
        styles.push(`background: linear-gradient(${direction}, ${style.gradient.from}, ${style.gradient.to})`);
    } else if (style.backgroundColor) {
        styles.push(`background-color: ${style.backgroundColor}`);
    }

    // Text color
    if (style.textColor) {
        styles.push(`color: ${style.textColor}`);
    }

    // Border radius
    if (style.borderRadius) {
        styles.push(`border-radius: ${BORDER_RADIUS_MAP[style.borderRadius] || style.borderRadius}`);
    }

    // Padding
    if (style.padding) {
        styles.push(`padding: ${PADDING_MAP[style.padding] || style.padding}`);
    }

    // Font size
    if (style.fontSize) {
        styles.push(`font-size: ${FONT_SIZE_MAP[style.fontSize] || style.fontSize}`);
    }

    // Font weight
    if (style.fontWeight) {
        styles.push(`font-weight: ${FONT_WEIGHT_MAP[style.fontWeight] || style.fontWeight}`);
    }

    // Shadow
    if (style.shadow) {
        styles.push(`box-shadow: ${SHADOW_MAP[style.shadow] || style.shadow}`);
    }

    // Border
    if (style.border) {
        const width = style.border.width || 1;
        const color = style.border.color || "#e0e0e0";
        const borderStyle = style.border.style || "solid";
        styles.push(`border: ${width}px ${borderStyle} ${color}`);
    }

    return styles.join("; ");
}

/**
 * Converts StyleProps to a style object for use with Lit's styleMap
 */
export function stylePropsToObject(style?: StyleProps): Record<string, string> {
    if (!style) return {};

    const styles: Record<string, string> = {};

    // Background color or gradient
    if (style.gradient) {
        const direction = GRADIENT_DIRECTION_MAP[style.gradient.direction || "diagonal"];
        styles.background = `linear-gradient(${direction}, ${style.gradient.from}, ${style.gradient.to})`;
    } else if (style.backgroundColor) {
        styles.backgroundColor = style.backgroundColor;
    }

    // Text color
    if (style.textColor) {
        styles.color = style.textColor;
    }

    // Border radius
    if (style.borderRadius) {
        styles.borderRadius = BORDER_RADIUS_MAP[style.borderRadius] || style.borderRadius;
    }

    // Padding
    if (style.padding) {
        styles.padding = PADDING_MAP[style.padding] || style.padding;
    }

    // Font size
    if (style.fontSize) {
        styles.fontSize = FONT_SIZE_MAP[style.fontSize] || style.fontSize;
    }

    // Font weight
    if (style.fontWeight) {
        styles.fontWeight = FONT_WEIGHT_MAP[style.fontWeight] || style.fontWeight;
    }

    // Shadow
    if (style.shadow) {
        styles.boxShadow = SHADOW_MAP[style.shadow] || style.shadow;
    }

    // Border
    if (style.border) {
        const width = style.border.width || 1;
        const color = style.border.color || "#e0e0e0";
        const borderStyle = style.border.style || "solid";
        styles.border = `${width}px ${borderStyle} ${color}`;
    }

    return styles;
}
