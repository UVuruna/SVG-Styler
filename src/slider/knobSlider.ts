class KnobSlider {
    /*
        KnobSlider class handles the functionality of a circular slider with a knob.
        It allows users to rotate the knob to set a value, which is displayed as both a rounded number and an exact decimal value.
        The slider can be reset by double-tapping on mobile or double-clicking on desktop.
        The slider supports both touch and mouse events for interaction.
        The circle's stroke is updated based on the rotation angle, and the pointer rotates accordingly.
        The slider is designed to be responsive and works on both mobile and desktop devices.
        The slider's maximum value can be set during initialization.
        The slider's initial state is reset when the knob is double-tapped or double-clicked.

        The slider's rotation is calculated based on the mouse/touch position relative to the center of the knob.
        The slider's values are updated in real-time as the knob is rotated.
        The slider's appearance is defined in the associated CSS file.
        The slider's functionality is encapsulated in the KnobSlider class, which can be instantiated with a root element and a maximum value.
        The slider's event listeners are initialized to handle touch and mouse events for rotation and reset actions.

        The slider's are used for setting values of Brightness, Contrast, Saturation, Hue Angle, Invert, Sepia, and Grayscale.
        The slider's design is inspired by the circular sliders found in popular image editing applications.

        Example usage:
        const sliderElement = document.querySelector('.slider') as HTMLElement;
        const knobSlider = new KnobSlider(sliderElement, 200);
    */
    private isRotating = false
    private slider: HTMLElement
    private knob: HTMLElement
    private circle: SVGCircleElement
    private rotator: HTMLElement
    private pointer: HTMLElement
    private value: HTMLElement
    private exactValue: HTMLElement
    private lastTap = 0
    private maxValue: number

    constructor(root: HTMLElement, maxValue: number) {
        this.slider = root
        this.knob = root.querySelector('.knob')!
        this.circle = root.querySelector('.circle')!
        this.rotator = root.querySelector('.rotator')!
        this.pointer = root.querySelector('.rotator-fake')!
        this.value = root.querySelector('.value')!
        this.exactValue = root.querySelector('.exact-value')!
        this.maxValue = maxValue

        this.initListeners()
    }

    private resetKnob(): void {
        /*
            Reset the Pointer, the Colored Circle, the Value, the Exact Value of that Slider to their initial state
        */
        this.isRotating = false
        this.pointer.style.transform = 'rotate(0deg)'
        this.circle.style.strokeDashoffset = '510'
        this.value.innerHTML = '100'
        this.exactValue.innerHTML = '100'
    }

    private rotateKnob = (e: MouseEvent | TouchEvent): void => {
        /*
            Prevent default behavior for touchmove to avoid scrolling
            Calculate the angle based on the mouse/touch position relative to the center of the knob
            and update the Pointer, the Colored Circle, the Value, the Exact Value of that Slider accordingly
        */
        if (e.type === 'touchmove') e.preventDefault()
        if (!this.isRotating) return

        const rect = this.knob.getBoundingClientRect()
        const centerX = rect.left + this.knob.clientWidth / 2
        const centerY = rect.top + this.knob.clientHeight / 2

        let clientX: number, clientY: number
        if (e instanceof TouchEvent && e.touches.length > 0) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else if (e instanceof MouseEvent) {
            clientX = e.clientX
            clientY = e.clientY
        } else return

        const deltaX = clientX - centerX
        const deltaY = clientY - centerY
        const angleRad = Math.atan2(deltaY, deltaX)
        const angleDeg = (angleRad * 180) / Math.PI
        const rotationAngle = (angleDeg - 135 + 360) % 360

        if (rotationAngle <= 270) {
            // Calculate the progress percentage and update the circle, pointer, value, and exact value
            const progressPercent = rotationAngle / 270
            this.pointer.style.transform = `rotate(${rotationAngle - 135}deg)`
            this.circle.style.strokeDashoffset = `${817 - 613 * progressPercent}`
            this.value.innerHTML = `${Math.round(progressPercent * this.maxValue)}`
            this.exactValue.innerHTML = `${progressPercent * this.maxValue}`
        } else if (rotationAngle > 353) {
            // Reset to initial state if the angle is outside the range on the left side
            this.circle.style.strokeDashoffset = '817'
            this.value.innerHTML = '0'
            this.exactValue.innerHTML = '0'
            this.pointer.style.transform = `rotate(-135deg)`
        } else if (rotationAngle > 270 && rotationAngle < 277) {
            // Set to maximum value if the angle is outside the range on the right side
            this.circle.style.strokeDashoffset = '204'
            this.value.innerHTML = `${this.maxValue}`
            this.exactValue.innerHTML = `${this.maxValue}`
            this.pointer.style.transform = `rotate(135deg)`
        }
    }

    private initListeners(): void {
        /*
            Initialize event listeners for touch and mouse events to handle rotation and reset actions
        */
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            // Mobile devices
            this.slider.addEventListener('touchstart', () => this.isRotating = true)
            document.addEventListener('touchmove', this.rotateKnob)
            document.addEventListener('touchend', () => this.isRotating = false)

            this.rotator.addEventListener('touchend', (e: TouchEvent) => {
                const now = new Date().getTime()
                const tapLength = now - this.lastTap
                if (tapLength < 300 && tapLength > 0) this.resetKnob()
                this.lastTap = now
            })
        } else {
            // Desktop devices
            this.slider.addEventListener('mousedown', () => this.isRotating = true)
            document.addEventListener('mousemove', this.rotateKnob)
            document.addEventListener('mouseup', () => this.isRotating = false)
            this.rotator.addEventListener('dblclick', () => this.resetKnob())
        }
    }
}
