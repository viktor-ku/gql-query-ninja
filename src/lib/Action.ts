import { last } from './last'
import { pad } from './pad'
import { stringifyField } from './stringifyFields'
import { IDict } from './types'

interface IVar {
  type: string
  nullable?: boolean
}

interface IState {
  operation: string
  vars: IDict<IVar> | null
  fields: IDict | null
}

export class Action {
  private state: IState[] = []

  constructor(opOrOther: string | Action) {
    if (typeof opOrOther === 'string') {
      this.state = [{
        operation: opOrOther,
        vars: null,
        fields: null,
      }]
    } else if (opOrOther instanceof Object) {
      this.state = opOrOther.state
        .map((stateItem) => Object.assign({}, stateItem))
    } else {
      throw new Error('Operation name or base object required')
    }
  }

  public [Symbol.toPrimitive]() {
    return this.toString()
  }

  public vars(vars: IDict<IVar>): Action {
    last(this.state).vars = vars
    return this
  }

  public fields(fields: IDict): Action {
    last(this.state).fields = fields
    return this
  }

  public merge(other: Action) {
    this.state.push(...other.state.map((stateItem) => Object.assign({}, stateItem)))
    return this
  }

  get tag() {
    return ''
  }

  public toString(): string {
    let ret = ''

    ret += this.tag

    if (this.state.some((stateItem) => !!stateItem.vars)) {
      ret += ' (\n'

      this.state
        .filter((stateItem) => !!stateItem.vars)
        .forEach(({ vars }) => {
          for (const [key, typeDef] of Object.entries(vars!)) {
            ret += pad(`$${key}: ${typeDef.type}`, 2)

            if (typeDef.nullable === undefined || typeDef.nullable === false) {
              ret += '!'
            }

            ret += '\n'
          }
        })

      ret += ')'
    }

    ret += ' {\n'

    this.state.forEach((stateItem, index) => {
      const { vars, fields, operation } = stateItem

      if (index > 0) {
        ret += '\n'
      }

      ret += pad(operation, 2)

      if (vars) {
        ret += ' (\n'

        for (const arg of Object.keys(vars)) {
          ret += pad(`${arg}: $${arg}`, 4)
          ret += '\n'
        }

        ret += pad(')', 2)
      }

      if (fields) {
        ret += stringifyField(fields, 2)
      }
    })

    ret += '\n}\n'
    return ret
  }
}
