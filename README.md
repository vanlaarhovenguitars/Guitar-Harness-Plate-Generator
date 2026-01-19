# Guitar Harness Plate Generator

A web-based tool for designing custom control plates for guitar electronics harnesses. Create professional plate designs with live preview and export to SVG format for manufacturing.

## Features

- **Live Preview**: See your design update in real-time as you adjust parameters
- **Customizable Dimensions**: Configure plate width, height, thickness, and corner radius
- **Mounting Holes**: Add 0-6 mounting holes with customizable diameter
- **Control Holes**:
  - Potentiometer holes (0-4)
  - Switch holes (0-3)
  - Output jack hole
- **Export Options**: Export your design as SVG for CNC cutting or 3D printing
- **Responsive Design**: Works on desktop and tablet devices

## Getting Started

### Online Use

Simply open `index.html` in a web browser. No installation or build process required!

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

## Usage

1. **Configure Plate Dimensions**:
   - Set the width and height in millimeters
   - Adjust corner radius for rounded edges
   - Set plate thickness for reference

2. **Add Mounting Holes**:
   - Choose number of holes (0, 2, 4, or 6)
   - Set hole diameter for your mounting screws

3. **Add Control Holes**:
   - Potentiometer holes for volume/tone controls
   - Switch holes for pickup selectors
   - Output jack hole

4. **Preview**: Watch the live preview update automatically

5. **Export**: Click "Export SVG" to download your design

## Design Specifications

All measurements are in millimeters (mm). The exported SVG file uses actual dimensions suitable for:

- CNC routing
- Laser cutting
- 3D printing templates
- Manual drilling guides

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

## Author

Van Laarhoven Guitars

## Roadmap

Future enhancements:
- DXF export format
- More hole patterns (pickup cavities, etc.)
- Multiple plate templates (Les Paul, Stratocaster, etc.)
- Imperial units (inches) support
- Advanced dimension annotations
- 3D preview mode

## Support

For issues or feature requests, please create an issue on GitHub.
