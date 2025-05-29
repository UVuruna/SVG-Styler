const slider = document.getElementById('slider') as HTMLElement
const rotator = document.querySelector('.rotator') as HTMLElement
const circle = document.getElementById('circle') as HTMLElement
const knob = document.querySelector('.knob') as HTMLElement
const pointer = document.querySelector('.rotator-fake') as HTMLElement
const value = document.querySelector('.value') as HTMLElement
const exactValue = document.querySelector('.exact-value') as HTMLElement


let isRotating: boolean = false

function resetKnob(_e?: MouseEvent | TouchEvent): void {
    /*
        Reset the Pointer, the Colored Circle, the Value, the Exact Value of that Slider to their initial state
    */
    isRotating = false
    pointer.style.transform = 'rotate(0deg)'
    circle.style.strokeDashoffset = '510'
    value.innerHTML = '100'
    exactValue.innerHTML = '100'
}

function rotateKnob(e: MouseEvent | TouchEvent): void {
    /*
        Prevent default behavior for touchmove to avoid scrolling
    */
    if (e.type === 'touchmove') e.preventDefault()

    if (isRotating) {
        /*
            Calculate the angle based on the mouse/touch position relative to the center of the knob 
            and update the Pointer, the Colored Circle, the Value, the Exact Value of that Slider accordingly
        */

        if (!knob || !pointer || !circle || !value || !exactValue) return
        const knobRect = knob.getBoundingClientRect()
        const knobX = knobRect.left + knob.clientWidth / 2
        const knobY = knobRect.top + knob.clientHeight / 2

        let clientX: number, clientY: number

        if (e instanceof TouchEvent && e.touches.length > 0) {
            clientX = e.touches[0].clientX 
            clientY = e.touches[0].clientY
        } else if (e instanceof MouseEvent) {
            clientX = e.clientX
            clientY = e.clientY
        } else {
            return
        }

        const deltaX = clientX - knobX
        const deltaY = clientY - knobY

        const angleRad = Math.atan2(deltaY, deltaX)
        const angleDeg = (angleRad * 180) / Math.PI

        const rotationAngle = (angleDeg - 135 + 360) % 360

        if (rotationAngle <= 270) {
            // Update the pointer rotation, circle stroke offset, and values based on the rotation angle
            const progressPercent = rotationAngle / 270

            pointer.style.transform = `rotate(${rotationAngle - 135}deg)`
            circle.style.strokeDashoffset = `${817 - 613 * progressPercent}`
            value.innerHTML = `${Math.round(progressPercent * 200)}`
            exactValue.innerHTML = `${progressPercent * 200}`

        } else if (rotationAngle <= 360 && rotationAngle > 353) {
            // Reset to 0 when the knob is rotated back to the starting position
            circle.style.strokeDashoffset = '817'
            value.innerHTML = '0'
            exactValue.innerHTML = '0'
            pointer.style.transform = `rotate(-135deg)`

        } else if (rotationAngle < 277 && rotationAngle > 270) {
            // Reset to maximum Value when the knob is rotated back to the end position
            circle.style.strokeDashoffset = '204'
            value.innerHTML = '200'
            exactValue.innerHTML = '200'
            pointer.style.transform = `rotate(135deg)`
        }
    }
}

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    // Mobile devices
    let lastTap = 0

    const doubleTap = (e: TouchEvent): void => {
        const now = new Date().getTime()
        const tapLength = now - lastTap

        if (tapLength < 300 && tapLength > 0) resetKnob()
        lastTap = now
    }

    slider.addEventListener('touchstart', () => (isRotating = true))
    document.addEventListener('touchmove', rotateKnob)
    document.addEventListener('touchend', () => (isRotating = false))
    rotator.addEventListener('touchend', doubleTap)
} else {
    // Desktop devices
    slider.addEventListener('mousedown', () => (isRotating = true))
    document.addEventListener('mousemove', rotateKnob)
    document.addEventListener('mouseup', () => (isRotating = false))
    rotator.addEventListener('dblclick', () => resetKnob())
}
