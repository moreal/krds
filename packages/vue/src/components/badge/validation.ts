export function validateBadgeConfiguration(options: {
    tone?: string;
    appearance?: string;
    size?: string;
}) {
    if (options.tone !== undefined && !['secondary', 'gray', 'point', 'danger', 'warning', 'success', 'information', 'disabled'].includes(options.tone))
        throw new TypeError('Unsupported badge tone');
    if (options.appearance !== undefined && !['outline', 'filled', 'pastel'].includes(options.appearance))
        throw new TypeError('Unsupported badge appearance');
    if (options.size !== undefined && !['small', 'medium', 'large'].includes(options.size))
        throw new TypeError('Unsupported badge size');
}
