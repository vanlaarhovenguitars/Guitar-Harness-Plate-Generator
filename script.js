// State management
const state = {
    image: null,
    holes: [],
    tracePoints: [],
    rulerPoints: [],
    pixelsPerInch: null,
    rulerUnit: 'inch',
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
const rulerUnit = document.getElementById('rulerUnit');
const unitLabel = document.getElementById('unitLabel');

// Event listeners
imageUpload.addEventListener('change', handleImageUpload);
componentType.addEventListener('change', handleComponentChange);
canvas.addEventListener('click', handleCanvasClick);

// Ruler unit change
rulerUnit.addEventListener('change', (e) => {
    state.rulerUnit = e.target.value;
    unitLabel.textContent = e.target.value === 'inch' ? 'inches' : 'millimeters';
    if (e.target.value === 'inch') {
        rulerDistance.step = '0.125';
        rulerDistance.value = '1.0';
    } else {
        rulerDistance.step = '1';
        rulerDistance.value = '25.4';
    }
});

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
        const distanceValue = parseFloat(rulerDistance.value);

        // Convert to pixels per inch (always store internally as px/inch)
        if (state.rulerUnit === 'mm') {
            // Convert mm to inches (1 inch = 25.4 mm)
            const distanceInches = distanceValue / 25.4;
            state.pixelsPerInch = distancePixels / distanceInches;
            status.textContent = `✓ Ruler calibrated! (${state.pixelsPerInch.toFixed(2)} px/inch, ${distanceValue}mm scale)`;
        } else {
            state.pixelsPerInch = distancePixels / distanceValue;
            status.textContent = `✓ Ruler calibrated! (${state.pixelsPerInch.toFixed(2)} px/inch, ${distanceValue}" scale)`;
        }
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
        const eraseRadius = 30 / state.zoom;
        let found = false;

        // Check holes
        for (let i = state.holes.length - 1; i >= 0; i--) {
            const hole = state.holes[i];
            const dist = Math.sqrt((hole.x - x) ** 2 + (hole.y - y) ** 2);
            if (dist < eraseRadius) {
                state.holes.splice(i, 1);
                found = true;
                break;
            }
        }

        // Check trace points
        if (!found) {
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

    // Add holes
    state.holes.forEach((hole, i) => {
        const li = document.createElement('li');
        li.className = 'hole-item';
        li.innerHTML = `
            <span>${i + 1}. ${hole.name} (${hole.diameter}")</span>
            <button class="delete" onclick="deleteItem('hole', ${i})">✕</button>
        `;
        holeList.appendChild(li);
    });
}

// Delete item
function deleteItem(type, index) {
    if (type === 'hole') {
        state.holes.splice(index, 1);
    }
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
        status.textContent = 'Click to trace cutout outline (like F-holes). Add multiple points.';
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

    if (state.holes.length === 0 && state.tracePoints.length < 3) {
        alert('Please add at least one hole or trace a cutout before exporting!');
        return;
    }

    // Calculate bounding box for the plate
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // Include holes in bounding box
    state.holes.forEach(hole => {
        const radius = (hole.diameter / 2) * state.pixelsPerInch;
        minX = Math.min(minX, hole.x - radius);
        minY = Math.min(minY, hole.y - radius);
        maxX = Math.max(maxX, hole.x + radius);
        maxY = Math.max(maxY, hole.y + radius);
    });

    // Include trace points in bounding box
    state.tracePoints.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    });

    // If no holes or traces, use canvas dimensions
    if (minX === Infinity) {
        minX = 0;
        minY = 0;
        maxX = canvas.width;
        maxY = canvas.height;
    }

    // Add margin (0.5 inches = 12.7mm) around the content
    const margin = state.pixelsPerInch * 0.5;
    minX -= margin;
    minY -= margin;
    maxX += margin;
    maxY += margin;

    // Always export in millimeters for better CAD compatibility (Tinkercad, Fusion 360, etc.)
    // Convert pixels to inches first, then to mm
    const plateWidthInches = (maxX - minX) / state.pixelsPerInch;
    const plateHeightInches = (maxY - minY) / state.pixelsPerInch;

    // Convert to millimeters (1 inch = 25.4 mm)
    const plateWidthMM = plateWidthInches * 25.4;
    const plateHeightMM = plateHeightInches * 25.4;

    // Start SVG with millimeter dimensions (better for CAD software)
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${plateWidthMM.toFixed(3)}mm" height="${plateHeightMM.toFixed(3)}mm" viewBox="0 0 ${plateWidthMM.toFixed(3)} ${plateHeightMM.toFixed(3)}" xmlns="http://www.w3.org/2000/svg">
    <desc>Guitar Harness Plate - Generated by VL Guitar Repair | ${state.holes.length} holes | Dimensions: ${plateWidthMM.toFixed(2)}mm x ${plateHeightMM.toFixed(2)}mm</desc>
    <defs>
        <style>
            .plate-outline { fill: #e0e0e0; stroke: #000; stroke-width: 0.3; }
            .hole-cutout { fill: #fff; stroke: #000; stroke-width: 0.15; }
            .trace-cutout { fill: none; stroke: #f00; stroke-width: 0.3; }
        </style>
    </defs>

    <!-- Plate Rectangle Frame -->
    <rect x="0" y="0" width="${plateWidthMM.toFixed(3)}" height="${plateHeightMM.toFixed(3)}" class="plate-outline"/>

    <!-- Hole Cutouts -->
    <g id="holes">
`;

    // Add each hole as a cutout circle (in millimeters)
    state.holes.forEach((hole) => {
        // Convert hole position and diameter to mm
        const cxInches = (hole.x - minX) / state.pixelsPerInch;
        const cyInches = (hole.y - minY) / state.pixelsPerInch;
        const cx = cxInches * 25.4;
        const cy = cyInches * 25.4;
        const r = (hole.diameter / 2) * 25.4; // Convert inches to mm

        svg += `        <circle cx="${cx.toFixed(3)}" cy="${cy.toFixed(3)}" r="${r.toFixed(3)}" class="hole-cutout"/>\n`;
    });

    svg += `    </g>\n`;

    // Add traced cutout if exists
    if (state.tracePoints.length > 2) {
        svg += `
    <!-- Traced Cutout Path -->
    <g id="cutout">
        <path d="M `;

        state.tracePoints.forEach((point, i) => {
            const xInches = (point.x - minX) / state.pixelsPerInch;
            const yInches = (point.y - minY) / state.pixelsPerInch;
            const x = (xInches * 25.4).toFixed(3);
            const y = (yInches * 25.4).toFixed(3);
            svg += i === 0 ? `${x},${y} ` : `L ${x},${y} `;
        });

        svg += `Z" class="trace-cutout"/>\n`;
        svg += `    </g>\n`;
    }

    svg += `</svg>`;

    // Download
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harness-plate-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`SVG exported successfully!\n\nPlate dimensions: ${plateWidthMM.toFixed(2)}mm × ${plateHeightMM.toFixed(2)}mm (${plateWidthInches.toFixed(2)}" × ${plateHeightInches.toFixed(2)}")\nHoles: ${state.holes.length}\nTraced Cutouts: ${state.tracePoints.length > 2 ? '1 path' : 'none'}\n\nOptimized for Tinkercad, Fusion 360, and other CAD software.`);
}

