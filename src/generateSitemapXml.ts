import { create } from 'xmlbuilder2';

export enum ChangeFreq {
  always = 'always',
  hourly = 'hourly',
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
  never = 'never',
}

export type SitemapXmlOptions = {
  urlSet?: Array<{
    loc: string;
    lastmod?: string;
    changefreq?: ChangeFreq | string;
    priority?: number;
  }>;
  sitemapIndex?: Array<{
    loc: string;
    lastmod?: string;
  }>;
  pretty?: boolean;
};

/**
 * For more information, see: https://www.sitemaps.org/protocol.html
 */
export function generateSitemapXml(options: SitemapXmlOptions): string {
  if (options.urlSet && options.sitemapIndex) {
    throw new Error(`Either a 'urlset' or a 'sitemapindex' can be generated, but not both`);
  }
  const xml = create({ version: '1.0', encoding: 'UTF-8' });
  if (options.urlSet) {
    const root = xml.ele('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });
    options.urlSet.forEach(({ loc, lastmod, changefreq, priority }) => {
      const url = root.ele('url');
      url.ele('loc').txt(loc);
      if (lastmod) url.ele('lastmod').txt(lastmod);
      if (changefreq) url.ele('changefreq').txt(changefreq);
      if (typeof priority === 'number') url.ele('priority').txt(String(priority));
    });
  }
  if (options.sitemapIndex) {
    const root = xml.ele('sitemapindex', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' });
    options.sitemapIndex.forEach(({ loc, lastmod }) => {
      const sitemap = root.ele('sitemap');
      sitemap.ele('loc').txt(loc);
      if (lastmod) sitemap.ele('lastmod').txt(lastmod);
    });
  }
  return xml.end({ prettyPrint: options.pretty });
}
