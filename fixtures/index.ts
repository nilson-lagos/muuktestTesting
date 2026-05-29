// Barrel for the fixtures directory so specs can import from '../fixtures'
// as well as '../fixtures/auth.fixture'. Both resolve to the same extended
// Playwright `test` and re-exported `expect`.
export { test, expect } from './auth.fixture';
