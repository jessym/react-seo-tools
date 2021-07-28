import { generateSitemapXml } from './generateSitemapXml';

describe(generateSitemapXml, () => {
  it('returns a static string', () => {
    const string = generateSitemapXml();
    expect(string).toEqual('Sitemap XML');
  });
});
