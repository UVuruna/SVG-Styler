import * as decorator from '../decorator.js'

@decorator.LogClassCreation
@decorator.MeasureConstructionTime
export class KnobSlider {
    /*
        KnobSlider:
        - Creates a circular slider with a rotatable knob.
        - Supports both mouse (desktop) and touch (mobile) interactions.
        - Displays both an integer value and a precise (decimal) value as the knob rotates.
        - Optionally supports infinite rotation, allowing users to spin multiple full turns.
        - You can specify a maximum value per full revolution and an initial default value.

        Constructor parameters:
        root         – Root container having the required DOM structure (SVG, knob handle, value display).
        defaultValue – Initial value (in “model units” before conversion to UI display).
        maxValue     – Maximum numeric value represented by one full 360° turn.
        strokeDegree – Portion (in degrees) of the circle that is actually “fillable” (e.g., 270°). 
                        The remaining gap (360 - strokeDegree) is left empty on either side.
        infinite     – If true, every time the knob passes 360° → 0° (or 0° → 360°), 
                        the displayed value is incremented or decremented by maxValue.
    */
    
    private slider: HTMLElement
    private knob: HTMLElement
    private pointer: HTMLElement
    private value: HTMLElement
    private circles: SVGCircleElement[] = []
    private exactValue: HTMLInputElement
    private centerX: number = 0
    private centerY: number = 0

    // True while the user is actively dragging/rotating the knob
    private isRotating: boolean = false
    // Timestamp (ms) of the last ‘tap’ on mobile to detect double‐tap
    private lastTap: number = 0

    private readonly circleCount: number       // Number of colored segments
    private readonly offset: number            // Degrees of empty gap on each side (when strokeDegree < 360)
    private readonly circumference: number     // Full circumference of the circle (px)
    private readonly percentage: number        // 1 / circleCount (fraction per segment)
    private readonly dash: number              // Length of a fully‐filled segment (px)

    private readonly valueCoef: number         // strokeDegree / 360 (used for converting slider progress → numeric value)
    private readonly maxValue: number          // Max numeric value per full revolution
    private readonly defaultValue: number      // Initial value (in same units as maxValue)

    private readonly infinite: boolean         // If true, allow infinite revolutions
    private angle: number = 0                  // Last recorded pointer angle (0..360)
    private totalValue: number = 0             // Accumulated “full revolutions” if infinite mode is on
    
    

    constructor(root: HTMLElement, defaultValue:number, maxValue: number, strokeDegree:number, infinite:boolean) {
        /*
            Initializing KnobSlider:
            • root – the root element containing all parts (SVG, knob, value).
            • defaultValue – the initial value (in absolute units before conversion).
            • maxValue – the maximum value for one “round” (before conversion).
            • strokeDegree – the portion of the circle (in degrees) that is colored (e.g., 270°); the rest remains “empty.”
            • infinite – if true, enables infinite rotation (wrapping past 360° back to 0°).
        */

        // Capture DOM references
        this.slider = root
        this.knob = root.querySelector('.knob')! as HTMLElement
        this.pointer = root.querySelector('.pointer-frame')! as HTMLElement
        this.value = root.querySelector('.value')! as HTMLElement
        this.exactValue = root.querySelector('.exact-value')! as HTMLInputElement
        
        // Take all <circle> elements. The first is a background; the rest form the gradient segments.
        const allCircles = Array.from(root.querySelectorAll('circle')) as SVGCircleElement[]
        this.circles = allCircles.slice(1) as SVGCircleElement[]
        this.circleCount = this.circles.length as number

        // Calculate how many degrees remain unfillable on each side if strokeDegree < 360
        this.offset = Math.round((360 - strokeDegree) / 2) as number

        // Derive circumference from the SVG circle’s radius (fallback to 130px if not specified)
        const radius = parseFloat(allCircles[0].getAttribute('r')!) || 130
        this.circumference = Math.PI * 2 * radius as number

        // Each segment is the same fraction of the circle’s circumference
        this.percentage = 1 / this.circles.length as number

        // DASH is length of Coloring Circle Segment and we ADD 1 to those that are not full Circle because they don't have ROUND Linecap
        this.dash = this.circumference * this.percentage as number
        if (strokeDegree < 360) this.dash += 1

        // Coeficient for calculation VALUE on NOT FULL Circles
        this.valueCoef = strokeDegree / 360 as number
        this.defaultValue = defaultValue as number
        this.maxValue = maxValue as number
        this.infinite = infinite as boolean

        // Configure each SVG segment’s stroke and rotation
        for (const [i,circle] of allCircles.entries()) {
            if (strokeDegree < 360) {
                // If not a full circle, hide the last circle (it’s just a placeholder) and unset round linecap
                if (i===allCircles.length-1) {
                    circle.style.display = 'none'
                    continue
                } else {circle.style.strokeLinecap = 'unset'}
            }
            // Each segment has the same stroke length (circumference * strokeDegree/360)
            circle.style.strokeDasharray = `${this.circumference * strokeDegree / 360}`
            // Rotate the segment so that fillable portions line up correctly
            circle.style.transform = `rotate(${this.offset + Math.round(((i>0)? i-1 : i) * 360 / this.circleCount)}deg)`
        }

        // SETTING Listeners and Starting Position of KNOB SLIDERS
        this.initListeners()
        this.resetKnob()
    }

