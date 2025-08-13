// This test is designed to help diagnose issues with @testing-library/react
import { describe, it, expect } from 'vitest';
import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';

// Set up JSDOM environment
globalThis.document = window.document;

// Re-export the render function with a different name to avoid conflicts
const render = rtlRender;

// A simple React component for testing
const HelloWorld = () => {
  return <div>Hello, Testing Library!</div>;
};

describe('Simple React Testing Library Test', () => {
  it('should render a div with "Hello, Testing Library!"', () => {
    render(<HelloWorld />);
    const element = screen.getByText('Hello, Testing Library!');
    expect(element).toBeInTheDocument();
  });
});
