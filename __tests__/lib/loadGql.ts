import * as fs from 'fs'
import * as path from 'path'

export function loadGql(filename: string) {
  const filepath = path.resolve(__dirname, '../expected', `${filename}.gql`)
  return fs.readFileSync(filepath, 'utf8')
}
