import { Action } from './Action'

export class Mutation extends Action {
  get tag() {
    return 'mutation'
  }
}
