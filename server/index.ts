/**
 * A2UI Content Demo - Node.js Agent Server
 *
 * This server uses Gemini LLM to analyze markdown content and generate
 * A2UI component JSON that the client renders.
 *
 * THE A2UI PROTOCOL:
 * 1. Client sends article content to the agent
 * 2. Agent sends content + A2UI schema to Gemini
 * 3. Gemini analyzes content and returns A2UI components JSON
 * 4. Client renders the components
 */

import express, { Request, Response } from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Types
interface ArticleMeta {
    title?: string;
    author?: string;
    date?: string;
    heroImage?: string;
    tags?: string[];
    images?: Array<{ url: string; caption: string }>;
}

interface RenderRequestBody {
    content: string;
    meta?: ArticleMeta;
}

interface A2UIComponent {
    id: string;
    component: Record<string, unknown>;
}

interface A2UISurfaceUpdate {
    surfaceUpdate: {
        surfaceId: string;
        components: A2UIComponent[];
    };
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load A2UI schema
const A2UI_SCHEMA = JSON.parse(readFileSync(join(__dirname, "a2ui-schema.json"), "utf-8"));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
    },
});

const app = express();
app.use(cors());
app.use(express.json());

// System prompt that tells Gemini how to generate A2UI components
const SYSTEM_PROMPT = `You are an A2UI agent. Your job is to analyze article content and generate a UI layout using A2UI components WITH CUSTOM STYLING.

CRITICAL: You must respond with a valid JSON object following the A2UI schema.

## Style Properties (Available on ALL components):

Every component accepts an optional "style" property with these options:

\`\`\`typescript
{
  "style": {
    "backgroundColor": "#hex or color name",      // Background color
    "textColor": "#hex or color name",            // Text color
    "accentColor": "#hex or color name",          // Accent/highlight color
    "borderRadius": "none|small|medium|large|full", // Corner rounding
    "padding": "none|small|medium|large",         // Inner spacing
    "fontSize": "small|medium|large|xlarge",      // Text size
    "fontWeight": "normal|medium|semibold|bold",  // Text weight
    "shadow": "none|small|medium|large",          // Box shadow
    "border": {
      "width": 1,                                  // Border width in pixels
      "color": "#hex or color name",
      "style": "solid|dashed|dotted"
    },
    "gradient": {
      "from": "#hex color",                        // Gradient start
      "to": "#hex color",                          // Gradient end
      "direction": "to-right|to-left|to-bottom|to-top|diagonal"
    }
  }
}
\`\`\`

## Available Components:

1. **HeroSection** - Full-width hero with image, title, subtitle
   - Use for: Articles with prominent images, feature articles, visual stories
   - Properties: title, subtitle, imageUrl, overlay, height (small|medium|large|full), style

2. **TextBlock** - Rich text content (supports markdown)
   - Use for: Body paragraphs, introductions, conclusions
   - Properties: content (markdown string), variant (body|lead|small), style

3. **ImageGallery** - Grid of images with optional lightbox
   - Use for: Photography articles, visual guides, portfolios
   - Properties: images [{url, caption, alt}], columns (1-4), lightbox, style

4. **CodeBlock** - Syntax-highlighted code
   - Use for: Technical articles, tutorials, documentation
   - Properties: code, language, title, showLineNumbers, style

5. **Card** - Contained content block
   - Use for: Summaries, related content, feature boxes
   - Properties: title, content, imageUrl, variant (elevated|outlined|filled), style

6. **Column** - Vertical layout container
   - Use for: Main content flow, stacking elements
   - Properties: children (array of component IDs), gap, align, style

7. **Row** - Horizontal layout container
   - Use for: Side-by-side content, multi-column layouts
   - Properties: children (array of component IDs), gap, wrap, style

8. **Callout** - Highlighted information box
   - Use for: Tips, warnings, important notes
   - Properties: content, type (info|warning|success|tip), title, style

9. **List** - Bulleted or numbered list
   - Use for: Steps, features, items
   - Properties: items (array of strings), ordered, icon, style

10. **Quote** - Blockquote with attribution
    - Use for: Citations, testimonials, highlighted quotes
    - Properties: text, author, source, style

11. **Table** - Data table
    - Use for: Comparisons, data, specifications
    - Properties: headers, rows, caption, style

12. **Metadata** - Article metadata display
    - Use for: Author info, date, tags
    - Properties: author, date, tags, readTime, style

13. **Divider** - Visual separator
    - Use for: Section breaks
    - Properties: style (solid|dashed|dotted), styleProps

## Content-Based Styling Guidelines:

IMPORTANT: Choose styling based on the article's TOPIC and MOOD:

### 1. **Nature/Outdoor Content** (photography, travel, hiking)
   - Use earthy, natural colors: greens (#2d5016, #4a7c23), browns, sky blues
   - Gradients: forest greens to light green, sunset oranges
   - Soft shadows, medium border radius
   - Example: \`"gradient": { "from": "#2d5016", "to": "#6b8e23", "direction": "diagonal" }\`

### 2. **Technology/Code Content** (programming, web dev, AI)
   - Use cool, modern colors: deep blues (#1e3a5f), teals (#0d9488), dark purples
   - Dark backgrounds with light text for code-related sections
   - Sharp corners (small radius) or no radius for a techy feel
   - Example: \`"backgroundColor": "#0f172a", "textColor": "#e2e8f0"\`

### 3. **Space/Science Content** (astronomy, physics, exploration)
   - Use cosmic colors: deep purples (#1e1b4b), dark blues, star whites
   - Gradients from dark to darker with accent highlights
   - Large shadows for depth, creating a sense of vastness
   - Example: \`"gradient": { "from": "#1e1b4b", "to": "#312e81", "direction": "to-bottom" }\`

### 4. **Health/Wellness Content** (fitness, meditation, lifestyle)
   - Use calming colors: soft greens, light blues, warm peaches
   - Light backgrounds with darker text
   - Large border radius for a friendly, approachable feel
   - Example: \`"backgroundColor": "#f0fdf4", "textColor": "#166534"\`

### 5. **Business/Finance Content** (startups, investing, productivity)
   - Use professional colors: navy blues (#1e3a8a), grays, gold accents
   - Clean, minimal styling with subtle shadows
   - Medium border radius for a polished look
   - Example: \`"backgroundColor": "#f8fafc", "accentColor": "#ca8a04"\`

### 6. **Creative/Art Content** (design, music, entertainment)
   - Use vibrant, bold colors: magentas, electric blues, bright oranges
   - Playful gradients and larger shadows
   - Mix of border radius for visual interest
   - Example: \`"gradient": { "from": "#ec4899", "to": "#8b5cf6", "direction": "to-right" }\`

### 7. **Food/Cooking Content** (recipes, restaurants, nutrition)
   - Use warm, appetizing colors: oranges (#ea580c), reds, warm yellows
   - Soft shadows, inviting feel
   - Medium to large border radius
   - Example: \`"backgroundColor": "#fef3c7", "textColor": "#92400e"\`

## Layout Decision Guidelines:

Analyze the content and choose components based on:

1. **Visual Content Heavy** (many images, photography)
   → Start with HeroSection (if hero image available) or ImageGallery
   → Use large images, gallery layouts
   → Apply nature/outdoor styling if relevant

2. **Technical/Code Content** (code examples, tutorials)
   → Use CodeBlock components for code
   → Use Callout for tips/warnings
   → Apply tech/modern styling with dark code blocks

3. **Narrative/Story Content** (essays, news, features)
   → Use HeroSection for dramatic opening
   → Use TextBlock with lead variant for intro
   → Use Quote for impactful quotes
   → Match styling to the story's subject

4. **List/Guide Content** (how-tos, guides, lists)
   → Use List components prominently
   → Use Callout for key tips
   → Use numbered lists for steps

5. **Data/Comparison Content** (reviews, comparisons)
   → Use Table for data
   → Use Card for summaries
   → Use Row for side-by-side comparisons

## Response Format:

Return a JSON object with this structure:
{
  "surfaceUpdate": {
    "surfaceId": "article-view",
    "components": [
      {
        "id": "unique-id-1",
        "component": {
          "ComponentName": { 
            ...properties,
            "style": { ...styleProperties }
          }
        }
      },
      ...more components
    ]
  }
}

IMPORTANT:
- Generate unique IDs for each component
- Order components as they should appear (top to bottom)
- Extract actual content from the markdown - don't just describe it
- Parse code blocks and include the actual code
- Convert markdown lists to List components
- Use the article's actual images, quotes, and data
- ALWAYS include appropriate styling based on the content topic
- Make the styling CONSISTENT across components (use similar color palette)
- Use gradients for hero sections and important callouts
- Use subtle styling (light backgrounds, soft shadows) for text content
`;

