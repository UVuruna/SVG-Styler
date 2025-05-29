export function MeasureExecutionTime(target, propertyKey, descriptor) {
    /*
    This decorator measures the execution time of a method.
    It wraps the original method and logs the time taken to execute it.
    Usage:
    @MeasureExecutionTime
    methodName() {
        // method implementation
    }
    */
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const end = performance.now();
        console.log(`[${propertyKey}] executed in ${end - start} ms`);
        return result;
    };
    return descriptor;
}
export function LogMethodCall(target, propertyKey, descriptor) {
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
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Calling method ${propertyKey} with arguments:`, args);
        const result = originalMethod.apply(this, args);
        console.log(`Method ${propertyKey} returned:`, result);
        return result;
    };
    return descriptor;
}
export function LogClassCreation(constructor) {
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
    const originalConstructor = constructor;
    function newConstructor(...args) {
        console.log(`Creating instance of ${originalConstructor.name} with arguments:`, args);
        return new originalConstructor(...args);
    }
    newConstructor.prototype = originalConstructor.prototype;
    return newConstructor;
}
export function CatchErrors(target, propertyKey, descriptor) {
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
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        try {
            return originalMethod.apply(this, args);
        }
        catch (error) {
            console.error(`[${propertyKey}] threw an error:`, error);
            return null;
        }
    };
    return descriptor;
}
export function Readonly(target, propertyKey) {
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
    });
}
export function Throttle(delay) {
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
    let lastCall = 0;
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                return originalMethod.apply(this, args);
            }
        };
        return descriptor;
    };
}
