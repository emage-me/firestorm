import { get } from '../object.helper'
import { Instance } from './Instance'

export class FirestormQuery<T extends typeof Instance> {
  InstanceConstuctor: new(data: any, parent: any) => T
  query: any[]
  parent: any

  constructor (model, parent, data) {
    this.query = data
    this.InstanceConstuctor = model
    this.parent = parent
  }

  public async get (): Promise<Array<InstanceType<T>>> {
    return this.queryConvertor(this.query)
  }

  public async count (): Promise<Number> {
    return this.query.length
  }

  public async first (): Promise<InstanceType<T>|undefined> {
    return this.queryConvertor(this.query)[0]
  }

  public async firstOrFail (errorMessage?: string): Promise<InstanceType<T>> {
    const instance = this.queryConvertor(this.query)[0]
    if (instance === undefined) throw new Error(errorMessage ?? 'No instance found')
    return instance
  }

  public where (fieldPath: string, WhereFilterOp: string, value: any): FirestormQuery<T> {
    switch (WhereFilterOp) {
      case '==':
        this.query = this.query.filter(item => get(item, fieldPath) === value)
        break
      case '>=':
        this.query = this.query.filter(item => get(item, fieldPath) >= value)
        break
      case '<=':
        this.query = this.query.filter(item => get(item, fieldPath) <= value)
        break
      case 'array-contains':
        this.query = this.query.filter(item => (get(item, fieldPath) ?? []).includes(value))
        break
      default:
        throw new Error(`WhereFIlterOp ${WhereFilterOp} not implemented in firestrom mock`)
    }
    return this
  }

  public orderBy (fieldPath: string, orderByDirection): FirestormQuery<T> {
    // add orderByDirection case

    const orderMethod = orderByDirection === 'asc'
      ? (a, b) => a[fieldPath] - b[fieldPath]
      : (a, b) => b[fieldPath] - a[fieldPath]
    this.query = this.query.sort(orderMethod)
    return this
  }

  public limit (limit: number): FirestormQuery<T> {
    this.query = this.query.slice(0, limit)
    return this
  }

  public startAt (id: string): FirestormQuery<T> {
    let isfound = false
    this.query = this.query.filter(item => {
      if (item.id === id) isfound = true

      return isfound
    })
    return this
  }

  public startAfter (id: string): FirestormQuery<T> {
    this.startAt(id)
    this.query = this.query.slice(1)
    return this
  }

  public filters (filters: any[][]): FirestormQuery<T> {
    filters.forEach(([key, operator, value]) => {
      this.where(key, operator, value)
    })
    return this
  }

  public paginate (limit: number, id: string): FirestormQuery<T> {
    if (id != null) this.startAt(id)
    if (limit != null) this.limit(limit)
    return this
  }

  private queryConvertor (items: any[]): Array<InstanceType<T>> {
    return items.map(item => this.fromSnapshot(item))
  }

  public fromSnapshot (item: any): InstanceType<T> {
    const instance = new this.InstanceConstuctor(item, item?.parent) as InstanceType<T>
    return instance
  }
}
