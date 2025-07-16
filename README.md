# Crystal Shard Portfolio

A beautiful 3D portfolio site with a "Crystal Shard" concept, featuring immersive parallax effects, floating particles, and elegant transitions.

## Features

- 3D space with depth perception and parallax effects
- Iridescent floating particles that interact with mouse movement
- Minimal UI with elegant typography
- Glass-shattering transition animation with sound effects
- 3D grid layout for portfolio works with crystal shard thumbnails
- Background ambient music with toggle control
- Mobile-responsive design

## Project Structure

```
Portfolio/
├── assets/
│   ├── audio/
│   │   ├── ambient.mp3 (add your own ambient music)
│   │   └── glass-shatter.mp3 (add your own glass breaking sound)
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   └── key-visual.png
│   └── js/
│       ├── main.js
│       ├── particles.js
│       └── works.js
├── index.html
├── works.html
└── README.md
```

## Setup Instructions

1. **Audio Files**: Add your preferred ambient music as `ambient.mp3` and glass breaking sound as `glass-shatter.mp3` in the `assets/audio/` directory.

2. **Customizing Works**: Edit the `worksData` array in `assets/js/works.js` to add your own portfolio items.

3. **Viewing the Site**: Open `index.html` in a modern web browser to view the site.

## Customization Options

### Changing Colors

Edit the CSS variables and gradient colors in `assets/css/style.css` to match your preferred color scheme.

### Particle System

Adjust the particle system parameters in `assets/js/particles.js` to change the density, colors, and behavior of the floating particles.

### Adding New Pages

1. Create a new HTML file based on the structure of existing pages
2. Link to it from the works page or main navigation
3. Ensure it includes the necessary scripts and styles

## Browser Compatibility

This site works best in modern browsers that support CSS 3D transforms and JavaScript ES6 features:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Credits

- Fonts: [Noto Sans JP](https://fonts.google.com/specimen/Noto+Sans+JP)
- Libraries: [Three.js](https://threejs.org/), [GSAP](https://greensock.com/gsap/)

---

Designed with ♥ as a Crystal Shard concept portfolio
