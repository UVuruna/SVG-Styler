import { KnobSlider } from './knobSlider.js'
import * as decorator from '../decorator.js'

export class SliderInitializer {
    @decorator.CatchErrors
    @decorator.MeasureExecutionTime
    public static initKnobSlider(
        sliders: Record<string, { value: number; maxValue: number }>
    ): void {
        /*
                Initialize all KnobSliders on the page with the provided sliders configuration.
                Each slider is created with its respective default value and maximum value.
            */
        const sliderElements = document.querySelectorAll(
            '.slider'
        ) as NodeListOf<HTMLElement>
        for (const el of sliderElements) {
            const element = el as HTMLElement
            const name = element.getAttribute('ID')! as string
            const config = sliders[name]
            new KnobSlider(element, config.value, config.maxValue)
        }
    }
}
