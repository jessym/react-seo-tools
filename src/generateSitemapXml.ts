import { toXML, XmlElement } from 'jstoxml';

export enum Changefreq {
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
    changefreq?: Changefreq | string;
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

  let root: XmlElement = {};

  if (options.urlSet) {
    root = {
      _name: 'urlset',
      _attrs: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
      _content: [],
    };
    options.urlSet.forEach(({ loc, lastmod, changefreq, priority }) => {
      const url: XmlElement = {
        _name: 'url',
        _content: [],
      };
      const urlContent = url._content as XmlElement[];
      urlContent.push({ loc });
      if (lastmod) urlContent.push({ lastmod });
      if (changefreq) urlContent.push({ changefreq });
      if (typeof priority === 'number') urlContent.push({ priority });
      // Add to root
      (root._content as XmlElement[]).push(url);
    });
  }

  if (options.sitemapIndex) {
    root = {
      _name: 'sitemapindex',
      _attrs: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
      _content: [],
    };
    options.sitemapIndex.forEach(({ loc, lastmod }) => {
      const sitemap: XmlElement = {
        _name: 'sitemap',
        _content: [],
      };
      const sitemapContent = sitemap._content as XmlElement[];
      sitemapContent.push({ loc });
      if (lastmod) sitemapContent.push({ lastmod });
      // Add to root
      (root._content as XmlElement[]).push(sitemap);
    });
  }

  return toXML(root, {
    indent: options.pretty ? '  ' : undefined,
    header: '<?xml version="1.0" encoding="UTF-8"?>',
  });
}