// Export STL
function exportSTL() {
    if (!state.pixelsPerInch) {
        alert('Please calibrate the ruler first!');
        return;
    }

    if (state.holes.length === 0 && state.tracePoints.length < 3) {
        alert('Please add at least one hole or trace a cutout before exporting!');
        return;
    }

    // Show loading message
    status.textContent = 'Generating 3D model... This may take a moment.';

    // Use setTimeout to allow UI to update
    setTimeout(() => {
        try {
            const stl = generateSTL();
            downloadSTL(stl);
            status.textContent = 'STL exported successfully!';
        } catch (error) {
            console.error('STL Export Error:', error);
            alert('Error generating STL: ' + error.message + '\n\nPlease check the console for details.');
            status.textContent = 'Error generating STL. See console for details.';
        }
    }, 100);
}

// Generate STL mesh using Three.js (simple version without CSG)
function generateSTL() {
    // Calculate bounding box (same as SVG export)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    state.holes.forEach(hole => {
        const radius = (hole.diameter / 2) * state.pixelsPerInch;
        minX = Math.min(minX, hole.x - radius);
        minY = Math.min(minY, hole.y - radius);
        maxX = Math.max(maxX, hole.x + radius);
        maxY = Math.max(maxY, hole.y + radius);
    });

    state.tracePoints.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    });

    if (minX === Infinity) {
        minX = 0;
        minY = 0;
        maxX = canvas.width;
        maxY = canvas.height;
    }

    // Add margin
    const margin = state.pixelsPerInch * 0.5;
    minX -= margin;
    minY -= margin;
    maxX += margin;
    maxY += margin;

    // Convert to millimeters
    const plateWidthMM = ((maxX - minX) / state.pixelsPerInch) * 25.4;
    const plateHeightMM = ((maxY - minY) / state.pixelsPerInch) * 25.4;
    const plateThicknessMM = parseFloat(plateThickness.value);

    // Create base plate geometry
    const plateGeometry = new THREE.BoxGeometry(plateWidthMM, plateHeightMM, plateThicknessMM);

    // Combine all geometries
    const meshes = [];

    // Add main plate
    const plateMesh = new THREE.Mesh(plateGeometry);
    plateMesh.updateMatrix();
    meshes.push(plateMesh);

    // Add cylindrical markers for holes (will protrude slightly to show hole positions)
    state.holes.forEach((hole, index) => {
        const holeXMM = ((hole.x - minX) / state.pixelsPerInch) * 25.4 - plateWidthMM / 2;
        const holeYMM = ((hole.y - minY) / state.pixelsPerInch) * 25.4 - plateHeightMM / 2;
        const holeDiameterMM = hole.diameter * 25.4;
        const holeRadiusMM = holeDiameterMM / 2;

        // Create cylinder marker (slightly smaller than hole for visual clarity)
        const holeGeometry = new THREE.CylinderGeometry(
            holeRadiusMM * 0.9,
            holeRadiusMM * 0.9,
            plateThicknessMM + 2, // Protrude 1mm on each side
            32
        );
        const holeMesh = new THREE.Mesh(holeGeometry);
        holeMesh.rotation.x = Math.PI / 2;
        holeMesh.position.set(holeXMM, holeYMM, 0);
        holeMesh.updateMatrix();
        meshes.push(holeMesh);
    });

    // Convert all meshes to STL
    let stlString = 'solid plate\n';

    meshes.forEach(mesh => {
        const geometry = mesh.geometry;
        const vertices = geometry.attributes.position.array;
        const matrix = mesh.matrix;

        // Process triangles
        for (let i = 0; i < vertices.length; i += 9) {
            const v1 = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);
            const v2 = new THREE.Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
            const v3 = new THREE.Vector3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);

            // Apply transformation matrix
            v1.applyMatrix4(matrix);
            v2.applyMatrix4(matrix);
            v3.applyMatrix4(matrix);

            // Calculate normal
            const cb = new THREE.Vector3();
            const ab = new THREE.Vector3();
            cb.subVectors(v3, v2);
            ab.subVectors(v1, v2);
            cb.cross(ab);
            cb.normalize();

            stlString += `  facet normal ${cb.x.toFixed(6)} ${cb.y.toFixed(6)} ${cb.z.toFixed(6)}\n`;
            stlString += '    outer loop\n';
            stlString += `      vertex ${v1.x.toFixed(6)} ${v1.y.toFixed(6)} ${v1.z.toFixed(6)}\n`;
            stlString += `      vertex ${v2.x.toFixed(6)} ${v2.y.toFixed(6)} ${v2.z.toFixed(6)}\n`;
            stlString += `      vertex ${v3.x.toFixed(6)} ${v3.y.toFixed(6)} ${v3.z.toFixed(6)}\n`;
            stlString += '    endloop\n';
            stlString += '  endfacet\n';
        }
    });

    stlString += 'endsolid plate\n';

    return stlString;
}

// Download STL file
function downloadSTL(stlString) {
    const blob = new Blob([stlString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harness-plate-${Date.now()}.stl`;
    a.click();
    URL.revokeObjectURL(url);

    alert(`STL file exported!

⚠️ IMPORTANT: This STL has markers, not actual holes.

🎯 RECOMMENDED WORKFLOW (Easiest):
1. Export SVG instead (button above)
2. Import SVG into Tinkercad
3. Holes will be properly defined as cutouts
4. Extrude the plate shape
5. Export STL from Tinkercad

📦 CURRENT STL CONTENTS:
• Base plate (${plateThickness.value}mm thick)
• Cylinder markers showing hole positions

If using this STL:
• Import into Tinkercad/Fusion 360
• Use cylinder markers as guides
• Manually subtract holes using "Hole" tool

👉 For best results, use SVG → Tinkercad!`);
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

// Make deleteItem available globally
window.deleteItem = deleteItem;

// Initialize
updateStatus();
