# A2UI Content Demo

![Landing Image](https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1766977382/blog/building-content-adaptive-interfaces-with-googles-a2ui/hero-building-content-adaptive-interfaces-with-googles-a2ui_jc2fg2)

> This project is part of my blog article **[Building Content-Adaptive Interfaces with Google's A2UI](https://www.trpkovski.com/2025/12/29/building-content-adaptive-interfaces-with-googles-a2ui)**. To explore in detail how this is built, check it out!

A demonstration of [A2UI (Agent → UI)](https://a2ui.org/) protocol using **Node.js**, **Lit**, and **Google Gemini**. This project shows how an AI agent can dynamically generate UI layouts for article content without any user text input.

## What is A2UI?

A2UI is a protocol that lets an agent return **UI as declarative messages**—not HTML, not framework-specific components. The host app renders those messages using a trusted "catalog" of components. The result: **the agent decides _what UI to show_**, while the client controls **security, rendering, and branding**.

## How This Demo Works

1. **Articles live as local Markdown files** (`public/articles/`)
2. **No user text input**—clicking an article sends its content to an agent
3. The agent (Gemini) responds with **A2UI messages** that define UI structure + styling
4. A **Lit** client renders the UI from those messages

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│  Markdown   │ ──► │  Node + Gemini  │ ──► │ Lit Client  │
│   Files     │     │  (A2UI Agent)   │     │ (Renderer)  │
└─────────────┘     └─────────────────┘     └─────────────┘
```

## Features

-   **Content-driven UI**: The LLM analyzes article content and chooses appropriate components
-   **Component catalog**: HeroSection, TextBlock, ImageGallery, CodeBlock, Callout, Quote, Table, and more
-   **Styling hints**: Agent can suggest colors, spacing, and shadows based on content type
-   **No templates**: UI is generated dynamically—same code renders tech articles differently from cooking guides

## Project Structure

```
a2ui-content-demo/
├── public/articles/        # Markdown articles with frontmatter
├── server/
│   ├── index.ts            # Express server + Gemini agent
│   └── a2ui-schema.json    # Component catalog schema
├── src/
│   ├── app.ts              # Main Lit application
│   ├── types.ts            # TypeScript types for A2UI
│   ├── components/         # Lit component implementations
│   │   ├── a2ui-renderer.ts    # Core A2UI message renderer
│   │   ├── a2ui-hero.ts        # HeroSection component
│   │   ├── a2ui-text-block.ts  # TextBlock component
│   │   ├── a2ui-image-gallery.ts
│   │   ├── a2ui-code-block.ts
│   │   ├── a2ui-callout.ts
│   │   └── ...
│   ├── services/
│   │   └── a2ui-client.ts  # Client for talking to the agent
│   └── utils/
│       └── style-utils.ts  # Style hint processing
└── package.json
```

## Getting Started

### Prerequisites

-   Node.js 24+
-   A Google AI API key (Gemini)

### Installation

```bash
# Install dependencies
npm install

# Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your-api-key-here" > .env
```

### Running the Demo

```bash
npm run dev
```

This starts both:

-   **Frontend**: http://localhost:5173
-   **Agent server**: http://localhost:3001

Open the frontend, click on any article card, and watch the AI generate a custom UI layout!

## Available Scripts

| Command          | Description                                      |
| ---------------- | ------------------------------------------------ |
| `npm run dev`    | Start both client and server in development mode |
| `npm run client` | Start only the Vite dev server                   |
| `npm run server` | Start only the Node.js agent server              |
| `npm run build`  | Build the client for production                  |

## Component Catalog

The agent can use these components:

| Component        | Purpose                              |
| ---------------- | ------------------------------------ |
| `HeroSection`    | Full-width header with image overlay |
| `TextBlock`      | Markdown/text content with variants  |
| `ImageGallery`   | Grid of images with lightbox         |
| `CodeBlock`      | Syntax-highlighted code              |
| `Callout`        | Info/warning/success/tip boxes       |
| `Quote`          | Blockquote with attribution          |
| `Table`          | Data tables                          |
| `Card`           | Container with title and content     |
| `List`           | Ordered/unordered lists              |
| `Metadata`       | Author, date, tags display           |
| `Column` / `Row` | Layout containers                    |
| `Divider`        | Visual separator                     |

## Sample Articles

The demo includes several sample articles in `public/articles/`:

-   `mountain-photography.md` - Photography guide with image gallery
-   `building-ai-chatbot.md` - Technical tutorial with code blocks
-   `italian-cooking.md` - Recipe with lists and callouts
-   `web-components.md` - Tech article with code examples
-   `space-exploration.md` - Informational article
-   And more...

## References

-   [A2UI Protocol Documentation](https://a2ui.org/)
-   [A2UI Quickstart Guide](https://a2ui.org/quickstart/)
-   [Google A2UI Repository](https://github.com/google/A2UI)

## License

MIT
