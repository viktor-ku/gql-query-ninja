const fs = require('fs')
const path = require('path')

exports.loadGql = function loadGql(filename) {
  const filepath = path.resolve(__dirname, '../expected', `${filename}.gql`)

  return fs.readFileSync(filepath, 'utf8')
}
