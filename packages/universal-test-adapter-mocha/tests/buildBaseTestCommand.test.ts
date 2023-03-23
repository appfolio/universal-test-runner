import { buildBaseTestCommand } from '../src/buildBaseTestCommand'
import path from 'path'
import { vol } from 'memfs'

jest.mock('fs')

describe('buildBaseTestCommand', () => {
  beforeEach(() => {
    vol.reset()
  })

  it('returns path to locally installed mocha if it exists', async () => {
    vol.fromJSON({ './node_modules/.bin/mocha': 'thisisthemochaexecutablelol' }, '.')

    const [executable, args] = await buildBaseTestCommand()

    expect(executable).toBe(['node_modules', '.bin', 'mocha'].join(path.sep))
    expect(args).toEqual([])
  })

  it('returns path to global mocha if local mocha is not installed', async () => {
    vol.fromJSON({}, '.')

    const [executable, args] = await buildBaseTestCommand()

    expect(executable).toBe('mocha')
    expect(args).toEqual([])
  })
})
