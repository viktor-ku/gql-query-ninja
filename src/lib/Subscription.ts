import { Query } from './Query'

export class Subscription extends Query {
  get tag() {
    return 'subscription'
  }
}
