declare global {
    interface Window {
        totalTime: number;
    }
}
window.totalTime = 0;

// DECORATIONS FOR METHODS

export function MeasureExecutionTime(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    /*    
    This decorator measures the execution time of a method.
    It wraps the original method and logs the time taken to execute it.
    Usage:
    @MeasureExecutionTime
    methodName() {
        // method implementation
    }
    */
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
        const start = performance.now()
        const result = originalMethod.apply(this, args)
        const timeElapsed = performance.now() - start
        window.totalTime += timeElapsed

        console.log(`[${propertyKey}] executed in ${timeElapsed} ms`)
        return result
    }
    return descriptor
}

export function LogMethodCall(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    /*
        This decorator logs the method name and its arguments when called.
        It wraps the original method and logs the call details.
        It also logs the return value of the method.
        This is useful for debugging and tracing method calls.
        Usage:
        @LogMethodCall
        methodName(arg1, arg2) {
            // method implementation
        }
    */
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
        console.log(`Calling method ${propertyKey} with arguments:`, args)
        const result = originalMethod.apply(this, args)
        console.log(`Method ${propertyKey} returned:`, result)
        return result
    }
    return descriptor
}

export function Throttle(
    delay: number
) {
    /*
        This decorator throttles the execution of a method.
        It ensures that the method can only be called once every specified delay (in milliseconds).
        If the method is called again before the delay has passed, it will not execute.
        Usage:
        @Throttle(1000) // 1 second delay
        methodName() {
            // method implementation
        }
    */
    let lastCall = 0

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value
        
        descriptor.value = function (...args: any[]) {
            const now = Date.now()
            if (now - lastCall >= delay) {
                lastCall = now
                return originalMethod.apply(this, args)
            }
        }
        return descriptor
    }
}

// DECORATORS FOR CLASS CREATION

export function LogClassCreation<T extends new (...args: any[]) => {}>(constructor: T): T {
    /*
        This decorator logs the creation of a class instance.
        It wraps the constructor and logs the arguments used to create the instance.
        Usage:
        @LogClassCreation
        class MyClass {
            constructor(arg1, arg2) {
                // constructor implementation
            }
        }
    */
    return class extends constructor {
        constructor(...args: any[]) {
            console.log(`Creating instance of ${constructor.name} with arguments:`, args)
            super(...args)
        }
    }
}

export function MeasureConstructionTime<T extends { new(...args: any[]): {} }>(constructor: T) {
    /*
        This decorator measures the time taken to create an instance of a class.
        It wraps the constructor and logs the time taken to create the instance.
        Usage:
        @MeasureConstructionTime
        class MyClass {
            constructor(arg1, arg2) {
                // constructor implementation
            }
        }
    */
    return class extends constructor {
        constructor(...args: any[]) {
            const start = performance.now();
            super(...args);
            const timeElapsed = performance.now() - start
            window.totalTime += timeElapsed
            console.log(`[${constructor.name}] instance created in ${timeElapsed} ms`);
        }
    }
}

// DECORATORS FOR ERROR HANDLING

export function CatchErrors(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    /*
        This decorator catches errors thrown by a method.
        It wraps the original method and logs any errors that occur.
        If an error occurs, it returns null or a default value.
        Usage:
        @CatchErrors
        methodName() {
            // method implementation
        }
    */
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
        try {
            return originalMethod.apply(this, args)
        } catch (error) {
            console.error(`[${propertyKey}] threw an error:`, error)
            return null
        }
    }

    return descriptor
}

// DECORATORS FOR PROPERTY MODIFICATION

export function Readonly(
    target: any,
    propertyKey: string
) {
    /*
        This decorator makes a property read-only.
        It prevents the property from being modified after it is set.
        Usage:
        @Readonly
        propertyName: string;
    */
    Object.defineProperty(target, propertyKey, {
        writable: false,
        configurable: false,
    })
}