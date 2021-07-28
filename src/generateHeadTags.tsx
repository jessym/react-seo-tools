import React from 'react';

export type MetaTagsOptions = {
  noIndex?: boolean;
  title?: string;
  description?: string;
  openGraph?: {
    type: string;
    [key: string]: string | string[];
  };
  structuredData?: {
    breadcrumb?: Array<{
      name: string;
      item: string;
    }>;
    article?: {
      headline: string;
      image: string;
      datePublished: string;
    };
  };
};

export function generateHeadTags(options: MetaTagsOptions): JSX.Element[] {
  const tags: JSX.Element[] = [];

  if (options.noIndex) {
    tags.push(<meta key="rst-noindex" name="robots" content="noindex" />);
  }

  if (options.title) {
    tags.push(<title key="rst-title">{options.title}</title>);
  }

  if (options.description) {
    tags.push(<meta key="rst-description" name="description" content={options.description} />);
  }

  if (options.openGraph) {
    Object.keys(options.openGraph)
      .map((key) => {
        if (!key.startsWith('og:')) {
          key = `og:${key}`;
        }
        const value = options.openGraph![key];
        if (typeof value === 'string') {
          return [<meta key={`${key}-${value}`} property={key} content={value} />];
        } else {
          return value.map((singleValue) => <meta key={`${key}-${singleValue}`} property={key} content={singleValue} />);
        }
      })
      .reduce((arr1, arr2) => [...arr1, ...arr2])
      .forEach((tag) => tags.push(tag));
  }

  if (options.structuredData) {
    const { breadcrumb, article } = options.structuredData;
    if (breadcrumb && breadcrumb.length > 0) {
      tags.push(
        <script
          key="rst-sd-breadcrumb"
          type="application/ld+json"
          // TODO: is this necessary ???
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumb.map((bc, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: bc.name,
                item: bc.item,
              })),
            }),
          }}
        />
      );
    }
    if (article) {
      tags.push(
        <script
          key="rst-sd-article"
          type="application/ld+json"
          // TODO: is this necessary ???
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: article.headline,
              image: [article.image],
              datePublished: article.datePublished,
            }),
          }}
        />
      );
    }
  }

  return tags;
}
