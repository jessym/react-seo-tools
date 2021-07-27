import React from 'react';

type MetaTags = {
  title?: string;
  noIndex?: boolean;
  description?: string;
};

export function generateMetaTags(metaTags: MetaTags) {
  const x = <title>{metaTags.title}</title>;
  return (
    <React.Fragment>
      <meta />
    </React.Fragment>
  );
}