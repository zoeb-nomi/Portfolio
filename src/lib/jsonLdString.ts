// JSON for an inline <script type="application/ld+json">. "<" is escaped so a stray "</script>"
// inside a string can never close the tag early; the parsed JSON is identical.
export const jsonLdString = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');
