import { Action } from './Action'

export class Subscription extends Action {
  get tag() {
    return 'subscription'
  }
}
