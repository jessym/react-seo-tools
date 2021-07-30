import { render } from '@testing-library/react';
import React from 'react';
import { generateHeadTags } from './generateHeadTags';

describe(generateHeadTags, () => {
  it('renders nothing for an empty options object', () => {
    // Given
    const tags = generateHeadTags({});

    // When
    const { container } = render(<>{tags}</>);

    // Then
    tags.forEach((tag) => expect(tag.key).toBeTruthy());
    expect(container.children.length).toEqual(0);
  });

  it('renders a noIndex tag', () => {
    // Given
    const tags = generateHeadTags({ noIndex: true });

    // When
    const { container } = render(<>{tags}</>);
    const el = container.children[0];

    // Then
    tags.forEach((tag) => expect(tag.key).toBeTruthy());
    expect(container.children.length).toEqual(1);
    expect(el.tagName).toEqual('META');
    expect(el.getAttribute('name')).toEqual('robots');
    expect(el.getAttribute('content')).toEqual('noindex');
  });

  it('renders a title tag', () => {
    // Given
    const tags = generateHeadTags({ title: 'Hello World' });

    // When
    const { container } = render(<>{tags}</>);
    const el = container.children[0];

    // Then
    tags.forEach((tag) => expect(tag.key).toBeTruthy());
    expect(container.children.length).toEqual(1);
    expect(el.tagName).toEqual('TITLE');
    expect(el.innerHTML).toEqual('Hello World');
  });

  it('renders a description tag', () => {
    // Given
    const tags = generateHeadTags({ description: 'My beautiful page' });

    // When
    const { container } = render(<>{tags}</>);
    const el = container.children[0];

    // Then
    tags.forEach((tag) => expect(tag.key).toBeTruthy());
    expect(container.children.length).toEqual(1);
    expect(el.tagName).toEqual('META');
    expect(el.getAttribute('name')).toEqual('description');
    expect(el.getAttribute('content')).toEqual('My beautiful page');
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
    tags.forEach((tag) => expect(tag.key).toBeTruthy());
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
    const el = container.children[0];

    // Then
    tags.forEach((tag) => expect(tag.key).toBeTruthy());
    expect(container.children.length).toEqual(1);
    expect(el.tagName).toEqual('SCRIPT');
    expect(el.getAttribute('type')).toEqual('application/ld+json');
    expect(JSON.parse(el.innerHTML)).toEqual({
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
    const el = container.children[0];

    // Then
    tags.forEach((tag) => expect(tag.key).toBeTruthy());
    expect(container.children.length).toEqual(1);
    expect(el.tagName).toEqual('SCRIPT');
    expect(el.getAttribute('type')).toEqual('application/ld+json');
    expect(JSON.parse(el.innerHTML)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Test with Jest',
      image: ['https://cdn/image.png'],
      datePublished: '2020-12-31',
    });
  });
});

function findOpenGraphElements(container: HTMLElement, property: string): HTMLElement[] {
  return Array.from(container.querySelectorAll(`meta[property="og:${property}"]`)) as HTMLElement[];
}
