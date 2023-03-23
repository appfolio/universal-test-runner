import { join } from 'path'
import { exists, nearestFiles } from '@appfolio/universal-test-runner-nearest-files'

export async function buildBaseTestCommand(): Promise<[string, string[]]> {
  let executable: string | undefined

  const nodeModulesBin = await nearestFiles([join('node_modules', '.bin', 'mocha')])
  if (nodeModulesBin.length > 0) {
    const mochaExecutablePath = nodeModulesBin[0].path

    if (await exists(mochaExecutablePath)) executable = mochaExecutablePath
  }

  if (executable === undefined) return ['/usr/bin/env', ['mocha']]
  else return ['/usr/bin/env', ['node', executable]]
}
