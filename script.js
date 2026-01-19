// Get canvas and context
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');

// Scale factor for display (pixels per mm)
const SCALE = 4;

// Get all input elements
const inputs = {
    plateWidth: document.getElementById('plateWidth'),
    plateHeight: document.getElementById('plateHeight'),
    plateThickness: document.getElementById('plateThickness'),
    cornerRadius: document.getElementById('cornerRadius'),
    mountHoles: document.getElementById('mountHoles'),
    mountHoleDiameter: document.getElementById('mountHoleDiameter'),
    potHoles: document.getElementById('potHoles'),
    potDiameter: document.getElementById('potDiameter'),
    switchHoles: document.getElementById('switchHoles'),
    switchDiameter: document.getElementById('switchDiameter'),
    jackHole: document.getElementById('jackHole'),
    jackDiameter: document.getElementById('jackDiameter')
};

// Default values
const defaults = {
    plateWidth: 80,
    plateHeight: 120,
    plateThickness: 2,
    cornerRadius: 5,
    mountHoles: 4,
    mountHoleDiameter: 3,
    potHoles: 2,
    potDiameter: 8,
    switchHoles: 1,
    switchDiameter: 6,
    jackHole: true,
    jackDiameter: 10
};

// Initialize
function init() {
    // Add event listeners to all inputs
    Object.keys(inputs).forEach(key => {
        const input = inputs[key];
        if (input.type === 'checkbox') {
            input.addEventListener('change', updatePreview);
        } else {
            input.addEventListener('input', (e) => {
                updateValueDisplay(e.target);
                updatePreview();
            });
        }
        updateValueDisplay(input);
    });

    // Button event listeners
    document.getElementById('exportSVG').addEventListener('click', exportSVG);
    document.getElementById('exportPDF').addEventListener('click', exportPDF);
    document.getElementById('resetDefaults').addEventListener('click', resetToDefaults);

    // Initial draw
    updatePreview();
}

// Update value displays
function updateValueDisplay(input) {
    const valueDisplay = input.parentElement.querySelector('.value-display');
    if (valueDisplay && input.type !== 'checkbox') {
        let value = input.value;
        if (input.type === 'number') {
            value += 'mm';
        }
        if (input.id === 'potHoles' || input.id === 'switchHoles') {
            value = input.value;
        }
        valueDisplay.textContent = value;
    }
}

// Get current configuration
function getConfig() {
    return {
        plateWidth: parseFloat(inputs.plateWidth.value),
        plateHeight: parseFloat(inputs.plateHeight.value),
        plateThickness: parseFloat(inputs.plateThickness.value),
        cornerRadius: parseFloat(inputs.cornerRadius.value),
        mountHoles: parseInt(inputs.mountHoles.value),
        mountHoleDiameter: parseFloat(inputs.mountHoleDiameter.value),
        potHoles: parseInt(inputs.potHoles.value),
        potDiameter: parseFloat(inputs.potDiameter.value),
        switchHoles: parseInt(inputs.switchHoles.value),
        switchDiameter: parseFloat(inputs.switchDiameter.value),
        jackHole: inputs.jackHole.checked,
        jackDiameter: parseFloat(inputs.jackDiameter.value)
    };
}

// Draw rounded rectangle
function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
}

// Draw circle with center mark
function drawHole(x, y, diameter) {
    const radius = (diameter * SCALE) / 2;

    // Draw hole
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw center cross
    const crossSize = 5;
    ctx.beginPath();
    ctx.moveTo(x - crossSize, y);
    ctx.lineTo(x + crossSize, y);
    ctx.moveTo(x, y - crossSize);
    ctx.lineTo(x, y + crossSize);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw dimension
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`⌀${diameter}mm`, x, y + radius + 15);
}

// Update preview
function updatePreview() {
    const config = getConfig();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions
    const plateWidth = config.plateWidth * SCALE;
    const plateHeight = config.plateHeight * SCALE;
    const cornerRadius = config.cornerRadius * SCALE;

    // Center the plate on canvas
    const offsetX = (canvas.width - plateWidth) / 2;
    const offsetY = (canvas.height - plateHeight) / 2;

    // Draw plate background
    ctx.save();
    ctx.translate(offsetX, offsetY);

    // Draw plate with rounded corners
    drawRoundedRect(0, 0, plateWidth, plateHeight, cornerRadius);
    ctx.fillStyle = '#e8e8e8';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw dimension lines
    drawDimensions(config, plateWidth, plateHeight);

    // Draw mounting holes
    if (config.mountHoles > 0) {
        drawMountingHoles(config, plateWidth, plateHeight);
    }

    // Draw potentiometer holes
    if (config.potHoles > 0) {
        drawPotHoles(config, plateWidth, plateHeight);
    }

    // Draw switch holes
    if (config.switchHoles > 0) {
        drawSwitchHoles(config, plateWidth, plateHeight);
    }

    // Draw jack hole
    if (config.jackHole) {
        drawJackHole(config, plateWidth, plateHeight);
    }

    ctx.restore();
}

