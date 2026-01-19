// State management
const state = {
    image: null,
    holes: [],
    tracePoints: [],
    rulerPoints: [],
    pixelsPerInch: null,
    mode: 'hole',
    currentComponent: 'pot-cts-500k',
    zoom: 1.0,
    offsetX: 0,
    offsetY: 0
};

// Component specifications (diameter in inches)
const componentSpecs = {
    'pot-cts-500k': { diameter: 0.375, name: 'CTS 500K Pot' },
    'pot-cts-250k': { diameter: 0.375, name: 'CTS 250K Pot' },
    'pot-pushpull': { diameter: 0.375, name: 'Push-Pull Pot' },
    'pot-mini': { diameter: 0.25, name: 'Mini Pot' },
    'toggle-3way': { diameter: 0.375, name: '3-Way Toggle' },
    'toggle-mini': { diameter: 0.25, name: 'Mini Toggle' },
    'switch-5way': { diameter: 0.5, name: '5-Way Switch' },
    'jack-mono': { diameter: 0.375, name: 'Switchcraft Mono' },
    'jack-stereo': { diameter: 0.375, name: 'Switchcraft Stereo' },
    'jack-barrel': { diameter: 0.5, name: 'Barrel Jack' },
    'custom': { diameter: 0.375, name: 'Custom Hole' }
};

// DOM elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const componentType = document.getElementById('componentType');
const customDiameterGroup = document.getElementById('customDiameterGroup');
const customDiameter = document.getElementById('customDiameter');
const holeList = document.getElementById('holeList');
const holeCount = document.getElementById('holeCount');
const status = document.getElementById('status');
const rulerSection = document.getElementById('rulerSection');
const rulerPoints = document.getElementById('rulerPoints');
const plateThickness = document.getElementById('plateThickness');
const rulerDistanceGroup = document.getElementById('rulerDistanceGroup');
const rulerDistance = document.getElementById('rulerDistance');
const setRulerScale = document.getElementById('setRulerScale');

// Event listeners
imageUpload.addEventListener('change', handleImageUpload);
componentType.addEventListener('change', handleComponentChange);
canvas.addEventListener('click', handleCanvasClick);

document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.mode = e.target.dataset.mode;
        updateStatus();
    });
});

document.getElementById('resetRuler').addEventListener('click', () => {
    state.rulerPoints = [];
    state.pixelsPerInch = null;
    rulerDistanceGroup.style.display = 'none';
    rulerPoints.textContent = '0/2';
    drawCanvas();
    updateStatus();
});

setRulerScale.addEventListener('click', () => {
    if (state.rulerPoints.length === 2) {
        const dx = state.rulerPoints[1].x - state.rulerPoints[0].x;
        const dy = state.rulerPoints[1].y - state.rulerPoints[0].y;
        const distancePixels = Math.sqrt(dx * dx + dy * dy);
        const distanceInches = parseFloat(rulerDistance.value);
        state.pixelsPerInch = distancePixels / distanceInches;
        status.textContent = `✓ Ruler calibrated! (${state.pixelsPerInch.toFixed(2)} px/inch, ${distanceInches}" scale)`;
    }
});

document.getElementById('sendToSheet').addEventListener('click', sendToSpreadsheet);

document.getElementById('clearAll').addEventListener('click', () => {
    if (confirm('Clear all holes and traced cutouts?')) {
        state.holes = [];
        state.tracePoints = [];
        updateHoleList();
        drawCanvas();
    }
});

document.getElementById('exportSVG').addEventListener('click', exportSVG);
document.getElementById('exportSTL').addEventListener('click', exportSTL);

// Zoom controls
document.getElementById('zoomIn').addEventListener('click', () => {
    state.zoom = Math.min(state.zoom * 1.2, 5);
    resizeCanvas();
});

document.getElementById('zoomOut').addEventListener('click', () => {
    state.zoom = Math.max(state.zoom / 1.2, 0.1);
    resizeCanvas();
});

document.getElementById('zoomFit').addEventListener('click', () => {
    fitToScreen();
});

document.getElementById('zoom100').addEventListener('click', () => {
    state.zoom = 1.0;
    resizeCanvas();
});

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            state.image = img;
            canvas.width = img.width;
            canvas.height = img.height;
            fitToScreen();
            rulerSection.style.display = 'block';
            updateStatus();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Fit image to screen
function fitToScreen() {
    if (!state.image) return;

    const container = document.querySelector('.canvas-container');
    const maxWidth = container.clientWidth - 40;
    const maxHeight = container.clientHeight - 100;

    const scaleX = maxWidth / state.image.width;
    const scaleY = maxHeight / state.image.height;

    state.zoom = Math.min(scaleX, scaleY, 1);
    resizeCanvas();
}

