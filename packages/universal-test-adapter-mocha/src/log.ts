import { makeLogger } from '@aws/universal-test-runner-logger'

const LOG_PREFIX = '[universal-test-adapter-mocha]:'

export const log = makeLogger(LOG_PREFIX)
