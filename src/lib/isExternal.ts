/** True for an absolute http(s) URL: the links that open in a new tab with rel="noopener noreferrer". */
export const isExternal = (href: string): boolean => /^https?:\/\//.test(href);
