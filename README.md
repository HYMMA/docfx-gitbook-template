# DocFX GitBook Template

A modern, elegant DocFX template inspired by GitBook's clean documentation aesthetic.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Clean, readable typography with Source Serif Pro and Inter fonts
- Warm, paper-like color scheme with teal accents
- Dark mode support with system preference detection
- Responsive sidebar navigation
- Table of contents with scroll spy
- Search integration
- Code syntax highlighting with custom theme
- Smooth animations and micro-interactions

## Installation

### Method 1: Git Submodule (Recommended)

```bash
cd your-docfx-project
git submodule add https://github.com/HYMMA/docfx-gitbook-template.git templates/gitbook
```

### Method 2: Direct Download

Download and extract to your project's `templates/` folder.

## Usage

Update your `docfx.json`:

```json
{
  "build": {
    "template": [
      "default",
      "modern",
      "templates/gitbook"
    ]
  }
}
```

## Customization

### Colors

Edit CSS variables in `public/main.css`:

```css
:root {
  --gitbook-accent: #0D9488;
  --gitbook-bg: #FDFCFA;
  --gitbook-text: #1F2937;
}
```

### Logo

Override `partials/logo.tmpl.partial` with your own logo markup.

## Preview

![Light Mode](preview-light.png)
![Dark Mode](preview-dark.png)

## License

MIT © HYMMA
