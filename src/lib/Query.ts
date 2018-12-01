import { last } from './last'
import { pad } from './pad'
import { stringifyField } from './stringifyFields'
import { IDict } from './types'

interface IVar {
  type: string
  nullable?: boolean
}

type IFields = IDict<boolean | Query | IDict>
type IVars = IDict<IVar>

interface IState {
  operation: string
  args?: IVars
  fields?: IFields
}

export class Query {
  private state: IState[] = []

  constructor(opOrOther: string | Query) {
    if (typeof opOrOther === 'string') {
      this.state = [{
        operation: opOrOther,
      }]
    } else if (opOrOther instanceof Object) {
      this.state = opOrOther.state
        .map((stateItem) => Object.assign({}, stateItem))
    } else {
      throw new Error('Operation name or base object required')
    }
  }

  public [Symbol.toPrimitive]() {
    return this.build()
  }

  public args(args: IVars): Query {
    last(this.state).args = args
    return this
  }

  public fields(fields: IFields): Query {
    last(this.state).fields = fields
    return this
  }

  public merge(other: Query) {
    this.state.push(...other.state.map((stateItem) => Object.assign({}, stateItem)))
    return this
  }

  get tag() {
    return 'query'
  }

  public build(): string {
    let ret = ''

    ret += this.tag

    if (this.state.some((stateItem) => !!stateItem.args)) {
      ret += ' (\n'

      this.state
        .filter((stateItem) => !!stateItem.args)
        .forEach(({ args }) => {
          for (const [key, typeDef] of Object.entries(args!)) {
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
      const { args, fields, operation } = stateItem

      if (index > 0) {
        ret += '\n'
      }

      ret += pad(operation, 2)

      if (args) {
        ret += ' (\n'

        for (const arg of Object.keys(args)) {
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
