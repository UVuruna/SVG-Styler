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
    constructor(root, defaultValue, maxValue, strokeDegree, infinite) {
        /*
            Initializing KnobSlider:
            • root – the root element containing all parts (SVG, knob, value).
            • defaultValue – the initial value (in absolute units before conversion).
            • maxValue – the maximum value for one “round” (before conversion).
            • strokeDegree – the portion of the circle (in degrees) that is colored (e.g., 270°); the rest remains “empty.”
            • infinite – if true, enables infinite rotation (wrapping past 360° back to 0°).
        */
        this.circles = [];
        this.centerX = 0;
        this.centerY = 0;
        // True while the user is actively dragging/rotating the knob
        this.isRotating = false;
        // Timestamp (ms) of the last ‘tap’ on mobile to detect double‐tap
        this.lastTap = 0;
        this.angle = 0; // Last recorded pointer angle (0..360)
        this.totalValue = 0; // Accumulated “full revolutions” if infinite mode is on
        // >>> METHOD MAIN <<<
        /**
             * Called once when the user presses down (touchstart/mousedown).
             * Caches the knob’s center coordinates, then marks isRotating = true so future moves apply rotation.
        */
        this.startRotation = (e) => {
            const rect = this.knob.getBoundingClientRect();
            this.centerX = rect.left + this.knob.clientWidth / 2;
            this.centerY = rect.top + this.knob.clientHeight / 2;
            this.isRotating = true;
        };
        // >>> METHOD MAIN <<<
        /**
            * Called on every mousemove or touchmove (as long as isRotating is true).
            * 1) Prevent page scrolling on touch devices.
            * 2) Compute the pointer’s (x,y) and derive an angle from center.
            * 3) Normalize that angle into 0..360 by subtracting (90 + offset).
            * 4) If infinite mode is on, detect if we crossed the 0°/360° boundary and adjust totalValue accordingly.
            * 5) If we’re in the unfillable “gap” (when strokeDegree < 360), snap to boundary via outOfBoundaries().
            * 6) Otherwise, call setDashArray() with the new progress percentage (0..1).
        */
        this.rotateKnob = (e) => {
            if (e.type === 'touchmove')
                e.preventDefault();
            if (!this.isRotating)
                return;
            // 1) Determine pointer coordinates
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
            // 2) Compute raw angle (−180..180), then convert to [0..360)
            const deltaX = clientX - this.centerX;
            const deltaY = clientY - this.centerY;
            const angleRad = Math.atan2(deltaY, deltaX);
            const angleDeg = (angleRad * 180) / Math.PI;
            const rotationAngle = (angleDeg - (90 + this.offset) + 360) % 360;
            const progressPercent = rotationAngle / 360;
            // 3) Infinite mode: detect crossing 0/360 boundary
            if (this.infinite) {
                const delta = rotationAngle - this.angle;
                // If pointer jumped backward over 0° (e.g., 1° → 359°), rawDelta > +180
                if (delta > 180) {
                    if (this.totalValue)
                        this.totalValue -= this.maxValue;
                    // Snap to absolute minimum if they tried to go negative
                    else {
                        this.outOfBoundaries(0, 0, 0);
                        return;
                    }
                    // If pointer jumped forward over 360° (e.g., 359° → 1°), rawDelta < -180
                }
                else if (delta < -180)
                    this.totalValue += this.maxValue;
            }
            // 4) Store new angle for next move comparison
            this.angle = rotationAngle;
            // 5) If slider is not a full circle (offset > 0) and pointer is in the “gap,” clamp
            if (this.offset && rotationAngle > 360 - 2 * this.offset) {
                // Left gap: snap to minimum
                if (rotationAngle > 360 - this.offset)
                    this.outOfBoundaries(0, 0, 0);
                // Right gap: snap to maximum
                else
                    this.outOfBoundaries(this.dash, this.maxValue, 360 - 2 * this.offset);
                // 6) Normal case: fill segments and rotate pointer
            }
            else
                this.setDashArray(progressPercent);
        };
        // Capture DOM references
        this.slider = root;
        this.knob = root.querySelector('.knob');
        this.pointer = root.querySelector('.pointer-frame');
        this.value = root.querySelector('.value');
        this.exactValue = root.querySelector('.exact-value');
        // Take all <circle> elements. The first is a background; the rest form the gradient segments.
        const allCircles = Array.from(root.querySelectorAll('circle'));
        this.circles = allCircles.slice(1);
        this.circleCount = this.circles.length;
        // Calculate how many degrees remain unfillable on each side if strokeDegree < 360
        this.offset = Math.round((360 - strokeDegree) / 2);
        // Derive circumference from the SVG circle’s radius (fallback to 130px if not specified)
        const radius = parseFloat(allCircles[0].getAttribute('r')) || 130;
        this.circumference = Math.PI * 2 * radius;
        // Each segment is the same fraction of the circle’s circumference
        this.percentage = 1 / this.circles.length;
        // DASH is length of Coloring Circle Segment and we ADD 1 to those that are not full Circle because they don't have ROUND Linecap
        this.dash = this.circumference * this.percentage;
        if (strokeDegree < 360)
            this.dash += 1;
        // Coeficient for calculation VALUE on NOT FULL Circles
        this.valueCoef = strokeDegree / 360;
        this.defaultValue = defaultValue;
        this.maxValue = maxValue;
        this.infinite = infinite;
        // Configure each SVG segment’s stroke and rotation
        for (const [i, circle] of allCircles.entries()) {
            if (strokeDegree < 360) {
                // If not a full circle, hide the last circle (it’s just a placeholder) and unset round linecap
                if (i === allCircles.length - 1) {
                    circle.style.display = 'none';
                    continue;
                }
                else {
                    circle.style.strokeLinecap = 'unset';
                }
            }
            // Each segment has the same stroke length (circumference * strokeDegree/360)
            circle.style.strokeDasharray = `${this.circumference * strokeDegree / 360}`;
            // Rotate the segment so that fillable portions line up correctly
            circle.style.transform = `rotate(${this.offset + Math.round(((i > 0) ? i - 1 : i) * 360 / this.circleCount)}deg)`;
        }
        // SETTING Listeners and Starting Position of KNOB SLIDERS
        this.initListeners();
        this.resetKnob();
    }
    setDashArray(percentage) {
        const index = Math.floor(percentage * this.circleCount);
        const emptyStroke = this.circumference / this.valueCoef;
        for (const [i, circle] of this.circles.entries()) {
            // Partially filled segment                 
            if (i === index) {
                const full = this.circumference * (percentage - this.percentage * i);
                circle.style.strokeDasharray = `${full} ${emptyStroke}`;
            }
            // Fully filled segment
            else if (i < index)
                circle.style.strokeDasharray = `${this.dash} ${emptyStroke}`;
            // Not filled
            else
                circle.style.strokeDasharray = `0 ${emptyStroke}`;
        }
        // Rotate pointer handle to (percentage * 360 + offset)
        this.pointer.style.transform = `rotate(${percentage * 360 + this.offset}deg)`;
        // Compute displayed numeric value
        const computedValue = this.totalValue + (percentage * this.maxValue) / this.valueCoef;
        this.value.innerHTML = computedValue.toFixed(0);
        this.exactValue.value = computedValue.toString();
    }
    outOfBoundaries(dash, value, angle) {
        const emptyStroke = this.circumference / this.valueCoef;
        for (const [i, circle] of this.circles.entries()) {
            circle.style.strokeDasharray = `${dash} ${emptyStroke}`;
        }
        this.value.innerHTML = value.toString();
        this.exactValue.value = value.toString();
        this.pointer.style.transform = `rotate(${angle + this.offset}deg)`;
    }
    resetKnob() {
        const percentage = this.defaultValue / this.maxValue;
        this.angle = (360 - this.offset * 2) * this.defaultValue / this.maxValue;
        this.totalValue = 0;
        this.isRotating = false;
        // Update numeric displays
        const displayedDefault = this.defaultValue / this.valueCoef;
        this.value.innerHTML = displayedDefault.toFixed(0);
        this.exactValue.value = displayedDefault.toString();
        // Rotate pointer to default position
        this.pointer.style.transform = `rotate(${percentage * 360 + this.offset}deg)`;
        // Fill circle segments accordingly
        this.setDashArray(percentage);
    }
    initListeners() {
        const isTouchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchCapable) {
            // Mobile devices
            const doubleTouch = (e) => {
                e.preventDefault();
                const now = new Date().getTime();
                const tapLength = now - this.lastTap;
                if (tapLength < 300 && tapLength > 0)
                    this.resetKnob();
                this.lastTap = now;
            };
            this.slider.addEventListener('touchstart', this.startRotation, { passive: false });
            document.addEventListener('touchmove', this.rotateKnob, { passive: false });
            document.addEventListener('touchend', () => this.isRotating = false);
            this.knob.addEventListener('touchstart', doubleTouch, { passive: false });
        }
        else {
            // Desktop devices
            this.slider.addEventListener('mousedown', this.startRotation);
            document.addEventListener('mousemove', this.rotateKnob);
            document.addEventListener('mouseup', () => this.isRotating = false);
            this.knob.addEventListener('dblclick', () => this.resetKnob());
        }
    }
};
__decorate([
    decorator.CatchErrors,
    decorator.MeasureExecutionTime
    // >>> METHOD Support <<<
    /**
        * Updates all circle segments’ stroke lengths according to `percentage` (0..1).
        * Also rotates the pointer handle, updates the visible rounded value, and writes the exact decimal value.
    */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], KnobSlider.prototype, "setDashArray", null);
