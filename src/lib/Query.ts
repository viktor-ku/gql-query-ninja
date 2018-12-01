import traverse = require('traverse')
import { last } from './last'
import { pad } from './pad'
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
  get tag() {
    return 'query'
  }

  public state: IState[] = []

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

  public build(): string {
    let ret = ''
    ret += '{\n'

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
        ret += this.walk(fields, 2)
      }
    })

    ret += '\n}\n'

    let h = ''

    traverse(this.state).nodes().forEach((node: IState) => {
      if (node instanceof Object && node.args && node.operation) {
        for (const [key, typeDef] of Object.entries(node.args)) {
          h += pad(`$${key}: ${typeDef.type}`, 2)

          if (typeDef.nullable === undefined || typeDef.nullable === false) {
            h += '!'
          }

          h += '\n'
        }
      }
    })

    return !!h
      ? `${this.tag} (\n${h}) ${ret}`
      : `${this.tag} ${ret}`
  }

  private walk(fields: IDict, level: number): string {
    let ret = ' {\n'

    for (const [key, value] of Object.entries(fields)) {
      ret += pad(key, level * 2)

      if (value instanceof Query) {
        ret += ' (\n'

        Object.keys(value.state[0].args!).forEach((arg) => {
          ret += pad(`${arg}: $${arg}\n`, level * 2 + 2)
        })

        ret += pad(')', level * 2)

        ret += this.walk(value.state[0].fields!, level + 1)
      } else if (value instanceof Object) {
        ret += this.walk(value, level + 1)
      }

      ret += '\n'
    }

    ret += pad('}', (level * 2) - 2)

    return ret
  }
}
