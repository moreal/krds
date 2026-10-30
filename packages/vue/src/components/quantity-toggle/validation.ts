export function validateQuantityConfiguration(options: {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
}) {
    const min = options.min ?? 0, max = options.max ?? 10, step = options.step ?? 1, value = options.value ?? min;
    const levels = (max - min) / step;
    if (![min, max, step, value].every(Number.isFinite) || step <= 0 || !Number.isInteger(levels) || levels < 1 || levels > 10 || value < min || value > max || !Number.isInteger((value - min) / step))
        throw new RangeError('Quantity requires at most eleven consistent levels');
}
