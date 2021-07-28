import React from 'react';

export type MetaTagsOptions = {
  noIndex?: boolean;
  title?: string;
  description?: string;
};

export function generateMetaTags(options: MetaTagsOptions) {
  const tags: JSX.Element[] = [];
  if (options.noIndex) {
    tags.push(<meta key="rst-noindex" name="robots" content="noindex" />);
  }
  if (options.title) {
    tags.push(<title key="rst-title">{options.title}</title>);
  }
  if (options.description) {
    tags.push(<meta key="rst-description" name="description" content={options.description} />)
  }
  return (
    <React.Fragment>
      {tags}
    </React.Fragment>
  );
}