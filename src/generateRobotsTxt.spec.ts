import { generateRobotsTxt } from './generateRobotsTxt';

describe(generateRobotsTxt, () => {
  it('generates an empty file if no options were specified', () => {
    // When
    const file = generateRobotsTxt({});

    // Then
    expect(file).toEqual('');
  });

  it('generates a policy for a single user-agent', () => {
    // When
    const file = generateRobotsTxt({
      policy: {
        userAgent: '*',
        allow: ['/abc'],
        disallow: '/def',
      },
    });

    // Then
    const expected = `
user-agent: *
allow: /abc
disallow: /def
    `;
    expect(file).toEqual(expected.trim());
  });

  it('generates multiple policies for a multiple user-agents', () => {
    // When
    const file = generateRobotsTxt({
      policy: [
        {
          userAgent: ['googlebot', 'googlebot-news'],
          allow: '/',
        },
        {
          userAgent: '*',
          disallow: ['/abc', '/def'],
        },
      ],
    });

    // Then
    const expected = `
user-agent: googlebot
user-agent: googlebot-news
allow: /

user-agent: *
disallow: /abc
disallow: /def
    `;
    expect(file).toEqual(expected.trim());
  });

  it('generates a single sitemap', () => {
    // When
    const file = generateRobotsTxt({
      sitemap: 'https://www.example.com/sitemap.xml',
    });

    // Then
    const expected = `
sitemap: https://www.example.com/sitemap.xml
    `;
    expect(file).toEqual(expected.trim());
  });

  it('generates multiple sitemaps', () => {
    // When
    const file = generateRobotsTxt({
      sitemap: ['https://www.example.com/sitemap.xml', 'https://www.example.com/sitemap2.xml'],
    });

    // Then
    const expected = `
sitemap: https://www.example.com/sitemap.xml
sitemap: https://www.example.com/sitemap2.xml
    `;
    expect(file).toEqual(expected.trim());
  });
});
