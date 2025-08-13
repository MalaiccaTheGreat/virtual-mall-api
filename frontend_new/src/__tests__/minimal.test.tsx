import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Minimal Test', () => {
  it('should pass', () => {
    render(<div>Hello, World!</div>);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });
});