    // >>> METHOD MAIN <<<
    /**
         * Called once when the user presses down (touchstart/mousedown).
         * Caches the knob’s center coordinates, then marks isRotating = true so future moves apply rotation.
    */
    private startRotation  = (e: MouseEvent | TouchEvent) => {
        
        const rect = this.knob.getBoundingClientRect()
        this.centerX = rect.left + this.knob.clientWidth / 2
        this.centerY = rect.top + this.knob.clientHeight / 2
        this.isRotating = true
    }

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
    private rotateKnob = (e: MouseEvent | TouchEvent): void => {

        if (e.type === 'touchmove') e.preventDefault()
        if (!this.isRotating) return

        // 1) Determine pointer coordinates
        let clientX: number, clientY: number
        if (e instanceof TouchEvent && e.touches.length > 0) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else if (e instanceof MouseEvent) {
            clientX = e.clientX
            clientY = e.clientY
        } else return

        // 2) Compute raw angle (−180..180), then convert to [0..360)
        const deltaX = clientX - this.centerX
        const deltaY = clientY - this.centerY
        const angleRad = Math.atan2(deltaY, deltaX)
        const angleDeg = (angleRad * 180) / Math.PI
        const rotationAngle = (angleDeg - (90 + this.offset) + 360) % 360
        const progressPercent = rotationAngle / 360

        // 3) Infinite mode: detect crossing 0/360 boundary
        if (this.infinite) {
            const delta = rotationAngle - this.angle
            // If pointer jumped backward over 0° (e.g., 1° → 359°), rawDelta > +180
            if (delta > 180) {

                if (this.totalValue) this.totalValue -= this.maxValue
                // Snap to absolute minimum if they tried to go negative
                else {this.outOfBoundaries(0, 0, 0) ; return}

            // If pointer jumped forward over 360° (e.g., 359° → 1°), rawDelta < -180
            } else if (delta < -180) this.totalValue += this.maxValue
        }

        // 4) Store new angle for next move comparison
        this.angle = rotationAngle

        // 5) If slider is not a full circle (offset > 0) and pointer is in the “gap,” clamp
        if (this.offset && rotationAngle > 360 - 2 * this.offset) {

            // Left gap: snap to minimum
            if (rotationAngle > 360 - this.offset) this.outOfBoundaries(0, 0, 0)
            // Right gap: snap to maximum
            else this.outOfBoundaries(this.dash, this.maxValue, 360-2*this.offset)

        // 6) Normal case: fill segments and rotate pointer
        } else this.setDashArray(progressPercent)
    }

