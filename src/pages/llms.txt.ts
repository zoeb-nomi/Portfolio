import type { APIRoute } from 'astro';
import { llmsTxt } from '../data/copy';

export const prerender = true;

export const GET: APIRoute = () => {
  return new Response(llmsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
