const t = require('tap')
const { Query } = require('../dist/main')
const { loadGql } = require('./lib/loadGql')

const q = {
  q01: loadGql('q01'),
  q02: loadGql('q02'),
  q03: loadGql('q03'),
  q04: loadGql('q04'),
  q05: loadGql('q05'),
  q06: loadGql('q06'),
  q07: loadGql('q07'),
  q08: loadGql('q08'),
  q09: loadGql('q09'),
  q10: loadGql('q10'),
}

t.test('Query', t => {
  t.test('try to pass empty constructor and throw an error', t => {
    t.throw(() => {
      new Query()
    })

    t.end()
  })

  t.test('q01', t => {
    const found = new Query('tasks')
      .fields({
        id: true,
        name: true,
        desc: true,
      })
      .build()

    t.equal(found, q.q01)
    t.end()
  })

  t.test('q01 testing Symbol.toPrimitive', t => {
    const found = new Query('tasks')
      .fields({
        id: true,
        name: true,
        desc: true,
      })
      .build()

    t.equal(`${found}`, q.q01)
    t.end()
  })

  t.test('q02', t => {
    const found = new Query('tasks')
      .fields({
        id: true,
        name: true,
        desc: true,
        comments: {
          id: true,
          text: true,
          createdAt: true,
          author: {
            id: true,
            name: true,
            email: true,
          },
        },
      })
      .build()

    t.equal(found, q.q02)
    t.end()
  })

  t.test('q03', t => {
    const found = new Query('tasks')
      .args({
        taskId: {
          type: 'String',
        },
      })
      .fields({
        id: true,
        name: true,
        desc: true,
      })
      .build()

    t.equal(found, q.q03)
    t.end()
  })

  t.test('q03 from another instance', t => {
    const tasks = new Query('tasks')
      .fields({
        id: true,
        name: true,
        desc: true,
      })

    const tasksWithInput = new Query(tasks)
      .args({
        taskId: {
          type: 'String',
        },
      })

    const tasksWithNestedReturnAndInput = new Query(tasksWithInput)
      .fields({
        id: true,
        comments: {
          id: true,
        },
      })

    t.equal(tasks.build(), q.q01)
    t.equal(tasksWithInput.build(), q.q03)
    t.equal(tasksWithNestedReturnAndInput.build(), q.q04)
    t.end()
  })

  t.test('q05 nullable input', t => {
    const found = new Query('tasks')
      .args({
        query: {
          type: 'TaskQuery',
          nullable: true,
        },
      })
      .fields({
        id: true,
        name: true,
        desc: true,
      })
      .build()

    t.equal(found, q.q05)
    t.end()
  })

  t.test('q07 merging tasks and users', t => {
    const tasks = new Query('tasks')
      .fields({
        id: true,
        name: true,
        desc: true,
      })

    const users = new Query('users')
      .fields({
        id: true,
        name: true,
        email: true,
      })

    const combined = tasks.merge(users)

    t.equal(combined.build(), q.q07 )
    t.end()
  })

  t.test('q08 merging tasks with input and users', t => {
    const tasks = new Query('tasks')
      .args({
        taskId: {
          type: 'String',
        },
      })
      .fields({
        id: true,
        name: true,
        desc: true,
      })

    const users = new Query('users')
      .fields({
        id: true,
        name: true,
        email: true,
      })

    const combined = tasks.merge(users)

    t.equal(combined.build(), q.q08)
    t.end()
  })

  t.test('q09 merging tasks with input and users with input', t => {
    const tasks = new Query('tasks')
      .args({
        taskId: {
          type: 'String',
        },
      })
      .fields({
        id: true,
        name: true,
        desc: true,
      })

    const users = new Query('users')
      .args({
        userId: {
          type: 'String',
        },
      })
      .fields({
        id: true,
        name: true,
        email: true,
      })

    const combined = tasks.merge(users)

    t.equal(combined.build(), q.q09)
    t.end()
  })

  t.test('q10', t => {
    const comments = new Query('comments')
      .args({
        commentId: {
          type: 'String',
        },
      })
      .fields({
        id: true,
        text: true,
        author: {
          id: true,
          name: true,
        },
      })

    const tasks = new Query('tasks')
      .fields({
        id: true,
        name: true,
        desc: true,
        comments,
      })

    t.equal(tasks.build(), q.q10)
    t.end()
  })

  t.end()
})
