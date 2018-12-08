import { Action } from './lib/Action'

export class Query extends Action {
  get tag() {
    return 'query'
  }
}

export class Mutation extends Action {
  get tag() {
    return 'mutation'
  }
}

export class Subscription extends Action {
  get tag() {
    return 'subscription'
  }
}
