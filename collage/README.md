# AI Image Collage Gallery

A modern, responsive web gallery for displaying AI-generated images in an elegant collage layout.

## Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Gallery**: Click images to view them in a modal with details
- **Shuffle Layout**: Randomize the arrangement of images
- **Sorting Options**: Sort by name, size, or random order
- **Modern UI**: Clean, modern design with smooth animations
- **Performance Optimized**: Lazy loading and efficient rendering

## Getting Started

1. **Add Your Images**: Place your AI-generated images in the `images/` folder
2. **Update Image Loading**: Modify the `script.js` file to load your actual images instead of placeholders
3. **Customize**: Update colors, fonts, and styling in `styles.css` to match your preferences

## File Structure

```
collage/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
├── images/             # Folder for your AI-generated images
└── README.md           # This file
```

## Adding Your Images

To add your AI-generated images:

1. Place all your images in the `images/` folder
2. Update the `loadImages()` method in `script.js` to load your actual images
3. You can either:
   - Create a `manifest.json` file listing all your images
   - Use a build script to automatically discover images
   - Manually update the image array in the JavaScript

## Customization

### Colors
Update the CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --secondary-color: #8b5cf6;  /* Secondary color */
    --accent-color: #f59e0b;     /* Accent color */
}
```

### Layout
Modify the grid layout in `styles.css`:
```css
.collage {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Performance Tips

- Optimize your images before adding them (recommended: WebP format, max 2MB per image)
- Use appropriate image dimensions (the gallery will resize them automatically)
- Consider lazy loading for large collections

## Future Enhancements

- Image filtering by tags or categories
- Full-screen slideshow mode
- Image metadata display
- Social sharing functionality
- Search functionality

## License

This project is open source and available under the MIT License.
