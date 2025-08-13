import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Add more specific assertions based on your App component
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
