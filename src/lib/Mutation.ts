import { Query } from './Query'

export class Mutation extends Query {
  get tag() {
    return 'mutation'
  }
}
