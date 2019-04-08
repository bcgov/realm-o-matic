import React from 'react';
import { render, cleanup } from 'react-testing-library';
// import ReactDOM from 'react-dom';
import App from '../src/components/App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<App />, div);
  cleanup();
});
