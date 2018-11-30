import { Action } from './Action'

export class Query extends Action {
  get tag() {
    return 'query'
  }
}
