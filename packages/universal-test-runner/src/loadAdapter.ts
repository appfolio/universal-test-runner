// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { log } from './log'
import path from 'path'

import { Adapter } from '@appfolio/universal-test-runner-types'

export const builtInAdapters: { [key: string]: string } = {
  jest: '@appfolio/universal-test-adapter-jest',
  maven: '@appfolio/universal-test-adapter-maven',
  gradle: '@appfolio/universal-test-adapter-gradle',
  pytest: '@appfolio/universal-test-adapter-pytest',
  dotnet: '@appfolio/universal-test-adapter-dotnet',
} as const

export async function loadAdapter(rawAdapterModule: string, cwd: string): Promise<Adapter> {
  const adapterModule = builtInAdapters[rawAdapterModule] || rawAdapterModule

  try {
    const adapterImportPath = adapterModule.startsWith('.')
      ? resolveCustomAdapterPath(cwd, adapterModule)
      : adapterModule
    const adapter = await import(adapterImportPath)
    log.info('Loaded adapter from', adapterModule)
    return adapter
  } catch (e) {
    log.error('Failed to load adapter from', adapterModule)
    throw e
  }
}

function resolveCustomAdapterPath(cwd: string, adapterPath: string): string {
  // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
  return path.join(cwd, adapterPath)
}
