export class colorizeKnob {
    constructor(svgElement, colorsList = [], color = '') {
        this.stopElements = [];
        this.svgElement = svgElement;
        this.colorsList = colorsList;
        for (const gradient of this.svgElement.querySelectorAll('linearGradient')) {
            for (const stop of gradient.querySelectorAll('stop')) {
                this.stopElements.push(stop);
                const color = stop.getAttribute('stop-color');
                this.colorsList.push(color);
            }
        }
    }
}
