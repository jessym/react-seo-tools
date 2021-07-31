import { render } from '@testing-library/react';
import React from 'react';
import { generateHeadTags, HeadTagsOptions } from './generateHeadTags';

describe(generateHeadTags, () => {
  beforeEach(() => {
    jest.spyOn(console, 'error');
  });

  afterEach(() => {
    // Make sure there aren't any errors, like:
    //  - `Warning: Each child in a list should have a unique "key" prop`
    //  - `Warning: Encountered two children with the same key`
    expect(console.error).not.toHaveBeenCalled();
  });

  it('renders nothing for an empty options object', () => {
    // Given
    const tags = generateHeadTags({});

    // When
    const { container } = render(<>{tags}</>);

    // Then
    expect(container.children.length).toEqual(0);
  });

  it('renders a noIndex tag', () => {
    // Given
    const tags = generateHeadTags({ noIndex: true });

    // When
    const { container } = render(<>{tags}</>);
    const element = container.children[0];

    // Then
    expect(container.children.length).toEqual(1);
    expect(element.tagName).toEqual('META');
    expect(element.getAttribute('name')).toEqual('robots');
    expect(element.getAttribute('content')).toEqual('noindex');
  });

  it('renders a title tag', () => {
    // Given
    const tags = generateHeadTags({ title: 'Hello World' });

    // When
    const { container } = render(<>{tags}</>);
    const element = container.children[0];

    // Then
    expect(container.children.length).toEqual(1);
    expect(element.tagName).toEqual('TITLE');
    expect(element.innerHTML).toEqual('Hello World');
  });

  it('renders a description tag', () => {
    // Given
    const tags = generateHeadTags({ description: 'My beautiful page' });

    // When
    const { container } = render(<>{tags}</>);
    const element = container.children[0];

    // Then
    expect(container.children.length).toEqual(1);
    expect(element.tagName).toEqual('META');
    expect(element.getAttribute('name')).toEqual('description');
    expect(element.getAttribute('content')).toEqual('My beautiful page');
  });

  it('renders OpenGraph tags', () => {
    // Given
    const tags = generateHeadTags({
      openGraph: {
        type: 'article',
        title: 'How to Test with Jest',
        image: 'https://cdn/image.jpg',
        'article:author': 'Jessy',
        'article:tag': ['javascript', 'jest', 'testing'],
        'article:published_time': '2020-12-31',
      },
    });

    // When
    const { container } = render(<>{tags}</>);

    // Then
    expect(container.children.length).toEqual(8);
    expect(findOpenGraphElements(container, 'type')[0].getAttribute('content')).toEqual('article');
    expect(findOpenGraphElements(container, 'title')[0].getAttribute('content')).toEqual('How to Test with Jest');
    expect(findOpenGraphElements(container, 'image')[0].getAttribute('content')).toEqual('https://cdn/image.jpg');
    expect(findOpenGraphElements(container, 'article:author')[0].getAttribute('content')).toEqual('Jessy');
    expect(findOpenGraphElements(container, 'article:tag')[0].getAttribute('content')).toEqual('javascript');
    expect(findOpenGraphElements(container, 'article:tag')[1].getAttribute('content')).toEqual('jest');
    expect(findOpenGraphElements(container, 'article:tag')[2].getAttribute('content')).toEqual('testing');
    expect(findOpenGraphElements(container, 'article:published_time')[0].getAttribute('content')).toEqual('2020-12-31');
  });

  it('doesn\'t add an "og" prefix to OpenGraph tags if the property key already starts with "og"', () => {
    // Given
    const tags = generateHeadTags({
      openGraph: {
        type: 'article',
        'og:title': 'How to Test with Jest',
      },
    });

    // When
    const { container } = render(<>{tags}</>);
    const element = container.children[1];

    // Then
    expect(container.children.length).toEqual(2);
    expect(element.getAttribute('property')).toEqual('og:title');
  });

  it('renders a StructuredData breadcrumb', () => {
    // Given
    const tags = generateHeadTags({
      structuredData: {
        breadcrumb: [
          { name: 'Home', item: 'https://www.example.com' },
          { name: 'Books', item: 'https://www.example.com/books' },
          { name: 'LOTR', item: 'https://www.example.com/books/lotr-4452' },
        ],
      },
    });

    // When
    const { container } = render(<>{tags}</>);
    const element = container.children[0];

    // Then
    expect(container.children.length).toEqual(1);
    expect(element.tagName).toEqual('SCRIPT');
    expect(element.getAttribute('type')).toEqual('application/ld+json');
    expect(JSON.parse(element.innerHTML)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.example.com' },
        { '@type': 'ListItem', position: 2, name: 'Books', item: 'https://www.example.com/books' },
        { '@type': 'ListItem', position: 3, name: 'LOTR', item: 'https://www.example.com/books/lotr-4452' },
      ],
    });
  });

  it('renders a StructuredData article', () => {
    // Given
    const tags = generateHeadTags({
      structuredData: {
        article: {
          headline: 'How to Test with Jest',
          image: 'https://cdn/image.png',
          datePublished: '2020-12-31',
        },
      },
    });

    // When
    const { container } = render(<>{tags}</>);
    const element = container.children[0];

    // Then
    expect(container.children.length).toEqual(1);
    expect(element.tagName).toEqual('SCRIPT');
    expect(element.getAttribute('type')).toEqual('application/ld+json');
    expect(JSON.parse(element.innerHTML)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Test with Jest',
      image: ['https://cdn/image.png'],
      datePublished: '2020-12-31',
    });
  });

  it('renders everything at the same time', () => {
    // Given
    const options: Required<HeadTagsOptions> = {
      noIndex: true,
      title: 'Hello World',
      description: 'My description',
      openGraph: {
        type: 'article',
      },
      structuredData: {
        article: {
          headline: 'My article',
          datePublished: '2020-12-31',
          image: 'https://cdn/example.com',
        },
        breadcrumb: [{ name: 'Bread', item: 'https://example.com' }],
      },
    };

    // When
    render(<>{generateHeadTags(options)}</>);

    // Then: no errors logged for duplicate keys, or anything
  });
});

function findOpenGraphElements(container: HTMLElement, property: string): HTMLElement[] {
  return Array.from(container.querySelectorAll(`meta[property="og:${property}"]`)) as HTMLElement[];
}
