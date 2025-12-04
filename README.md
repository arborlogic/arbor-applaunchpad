# App Screenshot Generator

A web-based tool for creating beautiful app store screenshots with device mockups, similar to TheAppLaunchpad or Previewed.app.

## Features

- **Device Mockups**: Support for iPhone 15 Pro Max (1290x2796), iPhone 15 Pro (1170x2532), and Pixel 8 (1236x2748) with realistic frames
- **Customizable Backgrounds**: Solid colors or gradients with multiple directions
- **Text Overlay**: Editable title and subtitle with font size, color, and positioning controls
- **Image Upload**: Drag-and-drop interface for uploading app screenshots
- **High-Quality Export**: Download as PNG with html-to-image library at correct app store resolutions
- **Real-time Preview**: Instant updates as you adjust settings
- **Dark Mode UI**: Professional dark theme optimized for creative work

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: Zustand
- **Export**: html-to-image
- **Icons**: Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3001](http://localhost:3001) in your browser

## Usage

1. **Upload Background Image**: Choose "Image" background type and upload a custom background
2. **Upload App Screenshot**: Click the upload area in the Upload tab to select your app screenshot
3. **Customize Background**: Choose solid color, gradient, or image background with various options
4. **Position Text**: Drag the title and subtitle text elements to position them anywhere on the canvas
5. **Device Settings**: Select device type (iPhone 15 Pro Max outputs at 1290x2796 for iOS App Store)
6. **Download**: Click "Download PNG" to export your screenshot at the correct resolution

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/          # Shadcn UI components
└── lib/
    ├── store.ts    # Zustand state management
    └── utils.ts    # Utility functions
```

## Development Phases

This project was built in three phases:

1. **Layout Skeleton**: Basic sidebar and canvas layout
2. **Core Functionality**: State management, image upload, text overlay
3. **Export & Polish**: Device mockups, gradients, export functionality

## Contributing

Feel free to submit issues and enhancement requests!
