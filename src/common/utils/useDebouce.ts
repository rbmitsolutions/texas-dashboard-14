import { useRef } from "react";

export const useDebounce = (fn: any, delay: number) => {
    const timeoutRef = useRef(null);
    function debouncedFn(...args: any) {
        window.clearTimeout(timeoutRef.current as any);
        timeoutRef.current = window.setTimeout(() => {
            fn(...args);
        }, delay) as any;
    }

    return debouncedFn;
}