/**
 * Generate A2UI components for article content
 */
async function generateA2UIComponents(articleContent: string, articleMeta: ArticleMeta): Promise<A2UISurfaceUpdate> {
    const prompt = `
## Article Metadata:
${JSON.stringify(articleMeta, null, 2)}

## Article Content (Markdown):
${articleContent}

## Task:
Analyze this article and generate an A2UI component layout that best presents this content.
Consider the content type, structure, and any special elements (images, code, quotes, lists, tables).

Generate the A2UI JSON response:
`;

    try {
        const result = await model.generateContent([{ text: SYSTEM_PROMPT }, { text: prompt }]);

        const response = result.response.text();

        // Parse and validate JSON
        const a2uiResponse: A2UISurfaceUpdate = JSON.parse(response);

        console.log(
            "[A2UI Agent] Generated components:",
            a2uiResponse.surfaceUpdate?.components?.length || 0,
            "components"
        );

        return a2uiResponse;
    } catch (error) {
        console.error("[A2UI Agent] Error generating components:", error);
        throw error;
    }
}

/**
 * API endpoint to process article content
 */
app.post("/api/a2ui/render", async (req: Request<{}, {}, RenderRequestBody>, res: Response) => {
    const { content, meta } = req.body;

    if (!content) {
        res.status(400).json({ error: "Content is required" });
        return;
    }

    try {
        console.log(`[A2UI Agent] Processing article: ${meta?.title || "Untitled"}`);

        const a2uiResponse = await generateA2UIComponents(content, meta || {});

        res.json(a2uiResponse);
    } catch (error) {
        console.error("[A2UI Agent] Request failed:", error);
        res.status(500).json({
            error: "Failed to generate UI components",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

/**
 * Health check endpoint
 */
app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", agent: "a2ui-content-demo" });
});

/**
 * Get the A2UI schema (for debugging/reference)
 */
app.get("/api/a2ui/schema", (_req: Request, res: Response) => {
    res.json(A2UI_SCHEMA);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`[A2UI Agent] Server running on http://localhost:${PORT}`);
    console.log(`[A2UI Agent] Using Gemini model: gemini-2.5-flash`);
});
