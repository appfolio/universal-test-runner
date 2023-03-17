jest.mock('../src/log')

describe('Locater', () => {
  describe('nearestFiles', () => {
    const cwd = jest.fn()
    const access = jest.fn()

    beforeEach(() => {
      cwd.mockReset()
      access.mockReset()

      jest.doMock('node:process', () => ({ cwd }))
      jest.doMock('node:fs/promises', () => ({ access }))
    })

    it('should recurse up a directory to locate the nearest file', async () => {
      cwd.mockReturnValue('/foo/bar/baz')
      const { nearestFiles } = await import('../src/index')
      access.mockRejectedValueOnce(null)
      access.mockResolvedValueOnce(null)

      const result = await nearestFiles(['node_modules'])

      expect(result).toEqual([{ filename: 'node_modules', path: '/foo/bar/node_modules' }])
      expect(access).toHaveBeenCalledTimes(2)
    })

    it('should locate a file in the current directory', async () => {
      cwd.mockReturnValue('/foo/bar/baz')
      const { nearestFiles } = await import('../src/index')
      access.mockResolvedValueOnce(null)

      const result = await nearestFiles(['node_modules'])

      expect(result).toEqual([{ filename: 'node_modules', path: '/foo/bar/baz/node_modules' }])
      expect(access).toHaveBeenCalledTimes(1)
    })

    it('should locate multiple filetypes', async () => {
      cwd.mockReturnValue('/foo/bar/baz')
      const { nearestFiles } = await import('../src/index')
      access.mockRejectedValueOnce(null)
      access.mockRejectedValueOnce(null)
      access.mockResolvedValueOnce(null)
      access.mockResolvedValueOnce(null)

      const result = await nearestFiles(['node_modules', 'Gemfile.lock'])

      expect(result).toEqual([
        { filename: 'node_modules', path: '/foo/bar/node_modules' },
        { filename: 'Gemfile.lock', path: '/foo/bar/Gemfile.lock' },
      ])
      expect(access).toHaveBeenCalledTimes(4)
    })

    it('should return first file located even if more exist in parent directory', async () => {
      cwd.mockReturnValue('/foo/bar/baz')
      const { nearestFiles } = await import('../src/index')
      access.mockResolvedValueOnce(null)
      access.mockRejectedValueOnce(null)
      access.mockResolvedValueOnce(null)
      access.mockResolvedValueOnce(null)

      const result = await nearestFiles(['node_modules', 'Gemfile.lock'])

      expect(result).toEqual([{ filename: 'node_modules', path: '/foo/bar/baz/node_modules' }])
      expect(access).toHaveBeenCalledTimes(2)
    })
  })
})
