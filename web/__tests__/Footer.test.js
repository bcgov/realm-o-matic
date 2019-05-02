import React from 'react';
import { render } from 'react-testing-library';
import { Footer } from '../src/components/UI/Footer';

describe('Footer Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});
