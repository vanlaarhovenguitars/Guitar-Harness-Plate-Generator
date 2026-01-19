# 🎸 Guitar Harness Plate Generator

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_Here-ff6b35?style=for-the-badge)](https://vanlaarhovenguitars.github.io/Guitar-Harness-Plate-Generator/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-16213e?style=for-the-badge&logo=github)](https://github.com/vanlaarhovenguitars/Guitar-Harness-Plate-Generator)
[![License](https://img.shields.io/badge/License-MIT-f7931e?style=for-the-badge)](LICENSE)

A professional web-based tool for designing custom control plates for guitar electronics harnesses. Create precision plate designs with **live preview** and export to SVG format for CNC cutting, laser engraving, or manufacturing.

![Guitar Harness Plate Generator](https://img.shields.io/badge/Status-Production_Ready-4caf50?style=flat-square)

---

## 📸 Preview

> **Live Demo:** Experience the full interactive version at [vanlaarhovenguitars.github.io/Guitar-Harness-Plate-Generator](https://vanlaarhovenguitars.github.io/Guitar-Harness-Plate-Generator/)

The tool features a modern dark UI with real-time preview, intuitive controls, and professional SVG export capabilities.

---

## ✨ Features

- **🎨 Live Preview Canvas**: See your design update in real-time as you adjust parameters
- **📐 Precision Dimensions**: Configure plate width, height, thickness, and corner radius (in mm)
- **🔩 Mounting Holes**: Add 0-6 mounting holes with customizable diameter and automatic positioning
- **🎛️ Control Holes**:
  - Potentiometer holes (0-4) for volume/tone controls
  - Switch holes (0-3) for pickup selectors
  - Output jack hole with adjustable size
- **💾 Export Options**: Export your design as SVG for CNC cutting, laser engraving, or 3D printing
- **🎯 Professional Quality**: Accurate measurements suitable for manufacturing
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🌙 Dark Modern UI**: Beautiful, easy-on-the-eyes interface

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

### Step 1: Configure Plate Dimensions
- Set the **width** and **height** in millimeters
- Adjust **corner radius** for rounded edges (0-20mm)
- Set **plate thickness** for reference

### Step 2: Add Mounting Holes
- Choose number of holes: **0, 2, 4, or 6**
- Set hole diameter for your mounting screws (typically 3mm)
- Holes are automatically positioned in corners

### Step 3: Add Control Holes
- **Potentiometer holes**: For volume/tone controls (typically 8mm)
- **Switch holes**: For pickup selectors (typically 6mm)
- **Output jack hole**: For 1/4" jack connector (typically 10mm)

### Step 4: Live Preview
- Watch the preview update **automatically** as you adjust settings
- All measurements are displayed in millimeters
- Visual representation shows exact hole positions

### Step 5: Export Your Design
- Click **"Export SVG"** to download your design file
- Use the SVG file for:
  - CNC routing
  - Laser cutting
  - 3D printing templates
  - Manual drilling guides

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

Upcoming features and enhancements:

- [ ] 📄 **DXF export format** for AutoCAD compatibility
- [ ] 🎸 **Pre-made templates** (Les Paul, Stratocaster, Telecaster styles)
- [ ] 🎭 **Pickup cavity routing** patterns
- [ ] 📏 **Imperial units** (inches) support
- [ ] 🏷️ **Advanced dimension annotations** on export
- [ ] 🎲 **3D preview mode** for realistic visualization
- [ ] 💾 **Save/Load projects** functionality
- [ ] 🎨 **Custom hole positioning** with drag-and-drop
- [ ] 📊 **Material calculator** for cost estimation
- [ ] 🔄 **Batch export** for multiple designs

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
