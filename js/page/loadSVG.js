"use strict";
const loadSvgBtn = document.getElementById('loadSvgBtn');
const fileInput = document.getElementById('fileInput');
const svgContainer = document.getElementById('svgContainer');
loadSvgBtn.addEventListener('click', () => {
    fileInput.click();
});
fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file)
        return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const svgText = event.target?.result;
        svgContainer.innerHTML = svgText;
    };
    reader.readAsText(file);
});
