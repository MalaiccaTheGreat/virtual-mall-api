import { render, screen, fireEvent } from '@testing-library/react';
import { Example } from '../Example';

describe('Example Component', () => {
  it('renders the counter', () => {
    render(<Example />);
    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  });

  it('increments the counter when the button is clicked', () => {
    render(<Example />);
    const button = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(button);
    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
  });
});
