import { render } from '@testing-library/react';
import React from 'react';
import { generateHeadTags } from './generateHeadTags';

describe(generateHeadTags, () => {
  it('should return an empty array for an empty object', () => {
    // When
    const tags = generateHeadTags({});

    // Then
    expect(tags).toHaveLength(0);
  });

  it('should render a title tag', () => {
    // Given
    const tags = generateHeadTags({ title: 'Hello World' });

    // When
    const { container } = render(<>{tags}</>);

    // Then
    const title = container.querySelector('title')!;
    expect(title.innerHTML).toEqual('Hello World');
  });
});
