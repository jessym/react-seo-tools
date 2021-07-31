import React, { ReactElement } from 'react';

export type SeoHeadTagsProps = {
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

export function SeoHeadTags(props: SeoHeadTagsProps): ReactElement {
  const tags: JSX.Element[] = [];

  if (props.noIndex) {
    tags.push(<meta key="rst-noindex" name="robots" content="noindex" />);
  }

  if (props.title) {
    tags.push(<title key="rst-title">{props.title}</title>);
  }

  if (props.description) {
    tags.push(<meta key="rst-description" name="description" content={props.description} />);
  }

  if (props.openGraph) {
    Object.keys(props.openGraph)
      .map((key) => {
        const value = props.openGraph![key];
        if (typeof value === 'string') {
          return [<meta key={`rst-og-${key}-${value}`} property={`og:${key}`} content={value} />];
        }
        if (Array.isArray(value)) {
          return value.map((singleValue) => (
            <meta key={`rst-og-${key}-${singleValue}`} property={`og:${key}`} content={singleValue} />
          ));
        }
        return [];
      })
      .reduce((arr1, arr2) => [...arr1, ...arr2])
      .forEach((tag) => tags.push(tag));
  }

  if (props.structuredData) {
    const { breadcrumb, article } = props.structuredData;
    if (breadcrumb && breadcrumb.length > 0) {
      tags.push(
        <script key="rst-sd-breadcrumb" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumb.map((bc, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: bc.name,
              item: bc.item,
            })),
          })}
        </script>
      );
    }
    if (article) {
      tags.push(
        <script key="rst-sd-article" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.headline,
            image: [article.image],
            datePublished: article.datePublished,
          })}
        </script>
      );
    }
  }

  return <>{tags}</>;
}
