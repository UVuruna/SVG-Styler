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
    constructor(root, defaultValue, maxValue) {
        this.isRotating = false;
        this.lastTap = 0;
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
            const rotationAngle = (angleDeg - 135 + 360) % 360;
            if (rotationAngle <= 270) {
                /*
                    Main logic for updating the slider based on the rotation angle
                    Calculate the progress percentage and update the circle, pointer, value, and exact value
                */
                const progressPercent = rotationAngle / 270;
                this.pointer.style.transform = `rotate(${rotationAngle - 135}deg)`;
                this.circle.style.strokeDashoffset = `${817 - 613 * progressPercent}`;
                this.value.innerHTML = `${Math.round(progressPercent * this.maxValue)}`;
                this.exactValue.value = (progressPercent * this.maxValue).toString();
            }
            else if (rotationAngle > 353) {
                // Reset to initial state if the angle is outside the range on the LEFT side
                this.circle.style.strokeDashoffset = '817';
                this.value.innerHTML = '0';
                this.exactValue.value = '0';
                this.pointer.style.transform = `rotate(-135deg)`;
            }
            else if (rotationAngle > 270 && rotationAngle < 277) {
                // Set to maximum value if the angle is outside the range on the RIGHT side
                this.circle.style.strokeDashoffset = '204';
                this.value.innerHTML = `${this.maxValue}`;
                this.exactValue.value = this.maxValue.toString();
                this.pointer.style.transform = `rotate(135deg)`;
            }
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
        this.circle = root.querySelector('.circle');
        this.exactValue = root.querySelector('.exact-value');
        this.defaultValue = defaultValue;
        this.maxValue = maxValue;
        this.initListeners();
        this.resetKnob();
    }
    resetKnob() {
        /*
            Reset the Pointer, the Colored Circle, the Value, the Exact Value of that Slider to their initial state
        */
        this.isRotating = false;
        this.pointer.style.transform = 'rotate(0deg)';
        this.circle.style.strokeDashoffset = '510';
        this.value.innerHTML = `${this.defaultValue}`;
        this.exactValue.value = this.defaultValue.toString();
    }
    initListeners() {
        /*
            Initialize event listeners for touch and mouse events to handle rotation and reset actions
        */
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            // Mobile devices
            this.slider.addEventListener('touchstart', () => this.isRotating = true);
            document.addEventListener('touchmove', this.rotateKnob);
            document.addEventListener('touchend', () => this.isRotating = false);
            this.rotator.addEventListener('touchend', (e) => {
                const now = new Date().getTime();
                const tapLength = now - this.lastTap;
                if (tapLength < 300 && tapLength > 0)
                    this.resetKnob();
                this.lastTap = now;
            });
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
    __metadata("design:paramtypes", [HTMLElement, Number, Number])
], KnobSlider);
export { KnobSlider };
