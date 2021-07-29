import { ChangeFreq, generateSitemapXml } from './generateSitemapXml';

describe(generateSitemapXml, () => {
  it('generates an empty file if no options were specified', () => {
    // When
    const xml = generateSitemapXml({});

    // Then
    const expected = `
<?xml version="1.0" encoding="UTF-8"?>
    `;
    expect(xml).toEqual(expected.trim());
  });

  it('throws an error when trying to generate both a url set and a sitemap index', () => {
    // When
    const action = () => generateSitemapXml({ urlSet: [], sitemapIndex: [] });

    // Then
    expect(action).toThrowError(`Either a 'urlset' or a 'sitemapindex' can be generated, but not both`);
  });

  it('generates a url set', () => {
    // When
    const xml = generateSitemapXml({
      urlSet: [
        { loc: '/' },
        { loc: '/articles', lastmod: '2020-12-31' },
        { loc: '/articles/123', lastmod: '2020-12-31', changefreq: ChangeFreq.daily },
        { loc: '/articles/123/comments', lastmod: '2020-12-31', changefreq: ChangeFreq.daily, priority: 0.2 },
      ],
      pretty: true,
    });

    // Then
    const expected = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>/</loc>
  </url>
  <url>
    <loc>/articles</loc>
    <lastmod>2020-12-31</lastmod>
  </url>
  <url>
    <loc>/articles/123</loc>
    <lastmod>2020-12-31</lastmod>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>/articles/123/comments</loc>
    <lastmod>2020-12-31</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.2</priority>
  </url>
</urlset>
    `;
    expect(xml).toEqual(expected.trim());
  });

  it('generates a sitemap index', () => {
    // When
    const xml = generateSitemapXml({
      sitemapIndex: [{ loc: '/sitemaps/website.xml' }, { loc: '/sitemaps/marketing.xml', lastmod: '2020-12-31' }],
      pretty: true,
    });

    // Then
    const expected = `
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>/sitemaps/website.xml</loc>
  </sitemap>
  <sitemap>
    <loc>/sitemaps/marketing.xml</loc>
    <lastmod>2020-12-31</lastmod>
  </sitemap>
</sitemapindex>
    `;
    expect(xml).toEqual(expected.trim());
  });
});
