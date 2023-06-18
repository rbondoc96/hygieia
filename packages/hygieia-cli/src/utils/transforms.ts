type UserAgent = {
    name: string;
    version: string;
};

/**
 * Removes any forward-slashes from the end of a string.
 */
export function formatTargetDir(targetDir: string | undefined): string | undefined {
    return targetDir?.trim().replace(/\/+$/g, '');
}

export function isValidNPMPackageName(name: string): boolean {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(name);
}

/**
 * Parses a user agent string into a `UserAgent` object.
 *
 * User agent strings are expected to be one of these formats:
 * - `${string}/${string} ${string}`
 * - `${string}/${string}`
 *
 * Examples of user agent strings are:
 * - Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X)
 * - AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346
 * - Safari/602.1
 *
 * @param {string} userAgent The user agent string to parse.
 * @returns {UserAgent | undefined} The parsed user agent object or `undefined` if parsing fails.
 */
export function packageFromUserAgent(userAgent: string | undefined): UserAgent | undefined {
    if (userAgent === undefined) {
        return undefined;
    }

    const packageSpec = userAgent.split(' ')[0];
    if (packageSpec === undefined) {
        return undefined;
    }

    const packageSpecTokens = packageSpec.split('/');

    if (packageSpecTokens.length !== 2) {
        return undefined;
    }

    return {
        name: packageSpecTokens[0] as string,
        version: packageSpecTokens[1] as string,
    };
}

export function toValidNPMPackageName(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/^[._]/, '')
        .replace(/[^a-z\d-~]+/g, '-');
}
