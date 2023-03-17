import { cwd } from 'node:process'
import { resolve, parse } from 'node:path'
import { access } from 'node:fs/promises'
import { log } from './log'

const systemRoot = parse(cwd()).root

/**
 * Searches for files by their filename in the current directory and all parent directories, until the system root is reached.
 * When passed multiple filenames, it will return the first directory in which it finds at least one of the requested filenames
 * and *not recurse further*. This means that if you pass multiple filenames and the first one is found in the current directory,
 * it will not search for the other filenames in parent directories so only one result will be returned.
 *
 * To search for multiple filenames in all parent directories, call this function multiple times with a single filename each time.
 *
 * @param {string[]} filenames The names of the files to search for.
 * @param {string} currentDirectory The directory to start the search in. Defaults to Node's current working directory.
 * @returns {Promise<LocatedFile[]>} An array of objects containing the filename and path of the located files.
 */
export async function nearestFiles(
  filenames: string[],
  currentDirectory = cwd(),
): Promise<LocatedFile[]> {
  log.debug(`Searching for "${filenames.join('", "')}" in "${currentDirectory}"`)
  if (filenames.length <= 0) return []

  const located: LocatedFile[] = []
  await Promise.all(
    filenames.map(async (filename) => {
      const currentPath = resolve(currentDirectory, filename)
      if (await exists(currentPath)) {
        log.debug(`Found "${filename}" at "${currentPath}"`)
        located.push({ filename: filename, path: currentPath })
      } else log.debug(`Could not find "${filename}" at "${currentPath}"`)
    }),
  )

  if (located.length > 0 || currentDirectory === systemRoot) {
    log.debug(`Search completed. Found ${located.length} files in "${currentDirectory}"`)
    return located
  }

  return nearestFiles(filenames, resolve(currentDirectory, '..'))
}

export async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch (e) {
    return false
  }
}

export interface LocatedFile {
  filename: string
  path: string
}