    @decorator.CatchErrors
    @decorator.MeasureExecutionTime
    // >>> METHOD Support <<<
    /**
        * Updates all circle segments’ stroke lengths according to `percentage` (0..1).
        * Also rotates the pointer handle, updates the visible rounded value, and writes the exact decimal value.
    */
    private setDashArray(percentage:number) {

        const index = Math.floor(percentage * this.circleCount)
        const emptyStroke = this.circumference / this.valueCoef
        
        for (const [i, circle] of this.circles.entries()) {
            // Partially filled segment                 
            if (i === index) {
                const full = this.circumference * ( percentage - this.percentage * i )
                circle.style.strokeDasharray = `${full} ${emptyStroke}`
            }
            // Fully filled segment
            else if (i < index) circle.style.strokeDasharray = `${this.dash} ${emptyStroke}`

            // Not filled
            else circle.style.strokeDasharray = `0 ${emptyStroke}`
        }
        // Rotate pointer handle to (percentage * 360 + offset)
        this.pointer.style.transform = `rotate(${percentage * 360 + this.offset}deg)`
        // Compute displayed numeric value
        const computedValue = this.totalValue + (percentage * this.maxValue) / this.valueCoef
        this.value.innerHTML = computedValue.toFixed(0)
        this.exactValue.value = computedValue.toString()
    }

    @decorator.CatchErrors
    @decorator.MeasureExecutionTime
    // >>> METHOD Support <<<
    /**
        * When the pointer enters the “forbidden zone,” snap to either min or max:
        * - `dashLength` = 0 (for min) or this.dash (for max)
        * - `value` = either 0 or this.maxValue
        * - `angle` = the boundary angle (0 or 360 - 2*offset), so the pointer visually snaps
    */
    private outOfBoundaries(dash: number, value: number, angle:number) {

        const emptyStroke = this.circumference / this.valueCoef

        for (const [i, circle] of this.circles.entries()) {                 
            circle.style.strokeDasharray = `${dash} ${emptyStroke}`
        }
        this.value.innerHTML = value.toString()
        this.exactValue.value = value.toString()
        this.pointer.style.transform = `rotate(${angle + this.offset}deg)`
    }

    @decorator.CatchErrors
    @decorator.MeasureExecutionTime
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
    private resetKnob(): void {

        const percentage = this.defaultValue / this.maxValue

        this.angle = (360 - this.offset * 2) * this.defaultValue / this.maxValue
        this.totalValue = 0
        this.isRotating = false
        
        // Update numeric displays
        const displayedDefault = this.defaultValue / this.valueCoef
        this.value.innerHTML = displayedDefault.toFixed(0)
        this.exactValue.value  = displayedDefault.toString()

        // Rotate pointer to default position
        this.pointer.style.transform = `rotate(${percentage * 360 + this.offset}deg)`

        // Fill circle segments accordingly
        this.setDashArray(percentage)
    }

    @decorator.CatchErrors
    @decorator.MeasureExecutionTime
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
    private initListeners(): void {
        const isTouchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0

        if (isTouchCapable) {

            // Mobile devices
            const doubleTouch = (e:  TouchEvent): void => {
                e.preventDefault()
                const now = new Date().getTime()
                const tapLength = now - this.lastTap
                if (tapLength < 300 && tapLength > 0) this.resetKnob()
                this.lastTap = now
            }
            this.slider.addEventListener('touchstart', this.startRotation, { passive: false })
            document.addEventListener('touchmove', this.rotateKnob, { passive: false })
            document.addEventListener('touchend', () => this.isRotating = false)
            this.knob.addEventListener('touchstart', doubleTouch, { passive: false })
        } else {

            // Desktop devices
            this.slider.addEventListener('mousedown', this.startRotation)
            document.addEventListener('mousemove', this.rotateKnob)
            document.addEventListener('mouseup', () => this.isRotating = false)
            this.knob.addEventListener('dblclick', () => this.resetKnob())
        }
    }
}