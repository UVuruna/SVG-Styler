import * as decorator from '../decorator.js'

@decorator.LogClassCreation
@decorator.MeasureConstructionTime
export class FilterToRGB {
    /*
        FilterToRGB:
        - Applies a chain of visual filter transformations to an RGB color.
        - Emulates the behavior of CSS filters (brightness, contrast, hue-rotate, etc.).
        - Can operate differently based on whether the input color is grayscale (R=G=B).
        - Filters can be set statically via setFilters().

        Constructor parameters:
        RGB – Initial color value as an object { r, g, b } (0–255 range).
    */

    public static brightness: number = 1    // 0 - inf (% / 100)
    public static contrast: number = 1      // 0 - inf (% / 100)
    public static saturate: number = 1      // 0 - inf (% / 100)
    public static hue_rotate: number = 0    // 0 - 360 (degrees)
    public static invert: number = 0        // 0 - 1   (% / 100)
    public static sepia: number = 0         // 0 - 1   (% / 100)
    public static grayscale: number = 0     // 0 - 1   (% / 100)

    private RGB: Record<'r' | 'g' | 'b', number>

    constructor(RGB: Record<'r' | 'g' | 'b', number>) {
        this.RGB = { ...RGB }
        this.applyFilters()
    }

    /**
    * Sets global filter values for subsequent color transformations.
    */
    public static setFilters(filters: Partial<Record<'brightness' | 'contrast' | 'saturate' | 'hue-rotate' | 'invert' | 'grayscale' | 'sepia', number>>) {
        for (const [key, value] of Object.entries(filters)) {
            switch (key) {
                case 'brightness': FilterToRGB.brightness = value!; break;
                case 'contrast': FilterToRGB.contrast = value!; break;
                case 'saturate': FilterToRGB.saturate = value!; break;
                case 'hue-rotate': FilterToRGB.hue_rotate = value!; break;
                case 'invert': FilterToRGB.invert = value!; break;
                case 'grayscale': FilterToRGB.grayscale = value!; break;
                case 'sepia': FilterToRGB.sepia = value!; break;
            }
        }
    }

    /** Clamps a number to the [0, 255] range. */
    private clamp(value: number): number {
        return Math.min(255, Math.max(0, Math.round(value)))
    }

    /** Returns the current RGB values after applying all filters. */
    public getRGB(): Record<'r' | 'g' | 'b', number> {
        return {
            r: this.clamp(this.RGB.r),
            g: this.clamp(this.RGB.g),
            b: this.clamp(this.RGB.b)
        }
    }

    /** Converts RGB to HSL using standard algorithm */
    private toHSL(): [number, number, number] {
        let r = this.RGB.r / 255, g = this.RGB.g / 255, b = this.RGB.b / 255
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h = 0, s = 0, l = (max + min) / 2

        if (max !== min) {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break
                case g: h = (b - r) / d + 2; break
                case b: h = (r - g) / d + 4; break
            }
            h *= 60
        }

        return [h, s, l]
    }

    /** Converts HSL back to RGB */
    private fromHSL(h: number, s: number, l: number): void {
        let r: number, g: number, b: number

        if (s === 0) r = g = b = l
        else {
            const hue2rgb = (p: number, q: number, t: number): number => {
                if (t < 0) t += 1
                if (t > 1) t -= 1
                if (t < 1 / 6) return p + (q - p) * 6 * t
                if (t < 1 / 2) return q
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
                return p
            }
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q
            const hk = h / 360
            r = hue2rgb(p, q, hk + 1 / 3)
            g = hue2rgb(p, q, hk)
            b = hue2rgb(p, q, hk - 1 / 3)
        }

        this.RGB.r = r * 255
        this.RGB.g = g * 255
        this.RGB.b = b * 255
    }

    /** Brightens or darkens RGB channels by multiplier */
    private applyBrightness() {
        this.RGB.r *= FilterToRGB.brightness
        this.RGB.g *= FilterToRGB.brightness
        this.RGB.b *= FilterToRGB.brightness
    }

    /** Shifts RGB values around midpoint (128) to change contrast */
    private applyContrast() {
        this.RGB.r = (this.RGB.r - 128) * FilterToRGB.contrast + 128
        this.RGB.g = (this.RGB.g - 128) * FilterToRGB.contrast + 128
        this.RGB.b = (this.RGB.b - 128) * FilterToRGB.contrast + 128
    }

    /** Converts to grayscale by luminance and mixes with original color */
    private applyGrayscale() {
        const gray = 0.2126 * this.RGB.r + 0.7152 * this.RGB.g + 0.0722 * this.RGB.b
        this.RGB.r = this.RGB.r * (1 - FilterToRGB.grayscale) + gray * FilterToRGB.grayscale
        this.RGB.g = this.RGB.g * (1 - FilterToRGB.grayscale) + gray * FilterToRGB.grayscale
        this.RGB.b = this.RGB.b * (1 - FilterToRGB.grayscale) + gray * FilterToRGB.grayscale
    }

    /** Inverts color channels (negative image effect) */
    private applyInvert() {
        this.RGB.r = this.RGB.r * (1 - FilterToRGB.invert) + (255 - this.RGB.r) * FilterToRGB.invert
        this.RGB.g = this.RGB.g * (1 - FilterToRGB.invert) + (255 - this.RGB.g) * FilterToRGB.invert
        this.RGB.b = this.RGB.b * (1 - FilterToRGB.invert) + (255 - this.RGB.b) * FilterToRGB.invert
    }

    /** Applies sepia tone by transforming RGB toward warm brownish tint */
    private applySepia() {
        const r = this.RGB.r, g = this.RGB.g, b = this.RGB.b
        const sr = 0.393 * r + 0.769 * g + 0.189 * b
        const sg = 0.349 * r + 0.686 * g + 0.168 * b
        const sb = 0.272 * r + 0.534 * g + 0.131 * b
        this.RGB.r = r * (1 - FilterToRGB.sepia) + sr * FilterToRGB.sepia
        this.RGB.g = g * (1 - FilterToRGB.sepia) + sg * FilterToRGB.sepia
        this.RGB.b = b * (1 - FilterToRGB.sepia) + sb * FilterToRGB.sepia
    }

    /** Amplifies or reduces saturation using HSL */
    private applySaturate() {
        let [h, s, l] = this.toHSL()
        s *= FilterToRGB.saturate
        this.fromHSL(h, s, l)
    }

    /** Rotates hue angle (0–360°) within HSL color space */
    private applyHueRotate() {
        let [h, s, l] = this.toHSL()
        h = (h + FilterToRGB.hue_rotate) % 360
        this.fromHSL(h, s, l)
    }

    @decorator.CatchErrors
    @decorator.MeasureExecutionTime
    /**
    * Applies all filters in CSS-compliant order.
    * • If the input is grayscale (R=G=B), apply filters with sepia first for better chromatic effect.
    * • Otherwise, apply the standard filter chain order.
    */
    public applyFilters() {
        const isGray = new Set(Object.values(this.RGB)).size === 1
        if (isGray) {
            this.applyInvert()
            this.applySepia()
            this.applyBrightness()
            this.applyContrast()
            this.applySaturate()
            this.applyHueRotate()
            this.applyGrayscale()
        } else {
            this.applyBrightness()
            this.applyContrast()
            this.applySaturate()
            this.applyHueRotate()
            this.applyInvert()
            this.applySepia()
            this.applyGrayscale()
        }
    }
}