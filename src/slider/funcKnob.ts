import * as decorator from '../decorator.js'

@decorator.LogClassCreation
@decorator.MeasureConstructionTime
export class KnobSlider {
    /*
        KnobSlider class handles the functionality of a circular slider with a knob.
        It allows users to rotate the knob to set a value, which is displayed as both a rounded number and an exact decimal value.
        The slider supports both touch and mouse events for interaction.
        The circle's stroke is updated based on the rotation angle, and the pointer rotates accordingly.
        The slider is designed to be responsive and works on both mobile and desktop devices.
        The slider's maximum value can be set during initialization.
        

            Functionality:
        The slider's rotation is calculated based on the mouse/touch position relative to the center of the knob.
        The slider's values are updated in real-time as the knob is rotated.
        The slider's functionality is encapsulated in the KnobSlider class, which can be instantiated with a root element and a maximum value.
        The slider's event listeners are initialized to handle touch and mouse events for rotation and reset actions.
        The slider's initial state is reset when the knob is double-tapped or double-clicked.

            Constant Atributes:
        Global Radius : 2rPi = 2 * 135 * 3.14 = 848 | Used for calculating FULL Dash length
        Private Dash : Radius / circles (amount of circle separations) | Used for calculation dash length


            Usage:
        The slider's are used for setting values of Brightness, Contrast, Saturation, Hue-Rotate, Invert, Sepia, and Grayscale.

            Example usage:
        const sliderElement = document.querySelector('.slider') as HTMLElement;
        const knobSlider = new KnobSlider(sliderElement, 200);
    */
    private readonly radius:number
    private readonly dash: number
    private readonly empty: number
    private readonly percentage: number
    
    private slider: HTMLElement
    private knob: HTMLElement
    private rotator: HTMLElement
    private pointer: HTMLElement
    private value: HTMLElement
    private circles: SVGCircleElement[] = []
    private exactValue: HTMLInputElement

    private isRotating = false
    private lastTap = 0

    private readonly maxValue: number
    private readonly defaultValue: number
    private readonly infinite: boolean
    private totalValue: number = 0

    constructor(root: HTMLElement, defaultValue:number, maxValue: number, radius:number, infinite:boolean) {
        /*
            Initialize the KnobSlider with a root element, default value, and maximum value.
            Set up the necessary elements and event listeners for interaction.
        */
        this.slider = root
        this.knob = root.querySelector('.knob')! as HTMLElement
        this.rotator = root.querySelector('.rotator')! as HTMLElement
        this.pointer = root.querySelector('.pointer-frame')! as HTMLElement
        this.value = root.querySelector('.value')! as HTMLElement
        this.circles = Array.from(root.querySelectorAll('circle')).slice(1) as SVGCircleElement[]
        this.exactValue = root.querySelector('.exact-value')! as HTMLInputElement

        const circlesCount = this.circles.length
        this.radius = Math.PI * 260 * (radius/360)
        for (const [i,circle] of this.circles.entries()) {
            circle.style.transform = `rotate(${Math.round(i * 360 / circlesCount)}deg)`
            circle.style.strokeDasharray = `0 ${this.radius}`
        }

        this.percentage = 1 / this.circles.length
        this.dash = this.radius * this.percentage
        this.empty = this.radius - this.dash

        this.defaultValue = defaultValue
        this.maxValue = maxValue
        this.infinite = infinite

        this.initListeners()
        this.resetKnob()
    }

    @decorator.CatchErrors
    @decorator.MeasureExecutionTime
    private setDashArray(percentage:number, index:number) {
        for (const [i, circle] of this.circles.entries()) {                 
            if (i === index) {
                const full = this.radius * ( percentage - this.percentage * i )
                circle.style.strokeDasharray = `${full} ${this.radius-full}`
            } else if (i < index) {
                circle.style.strokeDasharray = `${this.dash} ${this.empty}`
            } else {
                circle.style.strokeDasharray = `0 ${this.radius}`
            }
        }
    }

    @decorator.CatchErrors
    @decorator.Throttle(1000)
    @decorator.MeasureExecutionTime
    private resetKnob(): void {
        /*
            Reset the Pointer, the Colored Circle, the Value, the Exact Value of that Slider to their initial state
        */
        this.isRotating = false
        this.value.innerHTML = `${this.defaultValue}`
        this.exactValue.value  = this.defaultValue.toString()
        this.setDashArray(0, 0)
    }

    private rotateKnob = (e: MouseEvent | TouchEvent): void => {
        /*
            Prevent default behavior for touchmove to avoid scrolling
            Calculate the angle based on the mouse/touch position relative to the center of the knob
            and update the Pointer, the Colored Circle, the Value, the Exact Value of that Slider accordingly
        */
        if (e.type === 'touchmove') e.preventDefault()
        if (!this.isRotating) return

        // Calculate the center of the knob
        const rect = this.knob.getBoundingClientRect()
        const centerX = rect.left + this.knob.clientWidth / 2
        const centerY = rect.top + this.knob.clientHeight / 2

        // Determine the position of the mouse or touch
        let clientX: number, clientY: number
        if (e instanceof TouchEvent && e.touches.length > 0) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else if (e instanceof MouseEvent) {
            clientX = e.clientX
            clientY = e.clientY
        } else return

        // Calculate the angle based on the position relative to the center
        const deltaX = clientX - centerX
        const deltaY = clientY - centerY
        const angleRad = Math.atan2(deltaY, deltaX)
        const angleDeg = (angleRad * 180) / Math.PI
        const rotationAngle = (angleDeg - 90 + 360) % 360
        const progressPercent = rotationAngle / 360
        console.log(rotationAngle, progressPercent)


        const index = Math.floor(progressPercent*4)
        this.setDashArray(progressPercent, index)
        this.pointer.style.transform = `rotate(${rotationAngle}deg)`
        this.value.innerHTML = `${Math.round(progressPercent * this.maxValue)}`
        this.exactValue.value = (progressPercent * this.maxValue).toString()
        /*
            Main logic for updating the slider based on the rotation angle
            Calculate the progress percentage and update the circle, pointer, value, and exact value
        */
        // Reset to initial state if the angle is outside the range on the LEFT side
        // Set to maximum value if the angle is outside the range on the RIGHT side
    }

    @decorator.CatchErrors
    @decorator.MeasureExecutionTime
    private initListeners(): void {
        /*
            Initialize event listeners for touch and mouse events to handle rotation and reset actions
        */
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            // Mobile devices
            const doubleTouch = (e:  TouchEvent): void => {
                e.preventDefault()
                const now = new Date().getTime()
                const tapLength = now - this.lastTap
                if (tapLength < 300 && tapLength > 0) this.resetKnob()
                this.lastTap = now
            }
            this.slider.addEventListener('touchstart', () => this.isRotating = true)
            document.addEventListener('touchmove', this.rotateKnob, { passive: false })
            document.addEventListener('touchend', () => this.isRotating = false)
            this.rotator.addEventListener('touchstart', doubleTouch, { passive: false })
        } else {
            // Desktop devices
            this.slider.addEventListener('mousedown', () => this.isRotating = true)
            document.addEventListener('mousemove', this.rotateKnob)
            document.addEventListener('mouseup', () => this.isRotating = false)
            this.rotator.addEventListener('dblclick', () => this.resetKnob())
        }
    }
}