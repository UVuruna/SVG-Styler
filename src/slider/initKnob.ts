import { KnobSlider } from './funcKnob.js'
import * as decorator from '../decorator.js'

export class SliderInitializer {
    private static sliderElements: NodeListOf<HTMLElement>

    @decorator.CatchErrors
    @decorator.MeasureExecutionTime
    public static init(sliders: Record<string, { value: number; maxValue: number; radius:number; infinite:boolean }>): void {
        /*
            Initialize all KnobSliders on the page with the provided sliders configuration.
            Each slider is created with its respective default value and maximum value.
        */
        SliderInitializer.sliderElements = document.querySelectorAll('.slider') as NodeListOf<HTMLElement>

        for (const el of SliderInitializer.sliderElements) {
            const element = el as HTMLElement
            const config = sliders[element.id]
            new KnobSlider(element, config.value, config.maxValue, config.radius, config.infinite)
        }
    }
}
