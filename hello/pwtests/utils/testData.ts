import { requireEnv } from './env';

export const credentials = {
  email: requireEnv('TEST_USER_EMAIL'),
  password: requireEnv('TEST_USER_PASSWORD'),
};

export const testsData = {
  schedulePrimary: requireEnv('TEST_SCHEDULE_PRIMARY', 'Regression'),
  scheduleSecondary: requireEnv('TEST_SCHEDULE_SECONDARY', 'Weekdays'),
  tag: requireEnv('TEST_TAG', 'Smoke'),
  renamedTag: requireEnv('TEST_TAG_RENAMED', 'Smoke - Updated'),
  testToClone: requireEnv('TEST_TO_CLONE', 'Test to be Cloned'),
  clonedTestName: requireEnv('CLONED_TEST_NAME', 'Test to be Cloned clone'),
  testToDelete: requireEnv('TEST_TO_DELETE', 'Test to be Cloned clone'),
  testSearchTerm: process.env.TEST_SEARCH_TERM ?? '',
  oldBaseUrl: requireEnv('TEST_BASE_URL_OLD', 'https://example-old.test'),
  newBaseUrl: requireEnv('TEST_BASE_URL_NEW', 'https://example-new.test'),
  newScheduleName: requireEnv('TEST_NEW_SCHEDULE_NAME', 'Automated Schedule Test'),
};

export const mobileData = {
  searchTerm: process.env.MOBILE_SEARCH_TERM ?? '',
};
