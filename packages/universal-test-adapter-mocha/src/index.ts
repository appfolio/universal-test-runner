import { spawn } from '@aws/universal-test-runner-spawn'
import { log } from './log'
import { buildBaseTestCommand } from './buildBaseTestCommand'

import { AdapterInput, AdapterOutput } from '@aws/universal-test-runner-types'

const toUnixPath = (filepath: string): string => {
  // https://quickref.me/convert-a-windows-file-path-to-unix-path
  return filepath.replace(/[\\/]+/g, '/').replace(/^([a-zA-Z]+:|\.\/)/, '')
}

export async function executeTests(adapterInput: AdapterInput): Promise<AdapterOutput> {
  const { testsToRun = [], reportFormat } = adapterInput

  const [executable, args] = await buildBaseTestCommand()

  for (const { testName, suiteName, filepath } of testsToRun) {
    if (filepath) {
      args.push('--file', filepath)
    }

    if (suiteName && testName) {
      args.push('--grep', `${suiteName} ${testName}`)
    } else {
      suiteName ? args.push('--grep', suiteName) : args.push('--grep', testName)
    }
  }

  switch (reportFormat) {
    case 'default':
      args.push('--reporter', 'mocha-junit-reporter')

      args.push('--reporter', 'spec')
      break
    case undefined:
      break
    default:
      log.warn(`Report format '${reportFormat} not supported!'`)
  }

  log.info(`Running tests with jest using command: ${[executable, ...args].join(' ')}`)

  const { status, error } = await spawn(executable, args)

  if (error) {
    log.error(error)
  }

  return { exitCode: status ?? 1 }
}
