import type { APIRoute } from 'astro';

const SITE_URL = 'https://actora.art';

const buildRobotsTxt = (origin: URL) => `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap-index.xml', origin).toString()}
`;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL(SITE_URL);

  return new Response(buildRobotsTxt(origin), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
