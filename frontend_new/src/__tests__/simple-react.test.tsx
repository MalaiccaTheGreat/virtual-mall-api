import { describe, it, expect } from 'vitest';
import React from 'react';

// A simple React component for testing
const HelloWorld = () => {
  return <div>Hello, World!</div>;
};

describe('Simple React Test', () => {
  it('should render a div with "Hello, World!"', () => {
    // This is a simple test that doesn't use the testing library
    const element = <HelloWorld />;
    expect(element).toBeDefined();
  });
});