// Resize canvas based on zoom
function resizeCanvas() {
    if (!state.image) return;

    canvas.style.width = (state.image.width * state.zoom) + 'px';
    canvas.style.height = (state.image.height * state.zoom) + 'px';
    drawCanvas();
}

// Handle component type change
function handleComponentChange() {
    state.currentComponent = componentType.value;
    if (componentType.value === 'custom') {
        customDiameterGroup.style.display = 'block';
    } else {
        customDiameterGroup.style.display = 'none';
    }
}

// Handle canvas clicks
function handleCanvasClick(e) {
    if (!state.image) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / state.zoom;
    const y = (e.clientY - rect.top) / state.zoom;

    // Ruler calibration mode
    if (state.rulerPoints.length < 2) {
        state.rulerPoints.push({ x, y });
        rulerPoints.textContent = `${state.rulerPoints.length}/2`;

        if (state.rulerPoints.length === 2) {
            rulerDistanceGroup.style.display = 'block';
            status.textContent = 'Enter the distance between the two points, then click "Set Scale"';
        }

        drawCanvas();
        return;
    }

    // Erase mode
    if (state.mode === 'erase') {
        const eraseRadius = 20 / state.zoom;
        let foundHole = false;

        for (let i = state.holes.length - 1; i >= 0; i--) {
            const hole = state.holes[i];
            const dist = Math.sqrt((hole.x - x) ** 2 + (hole.y - y) ** 2);
            if (dist < eraseRadius) {
                state.holes.splice(i, 1);
                foundHole = true;
                break;
            }
        }

        if (!foundHole) {
            for (let i = state.tracePoints.length - 1; i >= 0; i--) {
                const point = state.tracePoints[i];
                const dist = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
                if (dist < eraseRadius) {
                    state.tracePoints.splice(i, 1);
                    break;
                }
            }
        }

        updateHoleList();
        drawCanvas();
        return;
    }

    // Hole placement mode
    if (state.mode === 'hole') {
        const diameter = componentType.value === 'custom'
            ? parseFloat(customDiameter.value)
            : componentSpecs[state.currentComponent].diameter;

        const name = componentType.value === 'custom'
            ? `Custom ${diameter}"`
            : componentSpecs[state.currentComponent].name;

        state.holes.push({
            x, y,
            diameter,
            component: state.currentComponent,
            name
        });

        updateHoleList();
        drawCanvas();
    }

    // Trace mode
    if (state.mode === 'trace') {
        state.tracePoints.push({ x, y });
        drawCanvas();
    }
}

