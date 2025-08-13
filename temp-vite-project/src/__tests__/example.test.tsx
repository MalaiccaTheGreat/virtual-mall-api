import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

const Example = () => {
  return <div>Hello, Testing Library!</div>;
};

describe('Example Test', () => {
  it('renders the example component', () => {
    render(<Example />);
    expect(screen.getByText('Hello, Testing Library!')).toBeInTheDocument();
  });
});
