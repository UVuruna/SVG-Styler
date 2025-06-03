import * as decorator from '../decorator.js'

export class colorizeKnob {
    private svgElement: SVGAElement
    private stopElements: SVGStopElement[] = []
    private colorsList: string[]

    constructor(svgElement: SVGAElement, colorsList: string[] = [], color: string = '') {

        this.svgElement = svgElement as SVGAElement
        this.colorsList = colorsList as string[]

        for (const gradient of this.svgElement.querySelectorAll('linearGradient')) {
            for (const stop of gradient.querySelectorAll('stop')) {

                this.stopElements.push(stop)
                const color = stop.getAttribute('stop-color') as string
                this.colorsList.push(color)
            }
        }
    }
}
