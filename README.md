# 🎸 Guitar Harness Plate Generator

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_Here-ff6b35?style=for-the-badge)](https://vanlaarhovenguitars.github.io/Guitar-Harness-Plate-Generator/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-16213e?style=for-the-badge&logo=github)](https://github.com/vanlaarhovenguitars/Guitar-Harness-Plate-Generator)
[![License](https://img.shields.io/badge/License-MIT-f7931e?style=for-the-badge)](LICENSE)

A professional photo-based tool for designing custom control plates for guitar electronics harnesses. Upload photos of guitar cavities, calibrate with a ruler, and precisely place holes for pots, switches, and jacks. Export to SVG format for CNC cutting, laser engraving, or manufacturing.

![Guitar Harness Plate Generator](https://img.shields.io/badge/Status-Production_Ready-4caf50?style=flat-square)

---

## 📸 Preview

> **Live Demo:** Experience the full interactive version at [vanlaarhovenguitars.github.io/Guitar-Harness-Plate-Generator](https://vanlaarhovenguitars.github.io/Guitar-Harness-Plate-Generator/)

The tool features a modern dark UI with real-time preview, intuitive controls, and professional SVG export capabilities.

---

## ✨ Features

- **📸 Photo Upload**: Upload photos of guitar cavities with a ruler for accurate scaling
- **📏 Ruler Calibration**: Click two points on your ruler to set precise pixel-to-inch scaling
- **🎯 Click-to-Place Holes**: Precisely place holes for components by clicking on the photo
- **🎛️ Professional Components**: Pre-configured hole sizes for:
  - CTS Potentiometers (500K, 250K, Push-Pull)
  - Mini Pots
  - 3-Way & Mini Toggle Switches
  - 5-Way Selector Switches
  - Switchcraft Jacks (Mono, Stereo)
  - Barrel Jacks
  - Custom hole diameters
- **✏️ Cutout Tracing**: Trace irregular shapes like F-holes and pickup cavities
- **🔍 Zoom Controls**: Zoom in/out, fit to screen, or view at 100% scale
- **🗑️ Erase Mode**: Click to remove holes or trace points
- **💾 Export Options**:
  - Download SVG files for CNC/laser cutting
  - **3D STL export** for 3D printing and CAD
  - Send to print queue with customer info
- **🌙 Professional Dark UI**: Modern interface with orange accents

## 🚀 Quick Start

**Try it now:** [**Live Demo →**](https://vanlaarhovenguitars.github.io/Guitar-Harness-Plate-Generator/)

No installation required! Just click the link above and start designing your custom guitar harness plate.

## 📦 Getting Started

### Online Use (Recommended)

1. Visit the [**Live Demo**](https://vanlaarhovenguitars.github.io/Guitar-Harness-Plate-Generator/)
2. Start designing immediately - no setup required!

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/vanlaarhovenguitars/Guitar-Harness-Plate-Generator.git
   cd Guitar-Harness-Plate-Generator
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html

   # On Linux
   xdg-open index.html

   # On Windows
   start index.html
   ```

   Or use a local web server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (with http-server)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

## 📖 How to Use

### Step 1: Upload Photo
- Take a photo of your guitar cavity **with a ruler visible** in the frame
- Click **"Upload Photo"** and select your image
- The image will load onto the canvas

### Step 2: Calibrate Ruler
- **Click two points** on the ruler in your photo (e.g., 0" and 1")
- Enter the **distance between those points** (in inches)
- Click **"Set Scale"** to calibrate pixel-to-inch conversion
- ✓ You'll see confirmation: "Ruler calibrated!"

### Step 3: Place Holes
- Select a component type from the dropdown:
  - CTS Pots (500K, 250K, Push-Pull) - 3/8"
  - Toggle Switches - 3/8" or 1/4"
  - Jacks (Mono, Stereo, Barrel)
  - Custom holes with any diameter
- **Click on the photo** where you want each hole
- Holes appear with accurate size based on your ruler calibration

### Step 4: Trace Cutouts (Optional)
- Switch to **"Trace Cutout"** mode
- Click multiple points to trace irregular shapes
- Great for F-holes, pickup cavities, or custom cutouts

### Step 5: Use Zoom Controls
- **+** / **−**: Zoom in/out
- **⊡**: Fit to screen
- **1:1**: View at 100% scale

### Step 6: Export
- **Download SVG**: Get a 2D vector file with accurate dimensions for CNC/laser cutting
- **Download STL (3D)**: Get a 3D model ready for:
  - 3D printing (PrusaSlicer, Cura)
  - CAD software (Fusion 360, Tinkercad, Blender)
  - CNC milling with proper depth
- **Send to Print Queue**: Copy design data to clipboard with customer info

## 🎯 Design Specifications

All measurements are in **millimeters (mm)**. The exported SVG file uses actual 1:1 dimensions suitable for:

- ⚙️ **CNC routing** - Direct G-code generation
- ⚡ **Laser cutting** - Precision engraving
- 🖨️ **3D printing** - Template creation
- 🔧 **Manual drilling** - Accurate guides

### Default Configurations

| Component | Default Size | Range |
|-----------|-------------|-------|
| Plate Width | 80mm | 20-200mm |
| Plate Height | 120mm | 20-200mm |
| Corner Radius | 5mm | 0-20mm |
| Mounting Holes | 3mm | 2-10mm |
| Pot Holes | 8mm | 6-12mm |
| Switch Holes | 6mm | 4-12mm |
| Jack Hole | 10mm | 6-15mm |

## File Structure

```
Guitar-Harness-Plate-Generator/
├── index.html          # Main HTML structure
├── style.css           # Styling and layout
├── script.js           # Live preview and export logic
└── README.md          # This file
```

## Browser Support

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this tool for personal or commercial projects.

## 👨‍🎨 Author

**Van Laarhoven Guitars**
Professional guitar electronics and custom guitar building

- 🌐 Website: [Van Laarhoven Guitars](https://github.com/vanlaarhovenguitars)
- 📧 For custom builds and inquiries, check out our other projects

## 🛣️ Roadmap

Recently completed:
- [x] 🎨 **Preset F-hole shapes** (Gibson ES-335, Gretsch, Violin, Modern)
- [x] 📏 **Metric ruler support** (mm and inches)
- [x] 📦 **3D STL export** with CSG hole subtraction

Upcoming features and enhancements:

- [ ] 📄 **DXF export format** for AutoCAD compatibility
- [ ] 🎸 **Pre-made templates** (Les Paul, Stratocaster, Telecaster styles)
- [ ] 🎭 **Pickup cavity routing** patterns
- [ ] 🏷️ **Advanced dimension annotations** on export
- [ ] 🎲 **3D preview mode** for realistic visualization
- [ ] 💾 **Save/Load projects** functionality
- [ ] 🎨 **Custom hole positioning** with drag-and-drop
- [ ] 📊 **Material calculator** for cost estimation
- [ ] 🔄 **Batch export** for multiple designs
- [ ] 🔧 **Improved F-hole STL** (proper path extrusion instead of ellipse approximation)

Want to contribute? Feel free to pick one and submit a PR!

## 💬 Support

Found a bug or have a feature request?

- 🐛 **Report Issues**: [Create an issue on GitHub](https://github.com/vanlaarhovenguitars/Guitar-Harness-Plate-Generator/issues)
- 💡 **Feature Requests**: We'd love to hear your ideas!
- ⭐ **Show Support**: Star this repo if you find it useful

## 🤝 Contributing

Contributions are welcome! Whether it's:
- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements

Please feel free to submit a Pull Request!

### Development Setup

1. Fork the repository
2. Clone your fork
3. Make your changes
4. Test locally by opening `index.html`
5. Submit a pull request

---

**Made with ❤️ for guitar builders and luthiers worldwide**
