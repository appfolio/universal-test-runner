// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { makeLogger } from '@appfolio/universal-test-runner-logger'

const LOG_PREFIX = '[universal-test-adapter-jest]:'

export const log = makeLogger(LOG_PREFIX)
