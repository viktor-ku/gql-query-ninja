import { Mutation } from '../src/main'
import { loadGql } from './lib/loadGql'

const m = {
  m01: loadGql('m01'),
}

describe('Mutation', () => {
  test('m01', () => {
    const actual = new Mutation('createTask')
      .args({
        task: {
          type: 'TaskCreateInput',
        },
      })
      .build()

    expect(actual).toBe(m.m01)
  })
})
