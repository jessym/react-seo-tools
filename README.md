# React SEO Tools

This library for React-based websites and applications can be used to:

- generate SEO-related tags for the HTML `<head>` section
- generate a `robots.txt` file for search engine crawlers
- generate a `sitemap.xml` overview file of URLs

# Installation

**Yarn**

```
yarn add react-seo-tools
```

**NPM**

```
npm install react-seo-tools
```

# Imports

```ts
// This imports the entire bundle via this library's index file
import { generateHeadTags, generateRobotsTxt, generateSitemapXml } from 'react-seo-tools';

// But each of these utilities can also be imported from their own file,
// which might help to keep your own website's bundle size low
import { generateHeadTags } from 'react-seo-tools/lib/generateHeadTags';
import { generateRobotsTxt } from 'react-seo-tools/lib/generateRobotsTxt';
import { generateSitemapXml } from 'react-seo-tools/lib/generateSitemapXml';
```

# Usage

## GenerateHeadTags

> [Click here for an overview of the available API options](./src/generateHeadTags.tsx)

This function generates an array of elements which can be inserted into the `<head>` section of your HTML page.
If you're using the [**Next.js**](https://nextjs.org/) framework,
you would render these elements inside `<Head></Head>`, as shown by the example below.

If you're not using Next.js,
you might want to consider including the [**react-helmet**](https://github.com/nfl/react-helmet) library in your project,
so you can render the head elements inside a pair of `<Helmet></Helmet>` tags.

```tsx
import Head from 'next/head';
import { generateHeadTags } from 'react-seo-tools/lib/generateHeadTags';

export default function ArticlePage() {
  return (
    <div>
      <Head>
        {generateHeadTags({
          title: 'Website - Articles - How to SEO',
          description: 'Want to learn SEO with React? Look no further!',
          openGraph: {
            type: 'article',
            title: 'How to SEO',
            image: 'https://www.example.com/how-to-seo.jpg',
            'article:author': 'Jessy',
            'article:tag': ['react', 'testing'],
            'article:published_time': '2020-12-31',
          },
        })}
      </Head>
      <main>
        <h1>How to SEO</h1>
        <p>...</p>
      </main>
    </div>
  );
}

/**********************

<head>
  <title>Website - Articles - How to SEO</title>
  <meta name="description" content="Want to learn SEO with React? Look no further!"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="How to SEO"/>
  <meta property="og:image" content="https://www.example.com/how-to-seo.jpg"/>
  <meta property="og:article:author" content="Jessy"/>
  <meta property="og:article:tag" content="react"/>
  <meta property="og:article:tag" content="testing"/>
  <meta property="og:article:published_time" content="2020-12-31"/>
</head>

**********************/
```

## GenerateRobotsTxt

> [Click here for an overview of the available API options](./src/generateRobotsTxt.ts)

This function generates a string which can be served as your website's `robots.txt` file.

Here's how you would use it in a **Next.js lambda**.

```ts
import { generateRobotsTxt } from 'react-seo-tools/lib/generateRobotsTxt';

export default function (req, res) {
  const robotsTxt = generateRobotsTxt({
    policy: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'http://localhost:8080/sitemap.xml',
  });
  res.setHeader('Content-Type', 'text/plain');
  res.write(robotsTxt);
  res.end();
}

/**********************

user-agent: *
allow: /

sitemap: http://localhost:8080/sitemap.xml

**********************/
```

And here's how you'd use it with **Express in a Node environment**.

```js
const express = require('express');
const { generateRobotsTxt } = require('react-seo-tools/lib/generateRobotsTxt');

const app = express();

app.get('/robots.txt', (req, res) => {
  const robotsTxt = generateRobotsTxt({
    policy: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'http://localhost:8080/sitemap.xml',
  });
  res.type('text/plain').end(robotsTxt);
});

app.listen(8080);

/**********************

user-agent: *
allow: /

sitemap: http://localhost:8080/sitemap.xml

**********************/
```

## GenerateSitemapXml

> [Click here for an overview of the available API options](./src/generateSitemapXml.ts)

This function generates a string which can be served as your website's `sitemap.xml` file.

Here's how you would use it in a **Next.js lambda**.

```ts
import { generateSitemapXml, Changefreq } from 'react-seo-tools/lib/generateSitemapXml';

export default function (req: NextApiRequest, res: NextApiResponse) {
  const sitemapXml = generateSitemapXml({
    urlSet: [
      { loc: '/' },
      { loc: '/articles', lastmod: '2020-12-31', changefreq: Changefreq.daily },
      { loc: '/articles/123', lastmod: '2020-12-31', changefreq: Changefreq.monthly },
    ],
  });
  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemapXml);
  res.end();
}

/**********************

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>/</loc>
  </url>
  <url>
    <loc>/articles</loc>
    <lastmod>2020-12-31</lastmod>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>/articles/123</loc>
    <lastmod>2020-12-31</lastmod>
    <changefreq>monthly</changefreq>
  </url>
</urlset>

**********************/
```

And here's how you'd use it with **Express in a Node environment**.

```js
const express = require('express');
const { generateSitemapXml, Changefreq } = require('react-seo-tools/lib/generateSitemapXml');

const app = express();

app.get('/sitemap.xml', (req, res) => {
  const sitemapXml = generateSitemapXml({
    urlSet: [
      { loc: '/' },
      { loc: '/articles', lastmod: '2020-12-31', changefreq: Changefreq.daily },
      { loc: '/articles/123', lastmod: '2020-12-31', changefreq: Changefreq.monthly },
    ],
  });
  res.type('application/xml').end(sitemapXml);
});

app.listen(8080);

/**********************

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>/</loc>
  </url>
  <url>
    <loc>/articles</loc>
    <lastmod>2020-12-31</lastmod>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>/articles/123</loc>
    <lastmod>2020-12-31</lastmod>
    <changefreq>monthly</changefreq>
  </url>
</urlset>

**********************/
```
