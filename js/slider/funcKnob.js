var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as decorator from '../decorator.js';
let KnobSlider = class KnobSlider {
    constructor(root, defaultValue, maxValue, radius, infinite) {
        this.circles = [];
        this.isRotating = false;
        this.lastTap = 0;
        this.totalValue = 0;
        this.rotateKnob = (e) => {
            /*
                Prevent default behavior for touchmove to avoid scrolling
                Calculate the angle based on the mouse/touch position relative to the center of the knob
                and update the Pointer, the Colored Circle, the Value, the Exact Value of that Slider accordingly
            */
            if (e.type === 'touchmove')
                e.preventDefault();
            if (!this.isRotating)
                return;
            // Calculate the center of the knob
            const rect = this.knob.getBoundingClientRect();
            const centerX = rect.left + this.knob.clientWidth / 2;
            const centerY = rect.top + this.knob.clientHeight / 2;
            // Determine the position of the mouse or touch
            let clientX, clientY;
            if (e instanceof TouchEvent && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }
            else if (e instanceof MouseEvent) {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            else
                return;
            // Calculate the angle based on the position relative to the center
            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;
            const angleRad = Math.atan2(deltaY, deltaX);
            const angleDeg = (angleRad * 180) / Math.PI;
            const rotationAngle = (angleDeg - 90 + 360) % 360;
            const progressPercent = rotationAngle / 360;
            console.log(rotationAngle, progressPercent);
            const index = Math.floor(progressPercent * 4);
            this.setDashArray(progressPercent, index);
            this.pointer.style.transform = `rotate(${rotationAngle}deg)`;
            this.value.innerHTML = `${Math.round(progressPercent * this.maxValue)}`;
            this.exactValue.value = (progressPercent * this.maxValue).toString();
            /*
                Main logic for updating the slider based on the rotation angle
                Calculate the progress percentage and update the circle, pointer, value, and exact value
            */
            // Reset to initial state if the angle is outside the range on the LEFT side
            // Set to maximum value if the angle is outside the range on the RIGHT side
        };
        /*
            Initialize the KnobSlider with a root element, default value, and maximum value.
            Set up the necessary elements and event listeners for interaction.
        */
        this.slider = root;
        this.knob = root.querySelector('.knob');
        this.rotator = root.querySelector('.rotator');
        this.pointer = root.querySelector('.pointer-frame');
        this.value = root.querySelector('.value');
        this.circles = Array.from(root.querySelectorAll('circle')).slice(1);
        this.exactValue = root.querySelector('.exact-value');
        const circlesCount = this.circles.length;
        this.radius = Math.PI * 260 * (radius / 360);
        for (const [i, circle] of this.circles.entries()) {
            circle.style.transform = `rotate(${Math.round(i * 360 / circlesCount)}deg)`;
            circle.style.strokeDasharray = `0 ${this.radius}`;
        }
        this.percentage = 1 / this.circles.length;
        this.dash = this.radius * this.percentage;
        this.empty = this.radius - this.dash;
        this.defaultValue = defaultValue;
        this.maxValue = maxValue;
        this.infinite = infinite;
        this.initListeners();
        this.resetKnob();
    }
    setDashArray(percentage, index) {
        for (const [i, circle] of this.circles.entries()) {
            if (i === index) {
                const full = this.radius * (percentage - this.percentage * i);
                circle.style.strokeDasharray = `${full} ${this.radius - full}`;
            }
            else if (i < index) {
                circle.style.strokeDasharray = `${this.dash} ${this.empty}`;
            }
            else {
                circle.style.strokeDasharray = `0 ${this.radius}`;
            }
        }
    }
    resetKnob() {
        /*
            Reset the Pointer, the Colored Circle, the Value, the Exact Value of that Slider to their initial state
        */
        this.isRotating = false;
        this.value.innerHTML = `${this.defaultValue}`;
        this.exactValue.value = this.defaultValue.toString();
        this.setDashArray(0, 0);
    }
    initListeners() {
        /*
            Initialize event listeners for touch and mouse events to handle rotation and reset actions
        */
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            // Mobile devices
            const doubleTouch = (e) => {
                e.preventDefault();
                const now = new Date().getTime();
                const tapLength = now - this.lastTap;
                if (tapLength < 300 && tapLength > 0)
                    this.resetKnob();
                this.lastTap = now;
            };
            this.slider.addEventListener('touchstart', () => this.isRotating = true);
            document.addEventListener('touchmove', this.rotateKnob, { passive: false });
            document.addEventListener('touchend', () => this.isRotating = false);
            this.rotator.addEventListener('touchstart', doubleTouch, { passive: false });
        }
        else {
            // Desktop devices
            this.slider.addEventListener('mousedown', () => this.isRotating = true);
            document.addEventListener('mousemove', this.rotateKnob);
            document.addEventListener('mouseup', () => this.isRotating = false);
            this.rotator.addEventListener('dblclick', () => this.resetKnob());
        }
    }
};
__decorate([
    decorator.CatchErrors,
    decorator.MeasureExecutionTime,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], KnobSlider.prototype, "setDashArray", null);
__decorate([
    decorator.CatchErrors,
    decorator.Throttle(1000),
    decorator.MeasureExecutionTime,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KnobSlider.prototype, "resetKnob", null);
__decorate([
    decorator.CatchErrors,
    decorator.MeasureExecutionTime,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KnobSlider.prototype, "initListeners", null);
KnobSlider = __decorate([
    decorator.LogClassCreation,
    decorator.MeasureConstructionTime,
    __metadata("design:paramtypes", [HTMLElement, Number, Number, Number, Boolean])
], KnobSlider);
export { KnobSlider };
