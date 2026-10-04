// The BlogPosting JSON-LD every essay carries (it was copy-pasted into each page).
const ORIGIN = 'https://www.zoebnomi.com';

/** 126 -> "PT2M6S" (schema.org / ISO 8601 duration). */
export const isoDuration = (seconds: number): string => `PT${Math.floor(seconds / 60)}M${seconds % 60}S`;

interface Options {
  slug: string;
  headline: string;
  description: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  about: string;
  /** Narration, if the essay has one: path under the site root, length in seconds, optional captions path. */
  audio?: { src: string; duration: number; captions?: string };
}

export function articleJsonLd({ slug, headline, description, date, about, audio }: Options) {
  const url = `${ORIGIN}/writing/${slug}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    author: { '@type': 'Person', name: 'Zoeb Nomi', url: ORIGIN },
    url,
    mainEntityOfPage: url,
    datePublished: date,
    dateModified: date,
    about,
    isPartOf: { '@type': 'WebSite', name: 'Zoeb Nomi', url: ORIGIN },
    ...(audio && {
      audio: {
        '@type': 'AudioObject',
        contentUrl: `${ORIGIN}${audio.src}`,
        encodingFormat: 'audio/mpeg',
        duration: isoDuration(audio.duration),
        name: `${headline} — narration`,
        ...(audio.captions && { caption: `${ORIGIN}${audio.captions}` }),
      },
    }),
  };
}
