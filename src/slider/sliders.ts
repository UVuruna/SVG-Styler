class KnobSlider {
    private isRotating = false
    private slider: HTMLElement
    private rotator: HTMLElement
    private circle: HTMLElement
    private knob: HTMLElement
    private pointer: HTMLElement
    private value: HTMLElement
    private exactValue: HTMLElement
    private lastTap = 0

    constructor(root: HTMLElement) {
        this.slider = root.querySelector('.slider')!
        this.rotator = root.querySelector('.rotator')!
        this.circle = root.querySelector('.circle')!
        this.knob = root.querySelector('.knob')!
        this.pointer = root.querySelector('.rotator-fake')!
        this.value = root.querySelector('.value')!
        this.exactValue = root.querySelector('.exact-value')!

        this.initListeners()
    }

    private resetKnob(): void {
        this.isRotating = false
        this.pointer.style.transform = 'rotate(0deg)'
        this.circle.style.strokeDashoffset = '510'
        this.value.innerHTML = '100'
        this.exactValue.innerHTML = '100'
    }

    private rotateKnob = (e: MouseEvent | TouchEvent): void => {
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
            const progressPercent = rotationAngle / 270
            this.pointer.style.transform = `rotate(${rotationAngle - 135}deg)`
            this.circle.style.strokeDashoffset = `${817 - 613 * progressPercent}`
            this.value.innerHTML = `${Math.round(progressPercent * 200)}`
            this.exactValue.innerHTML = `${progressPercent * 200}`
        } else if (rotationAngle > 353) {
            this.circle.style.strokeDashoffset = '817'
            this.value.innerHTML = '0'
            this.exactValue.innerHTML = '0'
            this.pointer.style.transform = `rotate(-135deg)`
        } else if (rotationAngle > 270 && rotationAngle < 277) {
            this.circle.style.strokeDashoffset = '204'
            this.value.innerHTML = '200'
            this.exactValue.innerHTML = '200'
            this.pointer.style.transform = `rotate(135deg)`
        }
    }

    private initListeners(): void {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
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
            this.slider.addEventListener('mousedown', () => this.isRotating = true)
            document.addEventListener('mousemove', this.rotateKnob)
            document.addEventListener('mouseup', () => this.isRotating = false)
            this.rotator.addEventListener('dblclick', () => this.resetKnob())
        }
    }
}
