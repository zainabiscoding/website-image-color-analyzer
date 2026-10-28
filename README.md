# Palettee

> A web-based color analysis tool for extracting and generating harmonious color palettes from images

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-purple.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-yellow.svg)](https://vitejs.dev/)

## Overview

**Palettee** is an advanced web application for extracting colors from images and generating harmonious color palettes. It helps designers and developers discover new color systems and reuse them in their projects.

**Key Features:**
- **Bilingual Support**: Arabic and English with instant switching
- **Smart Color Extraction**: Advanced algorithm for image analysis
- **Variation Generation**: 6 different harmony styles (warm, cool, modern, natural, analogous, complementary)
- **Live Preview**: See colors in a website design context
- **Copy & Export**: CSS, JSON, or individual color copying
- **Random Themes**: Changing interface with every click
- **Responsive Design**: Works on all devices
- **Contrast Checking**: WCAG contrast warnings

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS 4** - Styling
- **Canvas API** - Image processing
- **Lucide React** - Icons
- **Google Fonts** - Caveat (English) and Tajawal (Arabic)

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/zainabiscoding/palettee.git
cd palettee

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage Guide

### 1. Extract Colors from an Image

1. Click on the upload area or drag and drop an image
2. Wait for the analysis to complete
3. Extracted colors will appear with HEX and RGB values

### 2. Generate Alternative Palettes

- After color extraction, 6 automatically generated palettes will appear
- Each palette represents a different harmony style
- Click on any palette to preview it

### 3. Live Preview

- Click the "Preview" button for any palette
- See how the colors look in a website design
- Switch between desktop and mobile views

### 4. Export & Copy

- **Individual Copy**: Click any color to copy its value
- **Copy All**: Copy all colors at once
- **Export CSS**: Get ready-to-use CSS variables
- **Export JSON**: Get color data in JSON format

## Project Structure

```
palettee/
├── src/
│   ├── components/         # React components
│   │   ├── Header.tsx      # Header with control buttons
│   │   ├── ImageUpload.tsx # Image upload area
│   │   ├── PaletteDisplay.tsx    # Extracted palette display
│   │   ├── GeneratedPalettes.tsx # Generated palettes
│   │   ├── PalettePreview.tsx    # Live preview
│   │   ├── ColorSwatch.tsx       # Individual color display
│   │   └── LoadingState.tsx      # Loading state
│   ├── utils/              # Utility functions
│   │   ├── colorUtils.ts         # Color conversions
│   │   ├── colorExtraction.ts    # Color extraction
│   │   ├── paletteGeneration.ts  # Palette generation
│   │   ├── exportUtils.ts        # Export tools
│   │   └── translations.ts       # Translations
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx             # Main component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Public assets
├── index.html              # Main HTML
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project configuration
```

## Generation Styles

| Style | Description |
|------|-------|
| **Warm & Soft** | Warm and gentle tones |
| **Cool & Calm** | Cool and peaceful colors |
| **Modern & High Contrast** | High contrast and modern |
| **Natural & Earthy** | Natural and earthy tones |
| **Analogous** | Colors adjacent on the color wheel |
| **Complementary** | Complementary and contrasting colors |

## Language Support

- **English**: Full interface with Caveat font
- **Arabic**: Full interface with Tajawal font and RTL support

## Interactive Features

### Random Button
- Generates a new color theme for the entire interface
- 8 different themes to choose from
- Smooth transitions with animations

### Colors Button
- Displays current color details
- HEX values for each color
- Reacts to theme changes

## Browser Compatibility

- Chrome / Edge
- Firefox
- Safari
- Opera

## Contributing

Contributions are welcome! If you have a suggestion:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Developer

**zainabiscoding**

Made with love by zainabiscoding

---

<div align="center">

**Enjoy creating beautiful color palettes!**

[Star this project](https://github.com/zainabiscoding/palettee) if you like it!

</div>
