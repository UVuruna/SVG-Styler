var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { KnobSlider } from './knobSlider.js';
import * as decorator from '../decorator.js';
export class SliderInitializer {
    static initKnobSlider(sliders) {
        /*
                Initialize all KnobSliders on the page with the provided sliders configuration.
                Each slider is created with its respective default value and maximum value.
            */
        const sliderElements = document.querySelectorAll('.slider');
        for (const el of sliderElements) {
            const element = el;
            const name = element.getAttribute('ID');
            const config = sliders[name];
            new KnobSlider(element, config.value, config.maxValue);
        }
    }
}
__decorate([
    decorator.CatchErrors,
    decorator.MeasureExecutionTime,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SliderInitializer, "initKnobSlider", null);