__decorate([
    decorator.CatchErrors,
    decorator.MeasureExecutionTime
    // >>> METHOD Support <<<
    /**
        * When the pointer enters the “forbidden zone,” snap to either min or max:
        * - `dashLength` = 0 (for min) or this.dash (for max)
        * - `value` = either 0 or this.maxValue
        * - `angle` = the boundary angle (0 or 360 - 2*offset), so the pointer visually snaps
    */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], KnobSlider.prototype, "outOfBoundaries", null);
__decorate([
    decorator.CatchErrors,
    decorator.MeasureExecutionTime
    // >>> METHOD MAIN <<<
    /**
        * Resets the slider to its default initial state:
        * - totalValue = 0 (no full revolutions counted)
        * - angle = percentage * 360  (so that next delta comparison is correct)
        * - isRotating = false
        * - pointer rotated to (percentage * 360 + offset)
        * - all segments filled up to that percentage
        * - displayed and exact values updated to defaultValue
    */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], KnobSlider.prototype, "resetKnob", null);
__decorate([
    decorator.CatchErrors,
    decorator.MeasureExecutionTime
    // >>> METHOD INIT Once <<<
    /**
        * Attaches event listeners for touch or mouse interactions:
        * - For touch devices:
        *     • Single touchstart on knob: cache center coords, set isRotating = true
        *     • If two taps occur within 300ms, call resetKnob() (double‐tap detection)
        *     • touchmove (non-passive) on document: call rotateKnob() and e.preventDefault() to avoid scrolling
        *     • touchend on document: set isRotating = false
        * - For non-touch (desktop mouse):
        *     • mousedown on knob: cache center coords, set isRotating = true
        *     • mousemove on document: call rotateKnob()
        *     • mouseup on document: set isRotating = false
        *     • dblclick on knob: call resetKnob()
    */
    ,
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