// Draw canvas
function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state.image) {
        ctx.drawImage(state.image, 0, 0);
    }

    // Draw ruler points
    ctx.fillStyle = '#4ade80';
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2;

    state.rulerPoints.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();

        if (i > 0) {
            ctx.beginPath();
            ctx.moveTo(state.rulerPoints[0].x, state.rulerPoints[0].y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
    });

    // Draw holes
    ctx.strokeStyle = '#ff6b35';
    ctx.fillStyle = 'rgba(255, 107, 53, 0.3)';
    ctx.lineWidth = 3;

    state.holes.forEach((hole, i) => {
        const radiusPixels = state.pixelsPerInch
            ? (hole.diameter / 2) * state.pixelsPerInch
            : 20;

        ctx.beginPath();
        ctx.arc(hole.x, hole.y, radiusPixels, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`${i + 1}`, hole.x, hole.y + 5);
        ctx.fillStyle = 'rgba(255, 107, 53, 0.3)';
    });

    // Draw trace points
    if (state.tracePoints.length > 0) {
        ctx.strokeStyle = '#fbbf24';
        ctx.fillStyle = '#fbbf24';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(state.tracePoints[0].x, state.tracePoints[0].y);

        state.tracePoints.forEach((point, i) => {
            if (i > 0) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        if (state.tracePoints.length > 2) {
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
            ctx.beginPath();
            ctx.moveTo(state.tracePoints[0].x, state.tracePoints[0].y);
            state.tracePoints.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.closePath();
            ctx.stroke();
        }
    }
}

// Update hole list
function updateHoleList() {
    holeList.innerHTML = '';
    holeCount.textContent = state.holes.length;

    state.holes.forEach((hole, i) => {
        const li = document.createElement('li');
        li.className = 'hole-item';
        li.innerHTML = `
            <span>${i + 1}. ${hole.name} (${hole.diameter}")</span>
            <button class="delete" onclick="deleteHole(${i})">✕</button>
        `;
        holeList.appendChild(li);
    });
}

// Delete hole
function deleteHole(index) {
    state.holes.splice(index, 1);
    updateHoleList();
    drawCanvas();
}

// Update status
function updateStatus() {
    if (!state.image) {
        status.textContent = 'Ready. Upload an image to begin.';
    } else if (state.rulerPoints.length < 2) {
        status.textContent = `Ruler calibration: Click ${2 - state.rulerPoints.length} more point(s)`;
    } else if (!state.pixelsPerInch) {
        status.textContent = 'Enter distance between ruler points and click "Set Scale"';
    } else if (state.mode === 'hole') {
        status.textContent = 'Click to place holes. Select component type first.';
    } else if (state.mode === 'trace') {
        status.textContent = 'Click to trace cutout outline. Add multiple points.';
    } else if (state.mode === 'erase') {
        status.textContent = 'Click near a hole or trace point to remove it.';
    }
}

// Export SVG
function exportSVG() {
    if (!state.pixelsPerInch) {
        alert('Please calibrate the ruler first!');
        return;
    }

    const width = canvas.width / state.pixelsPerInch;
    const height = canvas.height / state.pixelsPerInch;

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}in" height="${height}in" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <desc>Guitar Harness Plate - Generated by VL Guitar Repair</desc>

    <!-- Holes -->
    <g id="holes">
`;

    state.holes.forEach((hole, i) => {
        const cx = hole.x / state.pixelsPerInch;
        const cy = hole.y / state.pixelsPerInch;
        const r = hole.diameter / 2;

        svg += `        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="black" stroke-width="0.01"/>\n`;
        svg += `        <text x="${cx}" y="${cy}" text-anchor="middle" font-size="0.1" fill="blue">${i + 1}: ${hole.name}</text>\n`;
    });

    svg += `    </g>\n`;

    // Traced cutout
    if (state.tracePoints.length > 2) {
        svg += `    <!-- Traced Cutout -->\n`;
        svg += `    <g id="cutout">\n`;
        svg += `        <path d="M `;

        state.tracePoints.forEach((point, i) => {
            const x = point.x / state.pixelsPerInch;
            const y = point.y / state.pixelsPerInch;
            svg += i === 0 ? `${x},${y} ` : `L ${x},${y} `;
        });

        svg += `Z" fill="none" stroke="red" stroke-width="0.02"/>\n`;
        svg += `    </g>\n`;
    }

    svg += `</svg>`;

    // Download
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'harness-plate.svg';
    a.click();
    URL.revokeObjectURL(url);
}

// Export STL
function exportSTL() {
    if (!state.pixelsPerInch) {
        alert('Please calibrate the ruler first!');
        return;
    }

    alert('STL export coming soon! For now, use the SVG and extrude in your CAD software.\n\nRecommended settings:\n- Extrude depth: ' + plateThickness.value + 'mm\n- Use SVG import in Fusion 360, Tinkercad, or Blender');
}

// Send to Google Spreadsheet
async function sendToSpreadsheet() {
    if (!state.pixelsPerInch) {
        alert('Please calibrate the ruler first!');
        return;
    }

    if (state.holes.length === 0) {
        alert('Please add at least one hole!');
        return;
    }

    const customerName = prompt('Customer Name:');
    if (!customerName) return;

    const customerEmail = prompt('Customer Email (optional):');
    const notes = prompt('Additional Notes (optional):');

    const plateData = {
        timestamp: new Date().toISOString(),
        customerName,
        customerEmail: customerEmail || '',
        notes: notes || '',
        plateThickness: plateThickness.value + 'mm',
        scale: `${state.pixelsPerInch.toFixed(2)} px/inch`,
        imageWidth: (canvas.width / state.pixelsPerInch).toFixed(2) + '"',
        imageHeight: (canvas.height / state.pixelsPerInch).toFixed(2) + '"',
        holes: state.holes.map((hole, i) => ({
            number: i + 1,
            component: hole.name,
            diameter: hole.diameter + '"',
            x: (hole.x / state.pixelsPerInch).toFixed(3) + '"',
            y: (hole.y / state.pixelsPerInch).toFixed(3) + '"'
        })),
        tracePoints: state.tracePoints.length,
        hasTracedCutout: state.tracePoints.length > 2
    };

    try {
        const jsonString = JSON.stringify(plateData, null, 2);
        await navigator.clipboard.writeText(jsonString);

        alert(`Data copied to clipboard!

Customer: ${customerName}
Holes: ${state.holes.length}
Traced Cutout: ${plateData.hasTracedCutout ? 'Yes' : 'No'}

Paste this into your spreadsheet or configure the Google Apps Script URL to auto-send.`);

    } catch (error) {
        console.error('Error:', error);
        alert('Error sending to print queue. Data has been logged to console.');
        console.log('Print Queue Data:', plateData);
    }
}

// Make deleteHole available globally
window.deleteHole = deleteHole;

// Initialize
updateStatus();
