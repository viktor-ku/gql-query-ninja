import { Query } from '../src/lib/Query'
import { loadGql } from './lib/loadGql'

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

describe('Query', () => {
  test('try to pass empty constructor and throw an error', () => {
    expect(() => {
      new Query()
    }).toThrow()
  })

  test('q01', () => {
    const actual = new Query('tasks')
      .fields({
        id: true,
        name: true,
        desc: true,
      })
      .build()

    expect(actual).toBe(q.q01)
  })

  test('q01 testing Symbol.toPrimitive', () => {
    const actual = new Query('tasks')
      .fields({
        id: true,
        name: true,
        desc: true,
      })
      .build()

    expect(`${actual}`).toBe(q.q01)
  })

  test('q02', () => {
    const actual = new Query('tasks')
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

    expect(actual).toBe(q.q02)
  })

  test('q03', () => {
    const actual = new Query('tasks')
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

    expect(actual).toBe(q.q03)
  })

  test('q03 from another instance', () => {
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

    expect(tasks.build()).toBe(q.q01)
    expect(tasksWithInput.build()).toBe(q.q03)
    expect(tasksWithNestedReturnAndInput.build()).toBe(q.q04)
  })

  test('q05 nullable input', () => {
    const actual = new Query('tasks')
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

    expect(actual).toBe(q.q05)
  })

  test('q07 merging tasks and users', () => {
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

    expect(combined.build()).toBe(q.q07)
  })

  test('q08 merging tasks with input and users', () => {
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

    expect(combined.build()).toBe(q.q08)
  })

  test('q09 merging tasks with input and users with input', () => {
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

    expect(combined.build()).toBe(q.q09)
  })

  // test('q10', () => {
  //   const comments = new Query('comments')
  //     .vars({
  //       commentId: {
  //         type: 'String',
  //       },
  //     })
  //     .fields({
  //       id: true,
  //       text: true,
  //       author: {
  //         id: true,
  //         name: true,
  //       },
  //     })

  //   const tasks = new Query('tasks')
  //     .fields({
  //       id: true,
  //       name: true,
  //       desc: true,
  //       comments,
  //     })

  //   expect(tasks.toString()).toBe(q.q10)
  // })
})
