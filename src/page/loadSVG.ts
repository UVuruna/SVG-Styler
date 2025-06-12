const loadSvgBtn = document.getElementById('loadSvgBtn') as HTMLButtonElement;
const applyFilter = document.getElementById('applyFilter') as HTMLButtonElement;
const resetSettings = document.getElementById('resetSettings') as HTMLButtonElement;

const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const svgContainer = document.getElementById('svgContainer') as HTMLElement;

const filters = ['sepia','brightness','contrast','saturate','hue-rotate','invert','grayscale'];
const defaultValues = ['1','1','1','0','0','0','0'];

loadSvgBtn.addEventListener('click', () => fileInput.click());
applyFilter.addEventListener('click', () => applyFilterFunc());
resetSettings.addEventListener('click', () => resetSettingsFunc());

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const svgText = event.target?.result as string;
    svgContainer.innerHTML = svgText;

    const svgEl = svgContainer.querySelector('svg');
    if (svgEl) {
      svgEl.style.maxWidth = '100%';
      svgEl.style.height = 'auto';
      svgEl.style.filter = ''; // remove filter when loading new
    }
  };

  reader.readAsText(file);
});

function applyFilterFunc() {
  let filterValue: string[] = [];
  for (const filter of filters) {
    const valueEl = document.getElementById(`${filter}-value`) as HTMLInputElement;
    const value = parseFloat(valueEl.value);
    const unit = (filter !== 'hue-rotate') ? '' : 'deg';
    const valueFixed = (filter !== 'hue-rotate') ? value / 100 : value;
    filterValue.push(`${filter}(${valueFixed.toFixed(2)}${unit})`);
  }

  const filterString = filterValue.join(' ');
  console.log('Applying filter:', filterString);

  const svgEl = svgContainer.querySelector('svg') as SVGElement | null;
  if (svgEl) {
    svgEl.style.filter = filterString;
  }
}

function resetSettingsFunc() {
  let filterValue: string[] = [];

  for (const [i, filter] of filters.entries()) {
    const valueEl = document.getElementById(`${filter}-value`) as HTMLInputElement;
    const defaultVal = parseFloat(defaultValues[i]);
    valueEl.value = (filter === 'hue-rotate') ? (defaultVal).toString() : (defaultVal * 100).toString();

    const unit = (filter !== 'hue-rotate') ? '' : 'deg';
    filterValue.push(`${filter}(${defaultValues[i]}${unit})`);
  }

  const filterString = filterValue.join(' ');
  console.log('Resetting filter:', filterString);

  const svgEl = svgContainer.querySelector('svg') as SVGElement | null;
  if (svgEl) {
    svgEl.style.filter = filterString;
  }
}
