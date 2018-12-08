const t = require('tap')
const { Mutation } = require('../dist/main')
const { loadGql } = require('./lib/loadGql')

const m = {
  m01: loadGql('m01'),
}

t.test('Mutation', t => {
  t.test('m01', t => {
    const found = new Mutation('createTask')
      .args({
        task: {
          type: 'TaskCreateInput',
        },
      })
      .build()

    t.equal(found, m.m01)
    t.end()
  })

  t.end()
})
