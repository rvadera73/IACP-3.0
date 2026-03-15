import '@testing-library/jest-dom';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  document.body.innerHTML = '';
});