// Draw dimensions
function drawDimensions(config, plateWidth, plateHeight) {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';

    // Width dimension
    ctx.fillText(`${config.plateWidth}mm`, plateWidth / 2, -10);

    // Height dimension
    ctx.save();
    ctx.translate(-10, plateHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${config.plateHeight}mm`, 0, 0);
    ctx.restore();
}

// Draw mounting holes in corners
function drawMountingHoles(config, plateWidth, plateHeight) {
    const margin = 10 * SCALE; // 10mm from edge
    const positions = [];

    if (config.mountHoles >= 2) {
        positions.push([margin, margin]); // Top-left
        positions.push([plateWidth - margin, margin]); // Top-right
    }
    if (config.mountHoles >= 4) {
        positions.push([margin, plateHeight - margin]); // Bottom-left
        positions.push([plateWidth - margin, plateHeight - margin]); // Bottom-right
    }
    if (config.mountHoles === 6) {
        positions.push([plateWidth / 2, margin]); // Top-center
        positions.push([plateWidth / 2, plateHeight - margin]); // Bottom-center
    }

    positions.forEach(([x, y]) => {
        drawHole(x, y, config.mountHoleDiameter);
    });
}

// Draw potentiometer holes
function drawPotHoles(config, plateWidth, plateHeight) {
    const spacing = plateWidth / (config.potHoles + 1);
    const yPos = plateHeight * 0.35;

    for (let i = 1; i <= config.potHoles; i++) {
        const xPos = spacing * i;
        drawHole(xPos, yPos, config.potDiameter);

        // Label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`POT ${i}`, xPos, yPos - (config.potDiameter * SCALE) / 2 - 20);
    }
}

// Draw switch holes
function drawSwitchHoles(config, plateWidth, plateHeight) {
    const spacing = plateWidth / (config.switchHoles + 1);
    const yPos = plateHeight * 0.6;

    for (let i = 1; i <= config.switchHoles; i++) {
        const xPos = spacing * i;
        drawHole(xPos, yPos, config.switchDiameter);

        // Label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`SWITCH ${i}`, xPos, yPos - (config.switchDiameter * SCALE) / 2 - 20);
    }
}

// Draw output jack hole
function drawJackHole(config, plateWidth, plateHeight) {
    const xPos = plateWidth / 2;
    const yPos = plateHeight * 0.85;

    drawHole(xPos, yPos, config.jackDiameter);

    // Label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('OUTPUT JACK', xPos, yPos - (config.jackDiameter * SCALE) / 2 - 20);
}

// Export to SVG
function exportSVG() {
    const config = getConfig();

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${config.plateWidth}mm" height="${config.plateHeight}mm" viewBox="0 0 ${config.plateWidth} ${config.plateHeight}">
  <!-- Generated by Guitar Harness Plate Generator -->
  <desc>Guitar harness plate: ${config.plateWidth}mm x ${config.plateHeight}mm</desc>

  <!-- Plate outline -->
  <rect x="0" y="0" width="${config.plateWidth}" height="${config.plateHeight}"
        rx="${config.cornerRadius}" ry="${config.cornerRadius}"
        fill="none" stroke="black" stroke-width="0.5"/>

`;

    // Add mounting holes
    if (config.mountHoles > 0) {
        const margin = 10;
        const positions = [];

        if (config.mountHoles >= 2) {
            positions.push([margin, margin]);
            positions.push([config.plateWidth - margin, margin]);
        }
        if (config.mountHoles >= 4) {
            positions.push([margin, config.plateHeight - margin]);
            positions.push([config.plateWidth - margin, config.plateHeight - margin]);
        }
        if (config.mountHoles === 6) {
            positions.push([config.plateWidth / 2, margin]);
            positions.push([config.plateWidth / 2, config.plateHeight - margin]);
        }

        positions.forEach(([x, y]) => {
            svg += `  <circle cx="${x}" cy="${y}" r="${config.mountHoleDiameter / 2}" fill="none" stroke="black" stroke-width="0.3"/>\n`;
        });
    }

    // Add pot holes
    if (config.potHoles > 0) {
        const spacing = config.plateWidth / (config.potHoles + 1);
        const yPos = config.plateHeight * 0.35;

        for (let i = 1; i <= config.potHoles; i++) {
            const xPos = spacing * i;
            svg += `  <circle cx="${xPos}" cy="${yPos}" r="${config.potDiameter / 2}" fill="none" stroke="black" stroke-width="0.3"/>\n`;
        }
    }

    // Add switch holes
    if (config.switchHoles > 0) {
        const spacing = config.plateWidth / (config.switchHoles + 1);
        const yPos = config.plateHeight * 0.6;

        for (let i = 1; i <= config.switchHoles; i++) {
            const xPos = spacing * i;
            svg += `  <circle cx="${xPos}" cy="${yPos}" r="${config.switchDiameter / 2}" fill="none" stroke="black" stroke-width="0.3"/>\n`;
        }
    }

    // Add jack hole
    if (config.jackHole) {
        const xPos = config.plateWidth / 2;
        const yPos = config.plateHeight * 0.85;
        svg += `  <circle cx="${xPos}" cy="${yPos}" r="${config.jackDiameter / 2}" fill="none" stroke="black" stroke-width="0.3"/>\n`;
    }

    svg += '</svg>';

    // Download file
    downloadFile(svg, 'guitar-harness-plate.svg', 'image/svg+xml');
    alert('SVG file exported successfully!');
}

// Export to PDF (simplified - creates a data URL)
function exportPDF() {
    alert('PDF export: For now, you can print the preview to PDF using your browser\'s print function (Ctrl+P or Cmd+P), or export as SVG and convert it using an online tool.');
}

// Download file helper
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Reset to defaults
function resetToDefaults() {
    Object.keys(defaults).forEach(key => {
        const input = inputs[key];
        if (input.type === 'checkbox') {
            input.checked = defaults[key];
        } else {
            input.value = defaults[key];
        }
        updateValueDisplay(input);
    });
    updatePreview();
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
