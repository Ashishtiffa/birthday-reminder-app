import { render, screen } from '@testing-library/react';
import App from './App';

test('renders birthday reminder heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Birthday Reminder/i);
  expect(headingElement).toBeInTheDocument();
});
