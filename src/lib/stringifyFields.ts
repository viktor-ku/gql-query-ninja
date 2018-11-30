import { pad } from './pad'
import { IDict } from './types'

export function stringifyField(fields: IDict, level: number): string {
  let ret = ' {\n'

  for (const [key, value] of Object.entries(fields)) {
    ret += pad(key, level * 2)

    if (value instanceof Object) {
      ret += stringifyField(value, level + 1)
    }

    ret += '\n'
  }

  ret += pad('}', (level * 2) - 2)

  return ret
}
