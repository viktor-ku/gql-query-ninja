import { Action } from '../lib/Action'

export interface IDict<T = any> {
  [x: string]: T
}

export interface IVar {
  type: string
  nullable?: boolean
}

export type IFields = IDict<boolean | Action | IDict>
export type IVars = IDict<IVar>

export interface IState {
  operation: string
  args?: IVars
  fields?: IFields
}
