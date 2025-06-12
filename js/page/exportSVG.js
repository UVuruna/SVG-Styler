"use strict";
const exportSvgBtn = document.getElementById('exportSvg');
exportSvgBtn.addEventListener('click', () => exportCurrentSvg());
function exportCurrentSvg() {
    const svgEl = svgContainer.querySelector('svg');
    if (!svgEl) {
        alert("No SVG loaded.");
        return;
    }
    const clonedSvg = svgEl.cloneNode(true);
    // Apply filter as inline style if any
    const currentFilter = svgEl.style.filter;
    if (currentFilter) {
        clonedSvg.setAttribute('style', `filter: ${currentFilter};`);
    }
    // Get full SVG string
    const svgString = `<?xml version="1.0" encoding="UTF-8"?>\n` + clonedSvg.outerHTML;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered-image.svg';
    a.click();
    // Clean up
    URL.revokeObjectURL(url);
}
