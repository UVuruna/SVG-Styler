const loadSvgBtn = document.getElementById('loadSvgBtn') as HTMLButtonElement;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const svgContainer = document.getElementById('svgContainer') as HTMLDivElement;

loadSvgBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const svgText = event.target?.result as string;
    svgContainer.innerHTML = svgText;
  };

  reader.readAsText(file);
});
